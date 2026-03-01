# 解决方案：CSS 三栏布局底部对齐

## 问题场景

三栏布局（左中右）内容高度不同时，需要让三栏底部对齐，保持视觉整齐。

## 解决方案

使用 **CSS Grid + Flexbox** 组合实现：

```css
/* 1. Grid 容器：让三栏等高 */
.three-col-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2.5rem;
  align-items: stretch;  /* 关键：拉伸子元素等高 */
}

/* 2. 各栏使用 Flexbox 填满高度 */
.col-left,
.col-right {
  display: flex;
  flex-direction: column;
}

/* 3. 内容区填满并均匀分布 */
.col-items {
  display: flex;
  flex-direction: column;
  justify-content: space-between;  /* 内容均匀分布 */
  height: 100%;
  flex: 1;
}

/* 4. 中间栏内容自适应填充 */
.col-center .card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.col-center .card-description {
  flex: 1;  /* 描述区填充剩余空间 */
}
```

## 关键点

### 1. Grid `align-items: stretch`
让 grid item（三栏）自动拉伸到同一高度：

```css
/* 顶部对齐（默认）- 不对齐底部 */
align-items: start;

/* 拉伸等高 - 底部对齐 */
align-items: stretch;
```

### 2. Flexbox 内部布局
- 左右栏：多个卡片均匀分布 (`space-between`)
- 中间栏：描述文字填充剩余空间 (`flex: 1`)

### 3. 数量平衡
如果内容高度差异过大，调整显示数量平衡各栏高度：

```astro
const leftItems = allItems.filter(i => i.type === 'blog').slice(0, 4);    // 4个小卡片
const centerItem = allItems[0];                                           // 1个大图
const rightItems = allItems.filter(i => i.type === 'project').slice(0, 2); // 2个大卡片
```

## 完整示例

**Astro 组件**:
```astro
---
const leftItems = items.filter(i => i.type === 'blog').slice(0, 4);
const centerItem = items[0];
const rightItems = items.filter(i => i.type === 'project').slice(0, 2);
---

<div class="three-col-layout">
  <div class="col-left">
    <div class="col-items">
      {leftItems.map(item => <Card {item} />)}
    </div>
  </div>
  <div class="col-center">
    <FeaturedCard item={centerItem} />
  </div>
  <div class="col-right">
    <div class="col-items">
      {rightItems.map(item => <Card {item} />)}
    </div>
  </div>
</div>

<style>
  .three-col-layout {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 2.5rem;
    align-items: stretch;
  }

  .col-left,
  .col-right {
    display: flex;
    flex-direction: column;
  }

  .col-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    flex: 1;
  }

  .col-center {
    display: flex;
    flex-direction: column;
  }

  .col-center .card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .col-center .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .col-center .card-description {
    flex: 1;
  }
</style>
```

## 响应式适配

移动端切换为单栏，grid 布局失效：

```css
@media (max-width: 960px) {
  .three-col-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  /* 重置 flex 样式 */
  .col-left .col-items,
  .col-right .col-items {
    display: grid;  /* 或保持 flex，但去掉 height: 100% */
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## 参考实现

- **文件**: `src/components/LatestUpdates.astro`
- **修改日期**: 2026-03-01
- **关键样式**:
  - 第283行: `align-items: stretch`
  - 第293-305行: `.col-blog`, `.col-projects` flex 布局
  - 第421-429行: `.featured-content`, `.card-description` flex 布局

## 相关方案

- [Astro 组件中限制列表显示数量](./astro-fixed-list-limit.md)
