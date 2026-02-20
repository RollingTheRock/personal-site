# 博客详情页改造

## 背景

解决目录定位问题并统一风格，改造博客详情页。

## 核心改动

### 1. 目录 sticky 全程跟随

**布局结构:**
```css
.article-layout {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 3rem;
  align-items: start; /* 关键：防止右侧栏被拉伸 */
}

.toc-inner {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
```

**关键点:**
- `align-items: start` 确保 grid 项不被拉伸到等高
- sticky 设在内部容器上，不是外层 aside
- `top: 80px` 避开 sticky 导航栏

### 2. 页眉重设计

**结构:** 分类(品牌色) → 日期 → 阅读时长 → 封面图 → 标题 → 描述

```
分类圆点 + 分类名 · 日期 · 阅读时长
[封面图]
文章标题
文章描述
```

**分类颜色映射:**
```typescript
const categoryColorMap = {
  '思考': '#A855F7',
  '技术': '#06B6D4',
  'ACM': '#06B6D4',
  '基础算法': '#06B6D4',
  '项目': '#06B6D4',
  '生活': '#F97316',
  '随笔': '#F97316',
};
```

### 3. 目录标题花体

```css
.toc-title {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 18px;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 4. 目录当前章节高亮

```css
.toc-link {
  color: #6B7280;
  border-left: 2px solid transparent;
  transition: all 0.3s ease;
}

.toc-link.active {
  color: #A855F7;
  border-left-color: #A855F7;
}
```

**IntersectionObserver 检测当前章节:**
```javascript
const observerOptions = {
  root: null,
  rootMargin: '-80px 0px -60% 0px', // 调整触发区域
  threshold: 0,
};
```

### 5. 正文链接颜色

```css
.article-body :global(a) {
  color: #A855F7;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

## 响应式处理

```css
@media (max-width: 960px) {
  .article-layout {
    grid-template-columns: 1fr;
  }
  .article-toc {
    display: none;
  }
}
```

## 经验总结

1. **Grid + Sticky 组合**: `align-items: start` 是关键，否则右侧栏会被拉伸到正文高度，sticky 无法正常工作
2. **CSS 变量传递**: 通过 `style="--brand-color: xxx"` 在组件间传递动态颜色
3. **IntersectionObserver**: 使用 `rootMargin` 调整触发区域，避免导航栏遮挡影响检测
4. **Astro 样式作用域**: 使用 `:global()` 选择器来样式化渲染后的 Markdown 内容

## 相关文件

- `src/pages/blog/[...slug].astro` - 博客详情页
- `src/components/TableOfContents.astro` - 目录组件
