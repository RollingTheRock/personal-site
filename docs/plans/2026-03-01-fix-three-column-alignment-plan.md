# 修复计划：最新动态板块三栏底部对齐

## 问题分析

### 当前布局问题

1. **Grid 对齐方式**: `align-items: start` 导致三栏顶部对齐，但内容高度不同
2. **项目数量**: 右侧显示3个项目，与左侧4篇博客高度不匹配
3. **高度差异**:
   - 左侧4个紧凑卡片总高度约 4 × (90px + 文字)
   - 中间大图卡片高度约 16:9比例 + 描述
   - 右侧3个大卡片高度约 3 × (16:9 + 文字) > 左侧高度

## 修改方案

### 修改 1: 调整项目数量

**位置**: `LatestUpdates.astro` 第56行

```astro
// 修改前
.slice(0, 3);  // 限制 3 个项目

// 修改后
.slice(0, 2);  // 限制 2 个项目
```

### 修改 2: 三栏拉伸对齐

**位置**: `LatestUpdates.astro` CSS 第283行

```css
/* 修改前 */
.three-col-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2.5rem;
  align-items: start;  /* 顶部对齐 */
}

/* 修改后 */
.three-col-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2.5rem;
  align-items: stretch;  /* 拉伸等高 */
}
```

### 修改 3: 左右栏内容填满高度

**位置**: 在 `.col-items` 样式后添加

```css
/* 确保左右两栏内容填满高度并均匀分布 */
.col-blog,
.col-projects {
  display: flex;
  flex-direction: column;
}

.col-blog .col-items,
.col-projects .col-items {
  justify-content: space-between;
  height: 100%;
  flex: 1;
}
```

### 修改 4: 中间栏内容自适应填充

**位置**: `.featured-content` 和 `.card-description` 样式

```css
.featured-content {
  padding-top: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-description {
  font-size: 14px;
  color: #a3a3a3;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;  /* 填充剩余空间 */
}
```

## 测试计划

### 桌面端 (>=960px)
- [ ] 三栏底部对齐
- [ ] 左侧显示4篇博客
- [ ] 右侧显示2个项目
- [ ] 中间大图正常显示

### 平板端 (<=960px)
- [ ] 三栏变为单栏堆叠
- [ ] 每栏显示自己的标题
- [ ] 博客和项目使用2列网格布局

### 移动端 (<=480px)
- [ ] 单栏布局正常
- [ ] 字体大小适配

## 风险检查

- [x] 移动端响应式不受影响 (媒体查询独立)
- [x] 悬停效果保持不变
- [x] 图片比例保持不变
- [x] 文字截断行为保持不变
- [x] "查看全部"链接保留

## 文件清单

| 文件路径 | 修改类型 | 修改点 |
|---------|---------|--------|
| `src/components/LatestUpdates.astro` | 修改 | 第56行: slice(0,3)→slice(0,2) |
| `src/components/LatestUpdates.astro` | 修改 | CSS: align-items: start→stretch |
| `src/components/LatestUpdates.astro` | 添加 | CSS: .col-blog/.col-projects 样式 |
| `src/components/LatestUpdates.astro` | 修改 | CSS: .featured-content/.card-description flex布局 |
