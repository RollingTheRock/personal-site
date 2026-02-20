# 项目页风格改造方案 V2

## 问题背景
第一次改造使用了紫色品牌色，但项目类别应使用青色。同时项目详情页保持居中布局比左对齐更有仪式感。

## 关键决策

### 品牌色调整
- **项目类别使用青色** `#06B6D4`（而非紫色）
- 与博客分类体系保持一致：
  - 紫色 - 思考/AI
  - **青色 - 技术/工程（项目）**
  - 橙色 - 生活/创意

### 布局决策
- **列表页**：左对齐 page-header（与博客列表一致）
- **详情页**：保持居中（项目更像展示页/Landing Page）

### 按钮交互
- 避免过于强烈的填充色 hover
- 采用克制风格：**边框/文字变品牌色 + 轻微半透明背景**

## 实现细节

### ProjectCard.astro
```astro
<!-- 青色圆点前缀 -->
<h3 class="group-hover:text-[#06B6D4]">
  <span class="text-[#06B6D4] mr-1.5 text-[0.6em] align-middle">●</span>{title}
</h3>

<!-- 技术标签最多 5 个 -->
{tech.slice(0, 5).map(...)}
```

### [...slug].astro 按钮样式
```css
.project-btn:hover {
  border-color: #06B6D4;
  color: #06B6D4;
  background: rgba(6, 182, 212, 0.1);  /* 轻微背景 */
}
```

## 数据维护
- 所有项目必须包含 `github` 字段
- `personal-blog.md` 已补充：`https://github.com/RollingTheRock/personal-site`

## 相关文件
- `docs/solutions/ui-ux/project-pages-styling.md` - V1 方案（紫色版本）
