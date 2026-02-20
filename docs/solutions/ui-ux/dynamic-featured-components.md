# 首页精选组件动态化改造方案

## 问题背景
FeaturedPosts 和 FeaturedProjects 组件原本使用硬编码数据，导致内容更新后首页无法同步，需要手动维护两份数据。

## 解决方案
改为从 Content Collection 动态读取，使用 `featured: true` 字段筛选精选内容。

## 实现细节

### 1. 公共工具函数 (src/utils/constants.ts)

```typescript
// 分类颜色映射
export const CATEGORY_COLOR_MAP: Record<string, string> = {
  '思考': '#A855F7',
  '技术': '#06B6D4',
  'ACM': '#06B6D4',
  '基础算法': '#06B6D4',
  '项目': '#06B6D4',
  '生活': '#F97316',
  '随笔': '#F97316',
};

export const DEFAULT_BRAND_COLOR = '#A855F7';

// 获取品牌色
export function getBrandColor(categories: string[] = []): string {
  const firstCategory = categories[0];
  return CATEGORY_COLOR_MAP[firstCategory] || DEFAULT_BRAND_COLOR;
}

// 中文日期格式化
export function formatDateCN(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
```

### 2. FeaturedPosts.astro

```astro
---
import { getCollection } from 'astro:content';
import { CATEGORY_COLOR_MAP, DEFAULT_BRAND_COLOR, formatDateCN } from '../utils/constants';

const allPosts = await getCollection('blog', ({ data }) => !data.draft);
const featuredPosts = allPosts
  .filter(post => post.data.featured === true)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const mainPost = featuredPosts[0];
const sidePosts = featuredPosts.slice(1, 3);
---

{featuredPosts.length > 0 && (
  <section>...</section>
)}
```

**关键特性：**
- 过滤 `featured: true` 的博客
- 按日期倒序排列
- 第一篇为大卡片，后两篇为小卡片
- CSS 变量 `--hover-color` 实现动态标题 hover 颜色

### 3. FeaturedProjects.astro

```astro
---
import { getCollection } from 'astro:content';

const allProjects = await getCollection('projects');
const featuredProjects = allProjects
  .filter(project => project.data.featured === true)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

{featuredProjects.length > 0 && (
  <section>...</section>
)}
```

**关键特性：**
- 动态读取 GitHub/Demo 链接
- 卡片可点击跳转到项目详情页
- 外链按钮阻止事件冒泡

### 4. 数据字段映射

#### 博客
| 模板变量 | Content 字段 |
|---------|-------------|
| title | post.data.title |
| description | post.data.description |
| date | formatDateCN(post.data.date) |
| image | post.data.image |
| tag | post.data.categories[0] |
| link | /blog/${post.slug} |

#### 项目
| 模板变量 | Content 字段 |
|---------|-------------|
| title | project.data.title |
| description | project.data.description |
| image | project.data.image |
| tags | project.data.tech |
| github | project.data.github |
| demo | project.data.demo |
| link | /projects/${project.slug} |

## 使用方式

在博客或项目的 frontmatter 中设置 `featured: true`：

```yaml
---
title: "文章标题"
description: "文章描述"
date: 2026-01-20
featured: true  # ← 设置为精选
categories: ["技术"]
tags: ["算法"]
---
```

## 注意事项
- 没有精选内容时，整个板块不渲染
- 保持现有 HTML 结构和样式不变
- 标题 hover 颜色根据分类动态设置
