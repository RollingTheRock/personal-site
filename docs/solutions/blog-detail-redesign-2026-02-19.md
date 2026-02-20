---
title: "博客详情页改造经验总结"
date: 2026-02-19
category: "frontend"
tags: ["astro", "toc", "sticky", "css"]
---

## 问题背景

对博客详情页进行全新改造，使其风格与首页、博客列表页统一。

## 关键改造点

### 1. 页眉区域重设计

**改造前**：居中布局（分类 + 标题 + 描述 + 日期）
**改造后**：左对齐杂志风格

```
分类（品牌色圆点+文字）· 日期 · 阅读时长
大标题（30px，左对齐）
摘要（可选）
分割线
封面图
```

### 2. 两栏布局 + Sticky TOC

**关键点**：
- Grid 布局：`grid-template-columns: 1fr 250px`
- **不设 `align-items`**，让两列等高，sticky 才有滚动空间
- Sticky 设在目录内部容器，不是外层 wrapper

```css
.article-layout {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 3rem;
  /* 不设 align-items，默认 stretch */
}

.toc-sidebar {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
```

### 3. TOC 目录组件

**简化原则**：
- 只保留基础章节高亮（紫色文字 + 左侧竖线）
- 删除：滑动指示条、阅读进度条、微位移动画
- 使用 IntersectionObserver 检测当前章节

```css
.toc-link.active {
  color: #A855F7;
  border-left-color: #A855F7;
}
```

### 4. 分类颜色映射

硬编码映射，取 `categories[0]` 匹配：

```typescript
const categoryColorMap: Record<string, string> = {
  '思考': '#A855F7',
  '技术': '#06B6D4',
  'ACM': '#06B6D4',
  '基础算法': '#06B6D4',
  '项目': '#06B6D4',
  '生活': '#F97316',
  '随笔': '#F97316',
};
```

## 踩坑记录

### 1. rehype-slug 问题

- 最初为了 TOC 高亮添加了 `rehype-slug` 插件
- 但用户要求不依赖新 npm 包
- 最终方案：如果 heading 有 id 则高亮，没有 id 也不报错

### 2. Git 回滚策略

不同文件回滚到不同 commit：
- `astro.config.mjs` → 删除 rehype-slug
- `TableOfContents.astro` → 简化版本
- `[...slug].astro` → 全新改造（不回滚）

### 3. Sticky 定位失效

常见原因：
- 父容器有 `overflow: hidden/auto/scroll`
- Grid 设置了 `align-items: start` 导致高度不够
- Sticky 元素父容器高度不足

## 最终文件结构

```
src/pages/blog/[...slug].astro      # 页眉 + 两栏布局
src/components/TableOfContents.astro # 简化 TOC（基础高亮）
src/utils/readingTime.ts            # 阅读时间计算
```

## 验收清单

- [x] 页眉左对齐杂志风格
- [x] 两栏布局（正文 + TOC）
- [x] TOC sticky 跟随
- [x] 目录标题 Playfair Display italic
- [x] 基础章节高亮
- [x] 正文链接紫色
- [x] 响应式（≤1280px 隐藏 TOC）
- [x] 日期格式 YYYY.MM.DD
