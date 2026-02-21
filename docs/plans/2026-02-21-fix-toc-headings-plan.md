# 修复计划：文章侧边目录（TOC）不显示

**日期**: 2026-02-21
**问题**: 切换到 Notion API 后，headings 数据为空，TOC 组件没有数据

---

## 问题分析

当前代码 (`src/pages/blog/[...slug].astro:34-47`)：
```typescript
const headings = content.split('\n')
  .filter(line => line.startsWith('#'))
  .map(line => { ... })
```

这个实现假设 `content` 是 Markdown 格式（以 `#` 开头的标题）。

但现在 `getPostContent()` 返回的是 HTML（通过 `blocksToHtml()` 渲染），所以：
- `content.split('\n')` 不会找到任何以 `#` 开头的行
- `headings` 数组为空
- TOC 组件没有数据可显示

---

## 修复方案

### 1. 修改 notion-renderer.ts - 给标题添加 id

确保所有标题渲染时包含 id 属性，用于锚点跳转：

```typescript
case 'heading_1':
  const h1Text = renderRichText(content.rich_text || []);
  const h1Slug = slugify(h1Text);
  return `<h1 id="${h1Slug}">${h1Text}</h1>\n`;
```

### 2. 创建 extractHeadings 函数

在 `src/lib/notion-cms.ts` 中添加：

```typescript
export function extractHeadings(html: string): { depth: number; slug: string; text: string }[] {
  const headings: { depth: number; slug: string; text: string }[] = [];
  const regex = /<h([1-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-3]>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const depth = parseInt(match[1]);
    const slug = match[2];
    // 去掉内部 HTML 标签，获取纯文本
    const text = match[3].replace(/<[^>]*>/g, '');
    headings.push({ depth, slug, text });
  }

  return headings;
}
```

### 3. 更新博客详情页

```typescript
import { getPostContent, extractHeadings } from '../../lib/notion-cms.js';

const content = await getPostContent(post.id, post.slug, post.type);
const headings = extractHeadings(content);
```

### 4. 需要添加的辅助函数

在 `notion-renderer.ts` 中添加 slugify：

```typescript
function slugify(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // 去掉 HTML 标签
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')     // 空格转连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留中文、字母、数字、连字符
    .substring(0, 50);        // 限制长度
}
```

---

## 文件变更清单

| 文件 | 变更 |
|------|------|
| `src/lib/notion-renderer.ts` | 给 h1/h2/h3 添加 id 属性；添加 slugify 函数 |
| `src/lib/notion-cms.ts` | 添加 extractHeadings 函数并导出 |
| `src/pages/blog/[...slug].astro` | 使用 extractHeadings 替代 Markdown 解析 |

---

## 验收标准

- [ ] 文章页面显示侧边目录（h2 和 h3 标题）
- [ ] 点击目录项平滑滚动到对应标题
- [ ] 滚动时目录高亮当前章节
- [ ] 中文标题正确处理
- [ ] 本地构建测试通过
