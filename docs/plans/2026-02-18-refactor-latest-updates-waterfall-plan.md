# LatestUpdates 组件瀑布流重构计划

## 任务概述

重构 `src/components/LatestUpdates.astro`，将当前等宽四列卡片布局改为**瀑布流大小混排网格布局**。最新一条做大卡片（主角），其余做小卡片（配角），形成杂志感的不等分排列。

## 技术栈

- Astro + Tailwind CSS
- 数据来源：`src/content/blog/` 下的 Markdown 文件
- 组件路径：`src/components/LatestUpdates.astro`

## 数据字段

```tsx
// 当前使用的字段
title: string          // blog.data.title - 文章标题
date: Date             // blog.data.date - 发布日期
image: string          // blog.data.image - 封面图 URL
categories: string[]   // blog.data.categories - 分类数组
slug: string           // blog.slug - 文章路径

// 已在 Schema 中定义但当前未使用（本次需启用）
description: string    // blog.data.description - 文章摘要（仅大卡片显示）
```

## 任务分解

### 1. 数据获取与处理
- [ ] 保留现有数据获取逻辑（blog + project）
- [ ] 添加 description 字段读取
- [ ] 按日期排序（新→旧）
- [ ] 分离大卡片（第一条）和小卡片（其余）

### 2. 布局结构重构
- [ ] 桌面端第一排：3fr/2fr 不等分网格
- [ ] 右侧小卡片堆叠（flex-col）
- [ ] 第二排：3列等分小卡片
- [ ] 内容不足时自适应降级

### 3. 样式系统
- [ ] 大卡片样式（24px标题、摘要、分类日期）
- [ ] 小卡片样式（17px标题、无摘要）
- [ ] 分类颜色映射系统
- [ ] 封面图灰度+圆角样式

### 4. 交互效果
- [ ] Hover 时卡片高亮/其他变暗（opacity 0.5）
- [ ] 封面图去灰度 + scale(1.05)
- [ ] 标题变品牌色
- [ ] 圆点发光效果

### 5. 响应式适配
- [ ] ≤960px：大卡片全宽，小卡片 2 列
- [ ] 内容不足时的降级处理

### 6. 边界情况
- [ ] 无 description 时大卡片不渲染摘要
- [ ] 0 条数据时整个板块不渲染
- [ ] 少于 5 条时的自适应布局

## 布局规格详解

### 桌面端（>960px）

```css
/* 第一排：大卡片 + 右侧小卡片堆叠 */
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

/* 第二排：等分小卡片 */
.bottom-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}
```

### 内容降级规则

| 文章数 | 布局方案 |
|--------|----------|
| 5条 | 第一排（大+右2小）+ 第二排（3小） |
| 4条 | 第一排（大+右2小）+ 第二排仅1小 |
| 3条 | 仅第一排（大+右2小），无第二排 |
| 2条 | 仅第一排（大+1小并排） |
| 1条 | 大卡片全宽，无右侧 |
| 0条 | 整个板块不渲染 |

### 响应式（≤960px）

```css
@media (max-width: 960px) {
  .top-row {
    grid-template-columns: 1fr;
  }
  .bottom-row,
  .right-stack {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## 分类颜色映射

```ts
const categoryColorMap: Record<string, string> = {
  '思考': '#A855F7',
  '技术': '#06B6D4',
  'ACM': '#06B6D4',
  '基础算法': '#06B6D4',
  '项目': '#06B6D4',
  '生活': '#F97316',
  '随笔': '#F97316',
}
const defaultColor = '#A855F7'
```

## Hover 交互效果

```css
/* 父容器 hover 时，所有卡片降低透明度 */
.cards-grid:hover .card-item {
  opacity: 0.5;
  transition: all 0.3s ease;
}

/* 被 hover 的卡片恢复 */
.cards-grid:hover .card-item:hover {
  opacity: 1;
}

/* 封面图效果 */
.card-item .cover-img {
  filter: grayscale(100%);
  transition: all 0.3s ease;
}
.card-item:hover .cover-img {
  filter: grayscale(0%);
  transform: scale(1.05);
}

/* 标题变品牌色 */
.card-item:hover .card-title {
  color: var(--brand-color);
}

/* 圆点发光 */
.card-item:hover .dot {
  box-shadow: 0 0 8px var(--brand-color);
}
```

## 验收标准

1. [x] 最新一条显示为大卡片（60%宽，有摘要），其余为小卡片（无摘要）
2. [x] 桌面端第一排 60/40 不等分，第二排 3 列等分
3. [x] 内容不足时布局自动降级，无空位占位符
4. [x] 封面图默认灰度，hover 恢复彩色 + 微放大（`scale(1.05)`）
5. [x] hover 时标题变品牌色、圆点发光、其他卡片 `opacity: 0.5`
6. [x] 响应式：≤960px 大卡片全宽 + 小卡片 2 列
7. [x] 「查看全部 →」链接到 `/blog`
8. [x] 无 `description` 的文章大卡片不显示摘要，不报错
9. [x] 0 条文章时整个板块不渲染

## 相关文件

- 主要修改：`src/components/LatestUpdates.astro`
- 可能需要检查：`src/content/config.ts`（确认 description 字段）

## 风险点

1. 图片加载失败时的处理
2. 文章总数变化时的布局稳定性
3. 品牌色 CSS 变量传递的正确性
