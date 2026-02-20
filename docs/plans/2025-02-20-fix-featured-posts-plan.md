# 修复 FeaturedPosts 组件计划

## 任务概述

修复首页精选博客组件的两个问题：
1. 分类标签配色没有根据分类动态应用
2. 大卡片高度没有和右侧两个小卡片对齐

## 问题分析

### 问题 1：标签配色

**现状**：标签使用固定的白色文字和半透明黑色背景，没有根据分类动态设置颜色。

**修复方案**：
- 使用 `CATEGORY_COLOR_MAP` 动态设置标签边框颜色
- 标签文字保持白色，边框使用品牌色
- 或通过左边框/左边线的方式展示品牌色

### 问题 2：高度对齐

**现状**：
- 网格布局为 `grid-cols-[3fr_2fr]`，大卡片在左列，小卡片在右列堆叠
- 大卡片图片高度固定 `h-[200px]`
- 小卡片图片高度固定 `h-[120px]`
- 大卡片没有跨行，高度不对齐

**修复方案**：
- 改为 2x2 网格布局：`grid-cols-2 grid-rows-2`
- 大卡片使用 `row-span-2` 跨两行
- 大卡片容器设置 `h-full flex flex-col`
- 大卡片图片区域设置 `flex-1` 自动填充剩余空间

## 实现步骤

### Step 1: 修复标签颜色

在大卡片和小卡片的标签上动态应用品牌色作为边框色：

```astro
<span
  class="post-tag relative z-10 inline-block text-white text-xs px-3 py-1 rounded-md"
  style={`
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    border: 1px solid ${getPostColor(post.data.categories)};
  `}
>
```

### Step 2: 修复网格布局

修改网格容器：
- 从 `grid-cols-[3fr_2fr]` 改为 `grid-cols-2 grid-rows-2`
- 大卡片添加 `row-span-2 h-full`
- 大卡片内部改为 flex 布局

### Step 3: 响应式处理

移动端（≤768px）保持单列布局，不需要高度对齐。

## 文件变更

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `src/components/FeaturedPosts.astro` | 修改 | 修复标签颜色和高度对齐问题 |

## 检查清单

- [ ] 分类标签边框色根据分类动态应用
- [ ] 大卡片高度等于右侧两个小卡片总高度 + gap
- [ ] 移动端单列布局正常
- [ ] 其他样式和交互保持不变
