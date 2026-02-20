# 博客列表页复古杂志风格改造

## 背景

将传统博客列表页改造为复古杂志风格，参考 Every.to 的极简设计感。

## 核心改动

### 1. 页眉重设计

**从** 居中大号中文标题
**改为** 左对齐英文花体 + 中文副标题

```astro
<div class="page-header">
  <div class="page-header-left">
    <h1 class="page-header-title" style="font-family: 'Playfair Display', serif; font-style: italic;">
      Blog
    </h1>
    <p class="page-header-subtitle">探索技术，分享思考的文章集合</p>
  </div>
  <!-- 筛选栏放右侧 -->
</div>
```

### 2. 去掉右侧边栏

直接删除 Sidebar 组件，页面变为单栏全宽布局。

### 3. 简化分类筛选

**合并策略：**
- `ACM` + `基础算法` → `技术`
- `随笔` → `生活`

**实现：**
```typescript
const categoryMergeMap = {
  '全部': [],
  '思考': ['思考'],
  '技术': ['技术', 'ACM', '基础算法'],
  '生活': ['生活', '随笔'],
  '项目': ['项目'],
};
```

### 4. 文章卡片改造

**图片灰度效果：**
```css
.card-img {
  filter: grayscale(100%);
  transition: all 0.3s ease;
}
.card-item:hover .card-img {
  filter: grayscale(0%);
  transform: scale(1.05);
}
```

**标题圆点装饰：**
```css
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-color);
}
.card-item:hover .dot {
  box-shadow: 0 0 8px var(--brand-color);
}
```

**卡片列表悬停变暗：**
```css
.card-list:hover .card-item {
  opacity: 0.5;
}
.card-list:hover .card-item:hover {
  opacity: 1;
}
```

## 技术要点

### CSS 变量传递品牌色

通过 `style` 属性传递 CSS 变量：
```astro
<article style={`--brand-color: ${brandColor};`}>
  <!-- 子元素使用 var(--brand-color) -->
</article>
```

### 全局选择器技巧

使用 `:global()` 在子组件中影响父容器样式：
```css
:global(.card-list:hover .card-item) {
  opacity: 0.5;
}
```

### 响应式断点

- `≤960px`: 页眉纵向排列，筛选栏下移
- `≤640px`: 标题字号缩小

## 颜色映射表

| 分类 | 颜色 |
|------|------|
| 思考 | `#A855F7` (紫色) |
| 技术/ACM/基础算法/项目 | `#06B6D4` (青色) |
| 生活/随笔 | `#F97316` (橙色) |

## 经验总结

1. **CSS 变量优于硬编码**: 方便主题切换和维护
2. **空值保护**: `categories?.[0]` 避免空数组报错
3. **组件间样式协调**: 使用 `:global()` 需要父组件配合添加对应 class
4. **渐进增强**: 保留 `<a>` 标签用于 SEO，可叠加客户端筛选

## 相关文件

- `src/pages/blog/index.astro` - 博客列表主页面
- `src/components/BlogCard.astro` - 文章卡片组件
