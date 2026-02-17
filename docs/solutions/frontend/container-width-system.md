# 页面容器宽度系统

## 日期
2026-02-17

## 问题背景
网站所有区域使用统一的 max-width，缺乏视觉层次。需要通过不同的内容宽度来创建层次感，提升设计感。

## 解决方案

### 核心设计原则
- **section 全宽**：背景色延伸到屏幕边缘
- **container 限制内容宽度**：内容居中，两侧留白
- **不同区域不同宽度**：创建视觉层次

### 容器类定义

在 `global.css` 中添加三层容器系统：

```css
/* 窄容器 - 用于聚焦区域 */
.container-narrow {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 中等容器 - 用于卡片区域 */
.container-medium {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 宽容器 - 用于内容丰富的区域 */
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

### 各区域容器分配

| 区域 | 容器类 | max-width | 设计理由 |
|------|--------|-----------|---------|
| Header | container-wide | 1200px | 与页面其他 wide 区域对齐 |
| Hero 区域 | container-narrow | 680px | 文字居中，两侧大量留白，更聚焦 |
| 三个入口卡片 | container-medium | 960px | 不要太宽，卡片之间间距 32px |
| 精选博客 | container-wide | 1200px | 内容较多，需要宽度 |
| 精选项目 | container-wide | 1200px | 两列布局，需要宽度 |
| 订阅区域 | container-narrow | 680px | 表单不需要太宽，聚焦 |
| Footer | container-wide | 1200px | 与头部对齐 |

### HTML 结构模式

```html
<!-- 每个 section 全宽，内部用 container 限制 -->
<section class="hero">
  <div class="container-narrow">
    <!-- 头像、文字 -->
  </div>
</section>

<section class="modules">
  <div class="container-medium">
    <!-- 三个卡片 -->
  </div>
</section>

<section class="featured-posts">
  <div class="container-wide">
    <!-- 精选博客 -->
  </div>
</section>
```

## 实施文件

- `src/styles/global.css` - 容器类定义
- `src/pages/index.astro` - Header、Subscribe 区域
- `src/components/HeroSection.astro` - Hero 区域
- `src/components/CategoryCards.astro` - 入口卡片
- `src/components/FeaturedPosts.astro` - 精选博客
- `src/components/FeaturedProjects.astro` - 精选项目
- `src/components/Footer.astro` - 页脚

## 视觉效果

- **Hero 区域**：两侧大量留白，文字居中，阅读更聚焦
- **三个入口卡片**：适中的宽度，卡片间距 32px，视觉平衡
- **精选博客/项目**：宽屏展示更多内容
- **订阅区域**：窄而聚焦，突出表单

## 响应式行为

- 桌面端（>768px）：各容器按定义的最大宽度显示
- 移动端（≤768px）：所有容器宽度 100%，padding 20px

## 相关方案

- [字体配置方案](./font-configuration.md) - 字体与容器配合实现层次感
