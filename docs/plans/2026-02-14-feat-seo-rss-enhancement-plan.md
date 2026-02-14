---
title: SEO 与 RSS 增强
type: feat
date: 2026-02-14
---

# SEO 与 RSS 增强

## Overview

优化网站的 SEO（搜索引擎优化）和 RSS 订阅功能，提升搜索可见性和内容传播能力。

## Current State

- RSS 基础功能已存在 (`src/pages/rss.xml.ts`)
- 基础 SEO meta 标签已在 `BaseLayout` 中配置
- 缺少 Open Graph 和 Twitter Card 优化
- 缺少结构化数据 (JSON-LD)
- 缺少 robots.txt 和 sitemap 配置检查

## Proposed Solution

### 1. SEO 增强

#### Open Graph 标签优化
确保每个页面都有完整的 OG 标签：
- `og:title` - 页面标题
- `og:description` - 页面描述
- `og:image` - 分享图片 (1200x630)
- `og:url` - 规范 URL
- `og:type` - 页面类型 (website/article)
- `og:site_name` - 网站名称

#### Twitter Card 优化
- `twitter:card` - summary_large_image
- `twitter:title` - 页面标题
- `twitter:description` - 页面描述
- `twitter:image` - 分享图片

#### 结构化数据 (JSON-LD)
添加 Schema.org 标记：
- **网站**: WebSite schema
- **文章**: BlogPosting schema
- **个人**: Person schema

### 2. RSS 订阅增强

- 添加 RSS 自动发现标签
- 优化 RSS 内容（全文 vs 摘要）
- 添加 RSS 图标到页脚

### 3. 技术 SEO

- 检查并优化 robots.txt
- 验证 sitemap.xml 生成
- 添加 canonical URL
- 优化页面加载速度提示

### 4. 社交分享优化

- 准备默认分享图片
- 为文章生成独特分享图（可选）

## Technical Considerations

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/layouts/BaseLayout.astro` | 修改 | 增强 SEO 组件 |
| `src/components/SEO.astro` | 新增 | 专用 SEO 组件 |
| `src/components/JSON-LD.astro` | 新增 | 结构化数据组件 |
| `src/pages/rss.xml.ts` | 修改 | 优化 RSS 生成 |
| `public/robots.txt` | 检查/修改 | 爬虫规则 |
| `public/default-og-image.jpg` | 添加 | 默认分享图 |

### SEO 组件接口

```astro
// SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishDate?: Date;
  author?: string;
}
```

### JSON-LD 类型

```typescript
// 博客文章
type BlogPosting = {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  author: { '@type': 'Person'; name: string };
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
};
```

## Acceptance Criteria

- [ ] 每个页面有完整的 Open Graph 标签
- [ ] 每个页面有完整的 Twitter Card 标签
- [ ] 博客文章有 BlogPosting 结构化数据
- [ ] 网站首页有 WebSite 结构化数据
- [ ] RSS 有正确的 `<link rel="alternate">` 发现标签
- [ ] 所有页面有正确的 canonical URL
- [ ] robots.txt 配置正确
- [ ] 默认 OG 图片存在且尺寸正确
- [ ] 社交分享测试通过

## Testing

使用以下工具验证：
- Facebook Sharing Debugger
- Twitter Card Validator
- Google Rich Results Test
- RSS Validator
