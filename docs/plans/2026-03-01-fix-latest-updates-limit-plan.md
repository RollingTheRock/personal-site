# 修复计划：最新动态板块固定数量限制

## 问题分析

### 当前行为
- `LatestUpdates.astro` 组件获取**所有**已发布内容并展示
- 随着文章和项目增加，板块会无限变长，破坏页面布局
- 没有数量限制，左右两侧列表会显示全部内容

### 目标行为
- **Recent Blogs**（左侧）：固定显示最新 4 篇博客
- **中间大图**：显示全站最新 1 篇内容（博客或项目）
- **Recent Projects**（右侧）：固定显示最新 3 个项目
- 整个板块高度固定，不随内容数量变化
- 旧内容自动不显示，"查看全部"链接保留

## 文件清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/components/LatestUpdates.astro` | 修改 | 添加 `.slice()` 限制数量 |
| `src/lib/notion-cms.ts` | 可选修改 | 为 `getAllPublishedPosts` 添加 limit 参数 |

## 具体修改方案

### 修改 1: LatestUpdates.astro - 数据过滤层添加限制

**位置**: 第 42-51 行

**当前代码**:
```astro
// 合并并按日期降序排列
const sortedItems = allItems.sort((a, b) => b.date.valueOf() - a.date.valueOf());

// 分离大卡片（最新一条）
const featuredItem = sortedItems[0] || null;
const remainingItems = sortedItems.slice(1);

// 分组：左侧博客（非项目），右侧项目
const blogItems_col = remainingItems.filter(item => !item.isProject);
const projectItems_col = remainingItems.filter(item => item.isProject);
```

**修改为**:
```astro
// 合并并按日期降序排列
const sortedItems = allItems.sort((a, b) => b.date.valueOf() - a.date.valueOf());

// 分离大卡片（最新一条）
const featuredItem = sortedItems[0] || null;
const remainingItems = sortedItems.slice(1);

// 分组：左侧博客（非项目），右侧项目，并限制数量
const blogItems_col = remainingItems
  .filter(item => !item.isProject)
  .slice(0, 4);  // 限制 4 篇博客

const projectItems_col = remainingItems
  .filter(item => item.isProject)
  .slice(0, 3);  // 限制 3 个项目
```

### 修改 2: 可选 - CSS 添加最大高度保护

如果需要更严格的高度控制，在 `.latest-section` 样式中添加：

```css
.latest-section {
  padding: 80px 0;
  border-bottom: 1px solid #1a1a1a;
  max-height: 800px;  /* 添加最大高度限制 */
  overflow: hidden;    /* 超出隐藏 */
}
```

**注意**: 当前设计不需要此修改，因为 `.slice()` 已经足够控制数量。

## 测试计划

1. **功能测试**:
   - [ ] 发布超过 4 篇博客，验证只显示 4 篇
   - [ ] 发布超过 3 个项目，验证只显示 3 个
   - [ ] 验证中间大图显示最新 1 篇
   - [ ] 验证 "查看全部" 链接保留

2. **边界测试**:
   - [ ] 博客不足 4 篇时正常显示
   - [ ] 项目不足 3 个时正常显示
   - [ ] 无内容时板块正常隐藏（已有 `sortedItems.length > 0` 判断）

3. **响应式测试**:
   - [ ] 移动端显示正常
   - [ ] 平板端显示正常

## 风险检查清单

- [x] 修改仅涉及数据切片，不影响样式
- [x] 不影响 "查看全部" 链接功能
- [x] 中间大图取自 `sortedItems[0]`，与左右列表不重复（`remainingItems = sortedItems.slice(1)`）
- [x] 空数据处理已有保护（`|| null`）

## 实现步骤

1. 修改 `LatestUpdates.astro` 第 50-51 行，添加 `.slice(0, N)`
2. 本地运行 `npm run dev` 验证效果
3. 构建测试 `npm run build`
4. 提交代码

## 预期结果

- 首页 Latest Updates 板块高度固定
- 博客列表最多 4 条
- 项目列表最多 3 条
- 新内容自动替换旧内容（按日期排序）
