# 博客详情页改造计划

## 概述

对博客详情页进行改造，解决目录定位问题并统一风格。

---

## 当前状态分析

### 涉及文件

- `src/pages/blog/[slug].astro` - 博客详情页动态路由
- 可能还有相关的 TOC 组件

---

## 改动详述

### 改动 1：目录（TOC）改为全程 sticky

**当前问题:** 右侧目录在内容结束后不再跟随滚动，导致正文下半部分偏左，视觉上很别扭。

**解决方案:** 让目录始终 sticky 跟随滚动，直到文章正文结束。

```css
.article-layout {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 3rem;
  align-items: start; /* 关键：让两栏从顶部开始，不要 stretch */
}

.toc-inner {
  position: sticky;
  top: 80px; /* 导航栏高度 + 一些间距 */
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
```

**关键点:**
- `align-items: start` 确保右侧栏高度跟随自身内容
- sticky 设在目录内部容器上
- `top` 值避开 sticky 导航栏
- 目录会一直跟随滚动，直到正文区域结束

### 改动 2：页眉区域重设计

**当前:** 封面图上方只有日期和阅读时长（居中显示），文章标题在封面图下方直接出现

**改为:** 结构化的页眉信息

```
封面图上方:
- 分类（品牌色圆点 + 品牌色文字）
- 日期
- 阅读时长

封面图

封面图下方:
- 文章标题（28px，左对齐）
- 文章描述/摘要
```

**样式:**
```css
.article-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #9CA3AF;
  margin-bottom: 1.5rem;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.article-description {
  font-size: 16px;
  color: #9CA3AF;
  line-height: 1.6;
}
```

### 改动 3：目录标题改为花体

**当前:** 中文"目录"

**改为:** "Contents"（Playfair Display italic）

```css
.toc-title {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 改动 4：目录当前章节品牌色高亮

```css
.toc-link {
  display: block;
  font-size: 13px;
  color: #6B7280;
  padding: 0.25rem 0;
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 0.75rem;
}

.toc-link:hover {
  color: #ffffff;
}

.toc-link.active {
  color: #A855F7;
  border-left-color: #A855F7;
}
```

**当前章节检测:** 使用 IntersectionObserver 检测当前可见的 heading

### 改动 5：正文链接颜色统一

```css
.article-content a {
  color: #A855F7;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.3s ease;
}

.article-content a:hover {
  opacity: 0.8;
}
```

---

## 响应式处理

### ≤960px

- 隐藏右侧目录栏
- 正文变为单栏全宽

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

---

## 分类颜色映射

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

---

## 验收标准

1. [x] 目录全程 sticky 跟随滚动，直到文章结束
2. [x] 目录 `top` 值正确避开 sticky 导航栏
3. [x] 封面图上方有分类 + 日期 + 阅读时长，左对齐
4. [x] 文章标题 28px，左对齐，在封面图下方
5. [x] 目录标题为 Playfair Display italic 的 "Contents"
6. [x] 目录当前阅读章节用品牌紫色高亮 + 左侧竖线
7. [x] 正文链接为品牌紫色 #A855F7
8. [x] ≤960px 时目录隐藏，正文变为单栏全宽
9. [x] 所有过渡动画 transition: 0.3s ease

---

## 文件清单

| 序号 | 文件路径 | 修改类型 |
|-----|---------|---------|
| 1 | `src/pages/blog/[slug].astro` | 修改：页眉、布局、目录样式 |

---

## 实施步骤

1. 修改 `[slug].astro` - 重设计页眉区域
2. 修改 `[slug].astro` - 两栏布局 + sticky 目录
3. 修改 `[slug].astro` - 目录标题、链接样式、当前章节高亮
4. 修改 `[slug].astro` - 正文链接颜色
5. 测试验证所有功能
