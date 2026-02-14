---
title: SEO 与 RSS 增强
date: 2026-02-14
category: seo
tags: [seo, rss, json-ld, open-graph]
---

# SEO 与 RSS 增强

## 问题背景

需要提升网站的搜索引擎可见性和社交分享体验。

## 解决方案

### 1. RSS 自动发现

在 `<head>` 中添加 RSS 自动发现标签，浏览器和 RSS 阅读器可自动检测：

```html
<link rel="alternate" type="application/rss+xml" title="RollingTheRock - RSS Feed" href="/rss.xml" />
```

### 2. Open Graph 标签

完整的 OG 标签支持：

```html
<meta property="og:type" content="website|article" />
<meta property="og:url" content="https://..." />
<meta property="og:title" content="页面标题" />
<meta property="og:description" content="页面描述" />
<meta property="og:image" content="https://.../og-image.jpg" />
<meta property="og:site_name" content="RollingTheRock" />
<meta property="og:locale" content="zh_CN" />
```

### 3. JSON-LD 结构化数据

创建 `JsonLd.astro` 组件支持多种 Schema 类型：

**BlogPosting**（博客文章）：
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '文章标题',
  description: '文章描述',
  datePublished: '2024-01-15T00:00:00.000Z',
  author: { '@type': 'Person', name: 'RollingTheRock' },
  image: 'https://.../cover.jpg',
  keywords: '标签1, 标签2'
}
```

**WebSite**（网站首页）：
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RollingTheRock',
  url: 'https://rollingtherock.github.io',
  description: '...',
  author: { '@type': 'Person', name: 'RollingTheRock' }
}
```

**Person**（个人介绍）：
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'RollingTheRock',
  url: 'https://rollingtherock.github.io',
  sameAs: ['https://github.com/RollingTheRock', ...]
}
```

### 4. robots.txt

```
User-agent: *
Allow: /
Sitemap: https://rollingtherock.github.io/sitemap-index.xml
```

## 验证工具

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **RSS Validator**: https://validator.w3.org/feed/

## 关键经验

1. **自动发现** - RSS link 标签让阅读器自动检测订阅源
2. **完整 OG** - og:site_name 和 og:locale 提升品牌识别
3. **结构化数据** - JSON-LD 帮助搜索引擎理解内容
4. **robots.txt** - 明确告诉爬虫 sitemap 位置

## 文件结构

```
src/
├── components/
│   └── JsonLd.astro         # 结构化数据组件
├── layouts/
│   └── BaseLayout.astro     # SEO 标签集成
└── pages/
    └── blog/[...slug].astro  # BlogPosting Schema
public/
└── robots.txt               # 爬虫规则
```
