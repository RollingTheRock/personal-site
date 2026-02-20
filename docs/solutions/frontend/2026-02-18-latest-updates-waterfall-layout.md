# LatestUpdates 瀑布流布局实现方案

## 问题背景

将传统的等宽网格布局重构为**瀑布流大小混排布局**，最新文章作为视觉焦点（大卡片），其余文章作为配角（小卡片），形成杂志感的阅读体验。

## 核心方案

### 1. 布局架构

采用**两排式瀑布流**：

```
┌─────────────────────────────────────────┐
│  大卡片 (3fr)  │      小卡片 (2fr)       │
│   (Featured)   │   ┌───────────┐        │
│                │   │  Small #1 │        │
│   60% 宽度     │   ├───────────┤        │
│   带摘要       │   │  Small #2 │        │
│                │   └───────────┘        │
├──────────┬──────────┬───────────────────┤
│ Small #3 │ Small #4 │    Small #5       │
│  (1fr)   │  (1fr)   │     (1fr)         │
└──────────┴──────────┴───────────────────┘
```

**CSS 实现**：

```css
/* 第一排：不等分 */
.top-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
}

.right-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 第二排：等分 */
.bottom-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
```

### 2. 内容降级策略

根据文章数量自适应，**不预留空位**：

| 数量 | 布局方案 |
|------|----------|
| 5条 | 大卡片 + 右侧2小 + 底部3小 |
| 4条 | 大卡片 + 右侧2小 + 底部1小 |
| 3条 | 大卡片 + 右侧2小 |
| 2条 | 大卡片 + 1小卡片（右侧单列） |
| 1条 | 仅大卡片全宽 |
| 0条 | 整个板块不渲染 |

**实现方式**：

```astro
{allItems.length > 0 && (
  <section>...</section>
)}
```

### 3. 分类颜色系统

硬编码映射表 + CSS 变量传递：

```ts
const categoryColorMap: Record<string, string> = {
  '思考': '#A855F7',  // 紫
  '技术': '#06B6D4',  // 青
  '生活': '#F97316',  // 橙
  // ...
};
```

通过内联样式注入 CSS 变量：

```astro
<a style={`--brand-color: ${item.brandColor}`}>
```

### 4. Hover 交互效果

```css
/* 1. 父容器 hover 时所有卡片变暗 */
.cards-grid:hover .card-item {
  opacity: 0.5;
}

/* 2. 被 hover 的卡片恢复 */
.cards-grid:hover .card-item:hover {
  opacity: 1;
}

/* 3. 图片去灰度 + 微放大 */
.card-item:hover .card-image {
  filter: grayscale(0%);
  transform: scale(1.05);
}

/* 4. 标题变品牌色（使用 CSS 变量） */
.card-item:hover .card-title {
  color: var(--brand-color);
}

/* 5. 圆点发光 */
.card-item:hover .card-dot {
  box-shadow: 0 0 8px var(--brand-color);
}
```

### 5. 响应式断点

```css
@media (max-width: 960px) {
  .top-row {
    grid-template-columns: 1fr; /* 大卡片全宽 */
  }

  .right-stack,
  .bottom-row {
    grid-template-columns: repeat(2, 1fr); /* 小卡片 2 列 */
  }
}
```

## 关键技巧

### 图片灰度效果

默认灰度，hover 恢复：

```css
.card-image {
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.card-item:hover .card-image {
  filter: grayscale(0%);
}
```

### 两行截断

使用 `-webkit-line-clamp`：

```css
.card-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 条件渲染摘要

仅大卡片在有 description 时显示：

```astro
{featuredItem.description && (
  <p class="card-description">{featuredItem.description}</p>
)}
```

## 文件位置

- 组件实现：`src/components/LatestUpdates.astro`
- 计划文档：`docs/plans/2026-02-18-refactor-latest-updates-waterfall-plan.md`

## 经验教训

1. **CSS Grid + Flexbox 组合**：不等分布局用 Grid，堆叠布局用 Flex，各司其职
2. **CSS 变量传递颜色**：避免为每种颜色写单独的 hover 规则
3. **容器 hover 控制子元素**：`.parent:hover .child` 模式实现焦点高亮
4. **移动优先的降级策略**：用 `:has()` 伪类处理特殊情况（如只有1个小卡片）

## 相关技术

- Astro Content Collections
- CSS Grid / Flexbox
- CSS 自定义属性（变量）
- `:has()` 伪类
- `-webkit-line-clamp` 文本截断
