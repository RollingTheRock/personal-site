# Notion CMS 集成 + 自动化部署计划

## 项目背景

将 Astro 博客从本地 Markdown 迁移到 Notion CMS，实现：
1. 内容通过 Notion 数据库管理
2. 构建时从 Notion API 拉取内容
3. GitHub Actions 定时自动部署

## 数据库结构

| Notion 属性 | 类型 | 映射到 |
|------------|------|--------|
| 标题 | title | title |
| Slug | text | slug |
| 摘要 | text | description |
| 状态 | status | filter (✅已发布) |
| 类型 | select | type (博客/项目/视频) |
| 发布日期 | date | date |
| 分类 | multi_select | categories |
| 标签 | multi_select | tags |
| 封面图 | file | image |
| 置顶 | checkbox | featured |

## 实施步骤

### Phase 1: 安装依赖

```bash
npm install @notionhq/client notion-to-md
```

### Phase 2: 创建 Notion 客户端

**文件**: `src/lib/notion.ts`
- 初始化 @notionhq/client
- 读取环境变量 NOTION_TOKEN, NOTION_DATABASE_ID
- 导出 notion client

### Phase 3: 创建数据拉取层

**文件**: `src/lib/notion-cms.ts`

实现函数：
1. `getAllPublishedPosts()` — 获取所有已发布文章
2. `getPostBySlug(slug)` — 根据 Slug 获取单篇
3. `getPostContent(pageId)` — 获取文章内容 (notion-to-md)
4. `getFeaturedPosts()` — 获取置顶文章
5. `getPostsByType(type)` — 按类型筛选
6. `getPostsByCategory(category)` — 按分类筛选

### Phase 4: 修改页面逻辑

| 页面 | 修改内容 |
|------|----------|
| `src/pages/blog/index.astro` | 使用 `getPostsByType('博客')` |
| `src/pages/blog/[...slug].astro` | 使用 `getAllPublishedPosts()` 生成路径 |
| `src/pages/projects/index.astro` | 使用 `getPostsByType('项目')` |
| `src/pages/projects/[...slug].astro` | 使用 `getAllPublishedPosts()` 生成路径 |
| `src/pages/index.astro` | 使用 `getFeaturedPosts()` |

### Phase 5: 环境配置

创建 `.env`:
```
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
```

创建 `.env.example`:
```
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
```

### Phase 6: GitHub Actions 更新

更新 `.github/workflows/deploy.yml`:
- 添加定时触发（每天北京时间 8:00）
- 添加 Notion 环境变量

### Phase 7: 图片处理

方案：构建时下载 Notion 图片到 `public/images/notion/`

## 检查清单

- [ ] 安装 @notionhq/client, notion-to-md
- [ ] 创建 src/lib/notion.ts
- [ ] 创建 src/lib/notion-cms.ts
- [ ] 修改博客列表页
- [ ] 修改博客详情页
- [ ] 修改项目列表页
- [ ] 修改项目详情页
- [ ] 修改首页
- [ ] 创建 .env 和 .env.example
- [ ] 更新 GitHub Actions
- [ ] 添加图片下载逻辑
- [ ] 构建成功
- [ ] 部署成功
