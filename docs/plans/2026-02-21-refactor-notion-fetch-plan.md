# Plan: 用原生 fetch 替换 @notionhq/client

**Date**: 2026-02-21
**Type**: refactor
**Status**: pending

---

## Problem Statement

`@notionhq/client` v5 在 Astro 静态构建环境下存在严重的打包问题：
- 错误：`TypeError: notion.databases.query is not a function`
- 原因：Client 类在 SSR/静态构建过程中方法丢失
- 已尝试多种解决方案均无效（动态导入、静态导入、不同 vite.ssr 配置）

## Solution

移除 `@notionhq/client`、`notion-to-md` 和 `markdown-table` 依赖，改用原生 `fetch` 直接调用 Notion REST API。

---

## Implementation Steps

### Step 1: 卸载有问题的依赖
```bash
npm uninstall @notionhq/client notion-to-md markdown-table
```

### Step 2: 重写 src/lib/notion.ts
创建基于 fetch 的 API 客户端：

**Functions:**
- `queryDatabase(filter?, sorts?)` - POST /databases/{id}/query
- `getPageBlocks(pageId)` - GET /blocks/{id}/children (支持分页)
- `isNotionConfigured()` - 检查环境变量

**Constants:**
- `NOTION_TOKEN` - 从 import.meta.env 读取
- `NOTION_DATABASE_ID` - 从 import.meta.env 读取
- `NOTION_API` - https://api.notion.com/v1
- `headers` - 包含 Authorization 和 Notion-Version

### Step 3: 创建 src/lib/notion-renderer.ts
实现 Notion Blocks → Markdown/HTML 转换器：

**Supported Block Types:**
| Block Type | Output |
|------------|--------|
| paragraph | `<p>` |
| heading_1/2/3 | `<h1>`/`<h2>`/`<h3>` |
| bulleted_list_item | `<ul><li>` |
| numbered_list_item | `<ol><li>` |
| code | `<pre><code class="language-{lang}">` |
| image | `<img src="{url}" alt="{caption}">` |
| quote | `<blockquote>` |
| callout | `<div class="callout">` |
| divider | `<hr>` |
| to_do | `<input type="checkbox">` |
| toggle | `<details><summary>` |
| bookmark | `<a>` with embed |
| embed | `<iframe>` or link |

**Rich Text Handling:**
遍历 `rich_text` 数组，根据 `annotations` 添加样式：
- bold → `<strong>`
- italic → `<em>`
- strikethrough → `<del>`
- underline → `<u>`
- code → `<code>`
- color → inline style or class

### Step 4: 更新 src/lib/notion-cms.ts
**Data Layer Functions:**
- `extractProperties(page)` - 解析 Notion page properties 为 Post 对象
- `getAllPublishedPosts()` - 查询状态="✅ 已发布" 的文章
- `getPostBySlug(slug)` - 根据 Slug 获取单篇文章
- `getFeaturedPosts()` - 获取置顶文章
- `getPostsByType(type)` - 按类型筛选
- `getPostsByCategory(category)` - 按分类筛选
- `getPostContent(pageId)` - 使用 renderer 转换 blocks

**Post Interface:**
```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  image: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  type: '博客' | '项目' | '视频';
}
```

### Step 5: 更新 astro.config.mjs
移除 `vite.ssr` 配置中关于 notion 的特殊处理。

---

## Technical Considerations

### Rate Limiting
Notion API 限制 3 requests/second。当前博客文章数量较少，暂不需要添加延迟。如需扩展，可在 fetch 之间添加 `await sleep(334)`。

### Image URL Expiration
Notion 文件 URL 有效期约 1 小时。构建时会获取最新 URL，由于是静态构建，图片会保持不变直到下次构建。

### Build Time Execution
所有 API 调用都在 `getStaticPaths()` 和组件渲染时执行（build time），不影响线上用户性能。

### Output Mode
保持 `output: 'static'`，无需改为 SSR。

---

## Files to Modify

1. `package.json` - 移除依赖
2. `src/lib/notion.ts` - 完全重写
3. `src/lib/notion-renderer.ts` - 新建
4. `src/lib/notion-cms.ts` - 更新实现
5. `astro.config.mjs` - 清理 vite.ssr 配置

---

## Success Criteria

- [ ] Build 成功无错误
- [ ] 博客列表页正常显示文章
- [ ] 文章详情页正常渲染内容
- [ ] 项目列表页正常显示
- [ ] 首页 Featured 区域正常显示

---

## Risks

1. **API 变化**: Notion API 可能变更，需要跟进维护
2. **Rate Limiting**: 文章数量增加后可能触发限制
3. **Block Coverage**: 部分特殊 block 类型可能渲染不正确
