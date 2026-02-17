---
title: 画框式入口卡片组件
date: 2026-02-17
category: frontend
tags: [astro, css, animation, component]
---

# 画框式入口卡片组件

## 问题背景

将首页的入口导航从邮票式设计替换为更精致的画框式设计，提升整体视觉质感。

## 技术方案

### 组件结构

```
EntryCards.astro
├── entries-section (区域容器)
│   └── entries-container (Flex 布局)
│       └── entry-card × 3 (单个卡片)
│           ├── entry-frame (画框容器)
│           │   └── entry-image-wrapper (图片包装)
│           │       └── img (配图)
│           ├── entry-info (文字区域)
│           │   ├── entry-title (标题)
│           │   └── entry-desc (描述)
│           └── entry-line (底部品牌线)
```

### 核心 CSS 技巧

#### 1. 画框容器设计

```css
.entry-frame {
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 12px;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
              border-color 0.6s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
```

**要点**：
- 深色背景 (`#141414`) 与页面背景形成层次
- 微妙边框 (`rgba(255, 255, 255, 0.08)`) 提供精致感
- 明确列出 transition 属性，避免使用 `all`

#### 2. 图片灰度到彩色效果

```css
.entry-image-wrapper img {
  filter: grayscale(30%) brightness(0.9);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.entry-card:hover .entry-image-wrapper img {
  filter: grayscale(0%) brightness(1);
  transform: scale(1.03);
}
```

**注意**：`filter` 过渡是 CPU 密集型操作，对于低性能设备可能有影响。如需优化，可用伪元素叠加层替代。

#### 3. 彩色叠加层（品牌色）

```css
.entry-image-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.12;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.entry-blog .entry-image-wrapper::after {
  background: #7C3AED;  /* 紫色 */
}

.entry-card:hover .entry-image-wrapper::after {
  opacity: 0;  /* hover 时消失 */
}
```

#### 4. 底部线条展开动画

```css
.entry-line {
  height: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.entry-card:hover .entry-line {
  transform: scaleX(1);
}
```

**要点**：
- `transform-origin: left` 确保从左侧展开
- 使用 `scaleX` 而非 `width` 获得 GPU 加速

#### 5. IntersectionObserver 入场动画

```javascript
const entriesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.entry-card');
      cards.forEach(card => card.classList.add('animate-in'));
      entriesObserver.unobserve(entry.target);  // 触发后取消观察
    }
  });
}, { threshold: 0.2 });
```

**要点**：
- 使用 `unobserve()` 而非 `disconnect()` 保留重新观察的可能
- `threshold: 0.2` 表示元素 20% 可见时触发

### 缓动曲线选择

使用 `cubic-bezier(0.23, 1, 0.32, 1)`（outQuint）：
- 开始快，结束慢，营造优雅感
- 与 Every.to 风格一致
- 适合所有入场和 hover 动画

### 品牌色映射

| 卡片 | 叠加层 | Hover 边框 | Hover 标题 |
|------|--------|-----------|-----------|
| Blog | #7C3AED | rgba(124, 58, 237, 0.4) | #A855F7 |
| Projects | #0891B2 | rgba(8, 145, 178, 0.4) | #06B6D4 |
| Videos | #EA580C | rgba(234, 88, 12, 0.4) | #F97316 |

### 响应式策略

```css
/* 桌面 */
@media (min-width: 961px) {
  .entries-container { gap: 48px; }
  .entry-card { width: 300px; }
}

/* 平板 */
@media (max-width: 960px) {
  .entries-container { gap: 32px; }
  .entry-card { width: 260px; }
}

/* 移动端 */
@media (max-width: 768px) {
  .entries-container {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
  .entry-card {
    width: 100%;
    max-width: 340px;
  }
}
```

### 可访问性支持

```css
@media (prefers-reduced-motion: reduce) {
  .entry-card,
  .entry-frame,
  .entry-image-wrapper img,
  /* ... */
  {
    transition: none !important;
    animation: none !important;
  }

  .entry-card {
    opacity: 1;
    transform: none;
  }
}

/* 键盘导航焦点样式 */
.entry-card:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
  border-radius: 4px;
}
```

