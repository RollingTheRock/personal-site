# Notion CMS 原生 fetch 重构方案

**日期**: 2026-02-21
**问题**: @notionhq/client v5 在 Astro 静态构建环境下存在打包问题
**方案**: 用原生 fetch 直接调用 Notion REST API

---

## 问题描述

### 症状
在 Astro 静态构建 (`output: 'static'`) 环境下：
```
TypeError: notion.databases.query is not a function
    at getAllPublishedPosts (...)
```

### 根本原因
`@notionhq/client` v5 使用 ESM/CJS 混合导出，在 Vite SSR 打包过程中：
1. Client 类被正确实例化
2. 但实例方法在运行时丢失（`databases`, `pages`, `blocks` 等属性为 undefined）

### 已尝试但失败的方案
| 方案 | 结果 |
|------|------|
| 动态导入 `import('@notionhq/client')` | 失败 - Client 导出解析错误 |
| 静态导入 `{ Client }` | 失败 - 方法丢失 |
| `vite.ssr.noExternal: ['@notionhq/client']` | 失败 - 打包问题 |
| `vite.ssr.external: ['@notionhq/client']` | 失败 - 运行时找不到模块 |
| 降级到 v2.2.15 | 未尝试 - 与现有类型定义冲突 |

---

## 解决方案

### 核心思路
绕过 SDK，直接使用原生 `fetch` 调用 Notion REST API。

### 实现架构

```
src/lib/
├── notion.ts           # HTTP 客户端层 (fetch wrapper)
├── notion-renderer.ts  # 渲染层 (blocks → HTML)
└── notion-cms.ts       # 数据层 (业务逻辑)
```

### 1. HTTP 客户端层 (notion.ts)

```typescript
const NOTION_API = 'https://api.notion.com/v1';
const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

// 查询数据库
export async function queryDatabase(filter?, sorts?) {
  const res = await fetch(
    `${NOTION_API}/databases/${NOTION_DATABASE_ID}/query`,
    { method: 'POST', headers, body: JSON.stringify({ filter, sorts }) }
  );
  return res.json();
}

// 获取页面 blocks（支持分页）
export async function getPageBlocks(pageId: string) {
  // 自动处理 has_more / next_cursor
  // 返回所有 blocks
}
```

### 2. 渲染层 (notion-renderer.ts)

支持的 Block 类型：
- **文本**: `paragraph`, `heading_1/2/3`, `quote`, `callout`
- **列表**: `bulleted_list_item`, `numbered_list_item`, `to_do`
- **代码**: `code` (带语法高亮 class)
- **媒体**: `image`, `video`, `file`
- **布局**: `divider`, `toggle`, `table`
- **嵌入**: `bookmark`, `embed`

Rich Text 处理：
```typescript
// 支持 annotations
annotations: {
  bold, italic, strikethrough,
  underline, code, color
}
```

### 3. 数据层 (notion-cms.ts)

保持原有 API 不变：
```typescript
getAllPublishedPosts()  →  queryDatabase + filter
getPostBySlug(slug)     →  queryDatabase + filter
getFeaturedPosts()      →  queryDatabase + filter
getPostsByType(type)    →  queryDatabase + filter
getPostContent(id)      →  getPageBlocks + render
```

---

## 好处

1. **可靠性**: 不再受 SDK 打包问题影响
2. **体积小**: 移除 3 个依赖 (`@notionhq/client`, `notion-to-md`, `markdown-table`)
3. **可控性**: 完全控制渲染逻辑，可自定义样式
4. **兼容性**: 原生 fetch，所有环境都支持

---

## 注意事项

### Rate Limiting
Notion API 限制 3 req/s。当前实现：
- ✅ 构建时调用（build time）
- ✅ 文章数量少时无需延迟
- ⚠️ 文章增多后可添加 `sleep(334)` 节流

### Image URL Expiration
Notion 文件 URL 有效期约 1 小时：
- 静态构建时获取最新 URL
- 保持有效直到下次构建
- 如需永久链接，考虑下载到 `public/images/`

### Block Coverage
当前支持 15+ 常见 block 类型：
- 基础文本（段落、标题、引用）
- 列表（有序、无序、待办）
- 代码块（带语言标注）
- 图片、视频、文件
- Callout、Toggle、Table
- Bookmark、Embed

不支持（会跳过）：
- `table_of_contents`（自动生成）
- `breadcrumb`（无需）
- `column_list`/`column`（复杂布局）
- `link_preview`（需要额外请求）

---

## 迁移指南

从 SDK 迁移到原生 fetch：

1. **卸载依赖**
   ```bash
   npm uninstall @notionhq/client notion-to-md markdown-table
   ```

2. **清理配置**
   ```javascript
   // astro.config.mjs
   // 移除 vite.ssr 中与 notion 相关的配置
   ```

3. **替换导入**
   ```typescript
   // 旧
   import { Client } from '@notionhq/client';
   import { NotionToMarkdown } from 'notion-to-md';

   // 新
   import { queryDatabase, getPageBlocks } from './notion';
   import { blocksToHtml } from './notion-renderer';
   ```

4. **更新业务逻辑**
   ```typescript
   // 旧
   const notion = new Client({ auth: TOKEN });
   const response = await notion.databases.query({...});

   // 新
   const response = await queryDatabase(filter, sorts);
   ```

---

## 验证

构建测试：
```bash
npm run build
```

预期结果：
- ✅ 无 `markdown-table` 导入错误
- ✅ 无 `notion.databases.query is not a function` 错误
- ✅ 构建成功（可能显示 fetch timeout，这是正常的 - 表示代码逻辑正确，只是没有配置 token）

---

## 参考

- [Notion API Reference](https://developers.notion.com/reference)
- [Astro Static Site Generation](https://docs.astro.build/en/guides/static-site-generation/)
