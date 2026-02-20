# 页面宽度和留白优化计划

## 日期
2026-02-17

## 背景
当前页面所有区域使用统一的 max-width，缺乏层次感。需要通过不同的内容宽度来创建视觉层次，提升设计感。

## 目标
实现分层内容宽度系统，让不同区域有不同的留白和聚焦效果。

## 设计原则
- **section 全宽**：背景色延伸到屏幕边缘
- **container 限制内容宽度**：内容居中，两侧留白
- **不同区域不同宽度**：创建视觉层次

## 容器定义

### CSS 类
```css
.container-narrow {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-medium {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-wide {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .container-narrow,
  .container-medium,
  .container-wide {
    padding: 0 20px;
    max-width: 100%;
  }
}
```

## 各区域容器分配

| 区域 | 容器类 | 说明 |
|------|--------|------|
| Header（Logo + 汉堡菜单） | container-wide | 与页面其他wide区域对齐 |
| Hero 区域（头像 + 介绍文字） | container-narrow | 文字居中，两侧大量留白，更聚焦 |
| 三个入口卡片 | container-medium | 不要太宽，卡片间距32px |
| 精选博客 | container-wide | 内容较多，需要宽一些 |
| 精选项目 | container-wide | 两列布局，需要宽度 |
| 订阅区域 | container-narrow | 表单不需要太宽，聚焦 |
| Footer | container-wide | 与头部对齐 |

## HTML 结构调整

每个 section 内部添加对应的 container：

```html
<!-- Hero Section -->
<section class="hero">
  <div class="container-narrow">
    <!-- 头像、文字 -->
  </div>
</section>

<!-- Category Cards -->
<section class="modules">
  <div class="container-medium">
    <!-- 三个卡片 -->
  </div>
</section>

<!-- Featured Posts -->
<section class="featured-posts">
  <div class="container-wide">
    <!-- 精选博客 -->
  </div>
</section>
```

## 执行步骤

### Step 1: 添加 CSS 容器类
在 `global.css` 中添加 container-narrow、container-medium、container-wide 类。

### Step 2: 更新 Header（index.astro）
将 Header 区域改为使用 container-wide。

### Step 3: 更新 HeroSection
改为使用 container-narrow，移除原有的 max-w-4xl。

### Step 4: 更新 CategoryCards
改为使用 container-medium，卡片间距调整为 32px（gap-8）。

### Step 5: 更新 FeaturedPosts
改为使用 container-wide。

### Step 6: 更新 FeaturedProjects
改为使用 container-wide。

### Step 7: 更新 Subscribe 区域
改为使用 container-narrow。

### Step 8: 更新 Footer
改为使用 container-wide。

### Step 9: 构建和验证
- 构建项目
- 在不同屏幕尺寸下验证效果
- 确认移动端 padding 正确

## 文件变更清单

1. `src/styles/global.css` - 添加容器类
2. `src/pages/index.astro` - 更新 Header 和 Subscribe 区域
3. `src/components/HeroSection.astro` - 使用 container-narrow
4. `src/components/CategoryCards.astro` - 使用 container-medium，调整间距
5. `src/components/FeaturedPosts.astro` - 使用 container-wide
6. `src/components/FeaturedProjects.astro` - 使用 container-wide
7. `src/components/Footer.astro` 或相关文件 - 使用 container-wide

## 验证标准

- [ ] Hero 区域两侧有大量留白，文字居中聚焦
- [ ] 三个入口卡片区域宽度适中（不要太宽）
- [ ] 精选博客和项目使用全宽
- [ ] 订阅区域窄而聚焦
- [ ] 移动端 padding 为 20px
- [ ] 所有 section 背景色延伸到边缘
