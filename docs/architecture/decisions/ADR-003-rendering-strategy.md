# ADR-003: Rendering Strategy

## Decision

| 页面类型 | 渲染模式 | 说明 |
|----------|----------|------|
| 首页 `/` | SSG | 静态生成，构建时获取最新内容 |
| 博客列表 `/blog` | SSG | 静态生成，支持分页 |
| 博客详情 `/blog/[slug]` | SSG | 基于 Content Collections 动态路由 |
| 分类页 `/blog/categories/[category]` | SSG | 动态路由，构建时生成所有分类 |
| 标签页 `/blog/tags/[tag]` | SSG | 动态路由，构建时生成所有标签 |
| 项目列表 `/projects` | SSG | 静态生成 |
| 视频列表 `/videos` | SSG | 静态生成 |
| 视频详情 `/videos/[slug]` | SSG | 动态路由 |
| 关于页 `/about` | SSG | 静态页面 |
| 404 | SSG | 自定义 404 页面 |
| RSS `/rss.xml` | Endpoint | 动态生成 RSS feed |

## Rationale

### 为什么选择纯 SSG？

1. **内容特性**：个人博客内容更新不频繁，不需要实时渲染
2. **性能优先**：SSG 提供最快的首屏加载
3. **CDN 友好**：所有页面可缓存，全球快速访问
4. **部署简单**：无需服务器，Vercel/Netlify 直接托管

### 动态路由策略

使用 Astro 的 `getStaticPaths()` 生成动态路由：

```astro
---
// /blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
---
```

构建时会生成所有可能的页面变体。

## Consequences

**正面影响**：
- 最优的性能表现
- 最低的托管成本
- 最简单的部署流程

**需要处理的问题**：
- 内容更新后需要重新构建
- 使用 ISR（增量静态再生成）或 Webhook 触发重新构建
