# 项目页风格改造方案

## 问题背景
博客列表页和博客详情页已完成复古拼贴风格改造，但项目页仍保持旧版设计，视觉语言不统一。

## 解决方案
将项目列表页和详情页统一到博客页的设计语言：灰度图片 hover 变彩色、品牌色圆点、花体标题、杂志感布局。

## 改造文件

### 1. src/pages/projects/index.astro
**改造要点：**
- 居中标题 → 左右布局 `page-header`
- 添加 `projects-grid` 类实现卡片互斥暗化
- 内联样式定义 page-header 结构

```astro
<div class="page-header">
  <div class="page-header-left">
    <h1 class="page-header-title">Projects</h1>
    <p class="page-header-subtitle">我的开源项目和个人作品</p>
  </div>
</div>
```

### 2. src/components/ProjectCard.astro
**改造要点：**
- 图片默认 `grayscale`，hover 去灰度 + `scale(1.05)`
- 标题添加品牌色圆点 `●` 前缀
- 技术标签改为纯文字 `·` 分隔
- 链接 hover 统一为 `#A855F7`

```astro
<img class="w-full h-full object-cover grayscale hover-image transition-all duration-300" />

<h3 class="text-lg font-semibold mb-2 group-hover:text-[#A855F7] transition-colors">
  <span class="text-[#A855F7] mr-1">●</span>{title}
</h3>
```

### 3. src/pages/projects/[...slug].astro
**改造要点：**
- 页眉从居中改为左对齐
- 添加元信息行：`项目 · 日期`
- 技术标签纯文字化
- 按钮改为边框样式，hover 品牌色填充
- 封面图全宽显示

```astro
<!-- Meta Info -->
<div class="flex items-center gap-2 text-sm mb-4">
  <span class="text-[#A855F7] font-medium">项目</span>
  <span class="text-[var(--text-muted)]">·</span>
  <span class="text-[var(--text-secondary)]">{formatDateYearMonth(date)}</span>
</div>

<!-- Buttons -->
<a class="px-4 py-2 border border-[var(--border-color)] rounded ... hover:bg-[#A855F7] hover:text-white">
```

## 技术规格

| 属性 | 值 |
|------|-----|
| 品牌色 | `#A855F7` (紫色) |
| 标题字体 | Playfair Display, italic |
| 过渡动画 | `0.3s ease` |
| 图片缩放 | `scale(1.05)` |
| 互斥暗化 | `opacity: 0.5` |

## 响应式断点

- `≤960px`: page-header 纵向排列
- `≤640px`: 标题字号从 36px 降至 28px

## 复用建议

page-header 样式可抽取到全局 CSS，供博客页和项目页共用：

```css
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}
```

## 相关文件
- `src/pages/blog/index.astro` - 参考样式来源
- `src/components/BlogCard.astro` - 卡片交互参考
