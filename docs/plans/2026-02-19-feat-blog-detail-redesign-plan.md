# 博客详情页改造计划

## 概述

对博客详情页进行一次性完整改造，使其风格与已改造的首页和博客列表页统一。

---

## 当前状态分析

### 涉及文件

- `src/pages/blog/[...slug].astro` - 博客详情页动态路由
- `src/components/TableOfContents.astro` - TOC 目录组件

### 现有问题

1. 页眉区域居中布局，与首页杂志风格不统一
2. 目录 sticky 定位可能存在问题
3. 目录高亮功能依赖 rehype-slug，但用户要求不添加新依赖

---

## 改动详述

### 改动 1：页眉区域重设计

**当前**: 居中的分类标签 + 居中大标题 + 居中描述 + 居中日期 + 封面图

**改为**: 左对齐杂志感页眉

```
分类信息行（品牌色圆点 + 品牌色分类文字 · 日期 · 阅读时长）
大标题（30px，左对齐）
摘要（灰色 16px，可选）
分割线
封面图（全宽）
```

**样式**:
```css
.article-header { margin-bottom: 3rem; }
.article-meta { display: flex; align-items: center; gap: 0.5rem; font-size: 14px; color: #9CA3AF; }
.meta-category { color: var(--brand-color); display: flex; align-items: center; gap: 0.375rem; }
.meta-category .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand-color); }
.article-title { font-size: 30px; font-weight: 700; color: #ffffff; line-height: 1.3; }
.article-description { font-size: 16px; color: #9CA3AF; line-height: 1.6; }
.article-divider { border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 1.5rem 0; }
.article-cover { width: 100%; border-radius: 8px; }
```

**日期格式**: `YYYY.MM.DD` (如 2026.01.23)

### 改动 2：两栏布局 + TOC sticky

**布局**:
```css
.article-layout {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 3rem;
}
```

**响应式**:
```css
@media (max-width: 1280px) {
  .article-layout { grid-template-columns: 1fr; }
  .article-toc-wrapper { display: none; }
}
```

### 改动 3：TOC 目录组件改造

**目录标题**:
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

**目录 sticky**:
```css
.toc-sidebar {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
```

**目录链接**:
```css
.toc-link {
  display: block;
  font-size: 13px;
  color: #6B7280;
  padding: 0.375rem 0;
  padding-left: 0.75rem;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: all 0.3s ease;
}
.toc-link:hover { color: #ffffff; }
.toc-link.active { color: #A855F7; border-left-color: #A855F7; }
.toc-link-depth-3 { padding-left: 1.5rem; }
```

**章节高亮 JS**:
- 使用 IntersectionObserver 检测当前阅读位置
- 选择器: `.toc-link` 和 `h2[id], h3[id]`
- 匹配逻辑: 使用 `getAttribute('href')` 和 `endsWith` 匹配
- 默认高亮第一个目录项
- 只操作 `.toc-link` 的 active class，避免与导航栏冲突

### 改动 4：正文样式微调

**链接颜色**:
```css
.article-content a {
  color: #A855F7;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.3s ease;
}
.article-content a:hover { opacity: 0.8; }
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
const defaultColor = '#A855F7';
```

---

## 验收标准

1. [ ] 页眉：分类（品牌色圆点+文字）+ 日期 + 阅读时长 → 大标题 → 摘要 → 分割线 → 封面图，全部左对齐
2. [ ] 两栏布局：左侧正文 + 右侧 sticky 目录
3. [ ] 目录标题为 Playfair Display italic 的 "Contents"
4. [ ] 目录 sticky 跟随滚动，直到文章结束
5. [ ] 如果 heading 有 id，目录能高亮当前阅读章节（紫色文字 + 左侧紫色竖线）
6. [ ] 如果 heading 没有 id，页面正常显示，JS 不报错
7. [ ] 正文链接为品牌紫色
8. [ ] ≤1280px 时目录隐藏，正文单栏全宽
9. [ ] 日期格式 YYYY.MM.DD
10. [ ] 不依赖任何新的 npm 包

---

## 文件清单

| 序号 | 文件路径 | 修改类型 |
|-----|---------|---------|
| 1 | `src/pages/blog/[...slug].astro` | 修改：页眉重设计、两栏布局 |
| 2 | `src/components/TableOfContents.astro` | 修改：简化样式、基础高亮 JS |

---

## 实施步骤

1. 修改 `[...slug].astro` - 页眉区域重设计
2. 修改 `[...slug].astro` - 两栏布局
3. 修改 `TableOfContents.astro` - 目录样式和 sticky 定位
4. 修改 `TableOfContents.astro` - 基础高亮 JS
5. 修改 `[...slug].astro` - 正文链接样式
6. 测试验证所有功能
