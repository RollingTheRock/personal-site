# 博客详情页 TOC Sticky 跟随修复

## 问题描述

博客详情页目录（TOC）sticky 跟随功能失效。目录高亮已正常工作，但目录不会随文章滚动而固定在视口中。

## 根因分析

CSS `position: sticky` 失效的常见原因：

1. **overflow 设置**：sticky 元素的任何祖先元素设置了 `overflow: hidden/auto/scroll` 都会导致 sticky 失效
2. **Grid 布局问题**：Grid item 默认 stretch 填满行高，但如果设置了 `align-self: start`，item 高度会收缩为内容高度，sticky 就没有滚动空间
3. **父容器高度不足**：sticky 元素的直接父容器高度必须远大于 sticky 元素本身的高度

## 实际修复

### 文件 1: `src/components/TableOfContents.astro`

**问题**：`.toc-sidebar` 设置了 `max-height` 和 `overflow-y: auto`

**修复**：移除这两个属性

```css
/* 修复前 */
.toc-sidebar {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);  /* ← 删除 */
  overflow-y: auto;                   /* ← 删除 */
}

/* 修复后 */
.toc-sidebar {
  position: sticky;
  top: 80px;
}
```

### 文件 2: `src/pages/blog/[...slug].astro`

**问题**：`.article-toc` 设置了 `align-self: start` 和 `height: 100%`，这会阻止 aside 拉伸到正文高度

**修复**：移除这两个属性，只保留 `position: relative`

```css
/* 修复前 */
.article-toc {
  display: block;
  align-self: start;    /* ← 删除 */
  position: relative;
  height: 100%;         /* ← 删除 */
}

/* 修复后 */
.article-toc {
  display: block;
  position: relative;   /* 创建新的 containing block */
}
```

## 关键认知

1. **overflow 和 sticky 互斥**：任何 overflow 设置（除了 visible）都会创建新的 BFC，导致 sticky 失效
2. **Grid stretch 是 friend 不是 enemy**：默认 stretch 让 aside 高度等于正文高度，给 sticky 提供滚动空间
3. **sticky 元素的父容器必须有足够高度**：`position: relative` 创建 containing block，同时让 aside 自然拉伸

## 验证方法

在浏览器 Console 运行：

```javascript
// 1. 确认 sticky 生效
const sidebar = document.querySelector('.toc-sidebar');
console.log('position:', getComputedStyle(sidebar).position);  // 应输出 "sticky"

// 2. 确认无 overflow 问题
let el = sidebar;
while (el && el !== document.documentElement) {
  const s = getComputedStyle(el);
  const ov = s.overflow + ' ' + s.overflowX + ' ' + s.overflowY;
  if (!ov.includes('visible visible visible')) {
    console.log('OVERFLOW ISSUE:', el.tagName, el.className, '→', ov);
  }
  el = el.parentElement;
}

// 3. 确认父容器高度远大于目录高度
const parent = sidebar.parentElement;
console.log('sidebar height:', sidebar.offsetHeight, 'parent height:', parent.offsetHeight);
// parent height 应远大于 sidebar height
```

## 相关文件

- `src/components/TableOfContents.astro` - TOC 组件
- `src/pages/blog/[...slug].astro` - 博客详情页布局

## 修复时间

2026-02-19