## 性能优化

1. **GPU 加速**：使用 `transform` 和 `opacity` 进行动画
2. **will-change 提示**：初始状态添加 `will-change: transform, opacity`
3. **动画完成后释放**：`.animate-in` 类设置 `will-change: auto`
4. **明确 transition 属性**：避免使用 `transition: all`

## 文件位置

- 组件：`src/components/EntryCards.astro`
- 图片：`public/assets/images/card-{blog,projects,videos}.jpg`

## 使用方式

在 `index.astro` 中引入：

```astro
---
import EntryCards from '../components/EntryCards.astro';
---

<!-- 在 Hero 和精选博客之间 -->
<EntryCards />
```

## 相关参考

- [homepage-redesign-2026-02-17.md](./homepage-redesign-2026-02-17.md)
- [homepage-development-journey.md](./homepage-development-journey.md)

## 复古未来主义风格优化

### SVG 噪点纹理技术

使用 SVG `feTurbulence` 滤镜生成程序化噪点纹理：

```css
/* 画框容器噪点 */
.entry-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  border-radius: inherit;
  z-index: 0;
}

/* 图片噪点叠加 */
.entry-image-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: overlay;
}
```

**参数说明**：
- `baseFrequency='0.9'` - 高频噪点，产生细腻颗粒感
- `numOctaves='4'` - 八度数，增加噪点复杂度
- `stitchTiles='stitch'` - 无缝平铺
- `mix-blend-mode: overlay` - 与图片融合

### 字体搭配策略

| 元素 | 字体 | 用途 |
|------|------|------|
| 标题 | Cormorant Garamond | 优雅衬线体，与 Hero 区域一致 |
| 描述 | Courier New | 等宽字体，增加技术感 |

```css
.entry-title {
  font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif !important;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.entry-desc {
  font-family: 'Courier New', 'SF Mono', monospace;
  font-size: 13px;
  color: #525252;
  letter-spacing: 0.08em;
}
```

### 品牌色装饰线

左侧竖线装饰增强视觉层次：

```css
.entry-info {
  padding-left: 16px;
  border-left: 2px solid transparent;
}

.entry-blog .entry-info { border-left-color: #7C3AED; }
.entry-projects .entry-info { border-left-color: #0891B2; }
.entry-videos .entry-info { border-left-color: #EA580C; }

/* hover 时变亮 */
.entry-blog:hover .entry-info { border-left-color: #A855F7; }
```

### 画框深度质感

使用径向渐变和多层阴影营造立体画框效果：

```css
.entry-frame {
  background: radial-gradient(ellipse at center, #161616 0%, #0f0f0f 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 14px 14px 20px 14px;
  box-shadow:
    inset 0 2px 10px rgba(0, 0, 0, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.03),
    0 4px 16px rgba(0, 0, 0, 0.3);
}
```

**效果说明**：
- 径向渐变：中间稍亮，四角更暗（暗角效果）
- 底部 padding 加大：营造底座感
- 内阴影：图片看起来"嵌入"画框
- 底部微亮线：模拟光照边缘
- 外阴影：画框整体浮起感

### 图片内嵌效果

```css
.entry-image-wrapper {
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);
}
```

### 画框底部品牌色微光

```css
.entry-blog .entry-frame {
  border-bottom-color: rgba(124, 58, 237, 0.12);
}
```

### Hover 发光效果

Hover 时添加内阴影营造发光感：

```css
.entry-blog:hover .entry-frame {
  border-color: rgba(124, 58, 237, 0.25);
  box-shadow:
    inset 0 2px 10px rgba(0, 0, 0, 0.4),
    inset 0 -1px 0 rgba(124, 58, 237, 0.08),
    0 8px 32px rgba(124, 58, 237, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.3);
}
```

## 提交记录

- `c8d1bbc` - feat: 替换邮票卡片为画框式设计
- `57993b6` - refactor: 优化 EntryCards 性能和可访问性
- `8d17ce0` - style: 入口卡片复古未来主义风格优化
- `f42824b` - style: 优化入口卡片画框质感（深度、厚度、内嵌感）
