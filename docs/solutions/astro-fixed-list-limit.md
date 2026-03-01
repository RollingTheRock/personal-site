# 解决方案：Astro 组件中限制列表显示数量

## 问题场景

首页"最新动态"板块随内容增加无限变长，需要固定展示数量，保持页面布局稳定。

## 解决方案

在数据过滤阶段使用 `.slice(0, N)` 限制数量：

```astro
---
// 分组并限制数量
const blogItems_col = remainingItems
  .filter(item => !item.isProject)
  .slice(0, 4);  // 限制 4 篇博客

const projectItems_col = remainingItems
  .filter(item => item.isProject)
  .slice(0, 3);  // 限制 3 个项目
---
```

## 关键点

### 1. 顺序很重要
先 `filter` 后 `slice`，确保正确分类后再限制：
```javascript
// ✓ 正确：先分类再限制
.filter(item => !item.isProject).slice(0, 4)

// ✗ 错误：先限制可能混入其他类型
.slice(0, 4).filter(item => !item.isProject)
```

### 2. 边界安全
`.slice(0, N)` 在数组长度不足时安全返回实际数量，不会报错：
```javascript
[1, 2].slice(0, 4)  // => [1, 2]，不会报错
```

### 3. 避免重复
确保中间大图与左右列表不重复：
```javascript
const featuredItem = sortedItems[0];           // 第 1 条
const remainingItems = sortedItems.slice(1);   // 第 2 条及以后
const blogItems = remainingItems.filter(...);  // 从第 2 条开始筛选
```

## 应用模式

此模式适用于任何需要固定数量列表的场景：
- 最新文章（限制 N 篇）
- 热门标签（限制 N 个）
- 推荐项目（限制 N 个）

## 参考实现

文件: `src/components/LatestUpdates.astro`
修改: 第 49-56 行
日期: 2026-03-01
