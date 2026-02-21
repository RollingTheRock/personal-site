# 排查计划：文章正文不显示

**日期**: 2026-02-21
**问题**: 本地 build 后文章正文为空，只显示标题、配图、标签

---

## 问题分析

从代码审查发现数据流如下：

1. `getStaticPaths()` → `getAllPublishedPosts()` → 合并 Notion + 本地文章
2. 对于本地 Markdown 文章，`post.id` = `entry.id`（不是 Notion UUID 格式）
3. 详情页调用 `getPostContent(post.id, post.slug, post.type)`
4. `getPostContent` 中检查 `isValidNotionPageId(pageId)` → 本地文章 ID 不是 32 位十六进制，返回 false
5. 跳到本地回退逻辑 → `getLocalBlogContent(slug)` → `getEntry('blog', slug)`
6. 返回 `entry.body`（原始 Markdown）

**可能的问题点**:
- A) `entry.body` 为空或 undefined
- B) `entry.body` 是 Markdown，但页面用 `set:html` 渲染期望 HTML
- C) Notion 文章 ID 传递问题

---

## 排查步骤

### 步骤 1: 在详情页添加调试日志

文件: `src/pages/blog/[...slug].astro`

添加内容:
```typescript
console.log('=== DEBUG: post.id ===', post.id);
console.log('=== DEBUG: post.slug ===', post.slug);
console.log('=== DEBUG: post.type ===', post.type);

const content = await getPostContent(post.id, post.slug, post.type);

console.log('=== DEBUG: content type ===', typeof content);
console.log('=== DEBUG: content length ===', content?.length);
console.log('=== DEBUG: content preview ===', content?.substring(0, 500));
```

### 步骤 2: 在 getPostContent 添加调试日志

文件: `src/lib/notion-cms.ts`

添加内容:
```typescript
export async function getPostContent(pageId: string, slug?: string, type?: string): Promise<string> {
  console.log('=== getPostContent called ===');
  console.log('=== pageId ===', pageId);
  console.log('=== slug ===', slug);
  console.log('=== type ===', type);
  console.log('=== isNotionConfigured ===', isNotionConfigured());
  console.log('=== isValidNotionPageId ===', isValidNotionPageId(pageId));

  // 1. 尝试从 Notion 获取
  if (isNotionConfigured() && isValidNotionPageId(pageId)) {
    try {
      const blocks = await getPageBlocks(pageId);
      console.log('=== Notion blocks count ===', blocks.length);
      const html = blocksToHtml(blocks);
      console.log('=== Notion HTML length ===', html.length);
      return html;
    } catch (error) {
      console.warn('Notion 内容获取失败，尝试本地回退:', error);
    }
  }

  // 2. 回退到本地 Markdown
  console.log('=== Falling back to local content ===');
  if (slug) {
    const localContent = type === '项目'
      ? await getLocalProjectContent(slug)
      : await getLocalBlogContent(slug);

    console.log('=== Local content length ===', localContent?.length);
    console.log('=== Local content preview ===', localContent?.substring(0, 500));

    if (localContent) {
      return localContent;
    }
  }

  return '';
}
```

### 步骤 3: 运行构建并分析日志

```bash
npm run build 2>&1 | tee build-debug.log
```

### 步骤 4: 根据日志定位并修复问题

预期结果:
- 如果 `content length` 为 0 → 检查 `getEntry` 返回值
- 如果 `content` 是 Markdown 格式 → 需要在 `getPostContent` 中将 Markdown 转换为 HTML
- 如果 `isValidNotionPageId` 始终为 false → 需要修复 ID 格式判断

---

## 修复方案（预估）

如果问题是本地 Markdown 返回的是原始 Markdown 而非 HTML:

```typescript
// 在 notion-cms.ts 顶部引入
import { Markdown } from '@astropub/md';

// 在 getPostContent 中修改本地回退逻辑
if (localContent) {
  // Markdown 需要转换为 HTML
  return localContent; // 或者使用 Markdown 解析器转换
}
```

实际上 `set:html` 可以直接渲染纯文本，但如果内容是 Markdown 格式，不会正确渲染格式。

---

## 验收标准

- [ ] 构建时调试日志正常输出
- [ ] 能定位到内容为空的具体原因
- [ ] 修复后文章正文正常显示
- [ ] 重新构建并本地验证通过
