---
title: 左右交替堆叠式入口导航
date: 2026-02-18
category: frontend
tags: [astro, css, animation, layout]
---

# 左右交替堆叠式入口导航

## 问题背景

将首页的入口卡片从画框式改为全新的左右交替堆叠布局，营造杂志/画廊般的浏览体验。

## 技术方案

### 布局策略

```
┌─────────────────────────────────────┐
│  [Blog 图片]    Blog                │
│                 ─────               │
│                 思考观点 · 技术笔记   │
│                                 →   │
├─────────────────────────────────────┤
│                 Projects   [图片]   │
│                 ─────               │
│                 案例展示 · 开源作品   │
│  ←                                  │
├─────────────────────────────────────┤
│  [Videos 图片]  Videos              │
│                 ─────               │
│                 教程资源 · 分享推荐   │
│                                 →   │
└─────────────────────────────────────┘
```

- Blog: 左图右文
- Projects: 左文右图（镜像）
- Videos: 左图右文

### 组件结构

```astro
NavEntries.astro
├── nav-entries
│   └── nav-entries-inner
│       ├── nav-row.nav-row-blog
│       │   ├── nav-row-bg (品牌色光晕背景)
│       │   └── nav-row-content
│       │       ├── nav-row-image
│       │       ├── nav-row-text
│       │       └── nav-row-arrow
│       ├── nav-row-divider
│       ├── nav-row.nav-row-projects.nav-row-reverse
│       ├── nav-row-divider
│       └── nav-row.nav-row-videos
```

### 镜像行实现

使用 `.nav-row-reverse` 类实现左右翻转：

```css
/* 镜像行：Flex 方向反转 */
.nav-row-reverse .nav-row-content {
  flex-direction: row-reverse;
}

/* 镜像行文字右对齐 */
.nav-row-reverse .nav-row-text {
  text-align: right;
}

/* 镜像行箭头移到最左 */
.nav-row-reverse .nav-row-arrow {
  order: -1;
}
```

### 图片边缘消融效果

使用径向渐变让图片自然融入深色背景：

```css
.nav-row-image::after {
  content: '';
  position: absolute;
  inset: -1px;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(10, 10, 10, 0.5) 65%,
    rgba(10, 10, 10, 1) 85%
  );
}
```

### Hover 动效系统

| 元素 | 默认 | Hover |
|------|------|-------|
| 背景 | 透明 | 品牌色径向渐变光晕 |
| 图片 | 灰度 20% | 彩色 + 放大 1.05 倍 + drop-shadow 光晕 |
| 图片边缘 | 完全消融 | 消融减弱 (opacity 0.7) |
| 标题 | #e5e5e5 | 品牌色 |
| 装饰线 | 40px, opacity 0.4 | 80px, opacity 1 |
| 描述 | #525252 | #737373 |
| 箭头 | #333 | 品牌色 + 平移 6px |
| 其他行 | 100% | 40% (变暗) |

### 品牌色映射

| 行 | 背景光晕位置 | 装饰线 | Hover 标题/箭头 |
|----|-------------|--------|----------------|
| Blog | 20% 左侧 | #7C3AED | #A855F7 |
| Projects | 80% 右侧 | #0891B2 | #06B6D4 |
| Videos | 20% 左侧 | #EA580C | #F97316 |

### 入场动画

```javascript
const navEntriesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const rows = document.querySelectorAll('.nav-row');
      const dividers = document.querySelectorAll('.nav-row-divider');
      rows.forEach(row => row.classList.add('animate-in'));
      dividers.forEach(div => div.classList.add('animate-in'));
      navEntriesObserver.disconnect();
    }
  });
}, { threshold: 0.15 });
```

交错延迟：
- Blog: 0.1s
- Projects: 0.3s
- Videos: 0.5s
- 分隔线: 0.4s

### 响应式设计

**桌面端 (>768px)**：左右交替布局

**移动端 (≤768px)**：统一上图下文垂直排列

```css
@media (max-width: 768px) {
  .nav-row-content {
    flex-direction: column !important;
    align-items: center;
    text-align: center;
  }

  .nav-row-image {
    width: 160px;
    height: 160px;
  }

  .nav-row-title {
    font-size: 32px;
  }
}
```

## 文件位置

- 组件：`src/components/NavEntries.astro`
- 引用：`src/pages/index.astro`

## 提交记录

- `187a3a2` - feat: 替换入口卡片为左右交替堆叠布局
