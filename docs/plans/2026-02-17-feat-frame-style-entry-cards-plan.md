---
title: 替换入口卡片为画框式设计
type: feat
date: 2026-02-17
---

# 替换入口卡片为画框式设计

## 概述

将首页现有的邮票式入口卡片（StampCards.astro）完全替换为全新的画框式设计。新设计采用深色画框容器、品牌色叠加层、精致的 hover 动效和入场动画，提升整体视觉质感。

## 动机

- 邮票设计虽然有趣，但画框设计更加精致、专业
- 画框容器能更好地突出图片内容，提供层次感
- 丰富的 hover 动效能增强用户交互体验
- 与现有的深色主题和卡片系统更加协调

## 技术方案

### 文件变更

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 删除 | `src/components/StampCards.astro` | 移除旧的邮票组件 |
| 创建 | `src/components/EntryCards.astro` | 新建画框式入口卡片组件 |
| 修改 | `src/pages/index.astro` | 替换组件引用 |

### HTML 结构

```astro
<!-- src/components/EntryCards.astro -->
<section class="entries-section">
  <div class="entries-container">
    <a href="/blog" class="entry-card entry-blog">
      <div class="entry-frame">
        <div class="entry-image-wrapper">
          <img src="/assets/images/card-blog.jpg" alt="Blog">
        </div>
      </div>
      <div class="entry-info">
        <h3 class="entry-title">Blog</h3>
        <p class="entry-desc">思考观点 · 技术笔记</p>
      </div>
      <div class="entry-line"></div>
    </a>
    <!-- Projects 和 Videos 卡片结构类似 -->
  </div>
</section>
```

### CSS 实现要点

#### 画框容器样式
- 背景色：`#141414`
- 边框：`1px solid rgba(255, 255, 255, 0.08)`
- 圆角：`4px`
- 内边距：`12px`
- 过渡：`all 0.6s cubic-bezier(0.23, 1, 0.32, 1)`

#### 图片处理
- 默认滤镜：`grayscale(30%) brightness(0.9)`
- Hover 时：`grayscale(0%) brightness(1)` + `scale(1.03)`
- 彩色叠加层：`::after` 伪元素，默认 `opacity: 0.12`，hover 时消失

#### 品牌色分配
| 卡片 | 叠加层颜色 | 边框 Hover 颜色 | 标题 Hover 颜色 | 底部线条 |
|------|-----------|----------------|----------------|----------|
| Blog | `#7C3AED` | `rgba(124, 58, 237, 0.4)` | `#A855F7` | `#7C3AED` |
| Projects | `#0891B2` | `rgba(8, 145, 178, 0.4)` | `#06B6D4` | `#0891B2` |
| Videos | `#EA580C` | `rgba(234, 88, 12, 0.4)` | `#F97316` | `#EA580C` |

#### 底部线条动画
- 默认：`transform: scaleX(0)`，`transform-origin: left`
- Hover 时：`transform: scaleX(1)`
- 过渡：`transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)`

#### 入场动画
- 初始状态：`opacity: 0`，`transform: translateY(30px)`
- 使用 IntersectionObserver 触发
- 交错延迟：Blog 0.1s, Projects 0.3s, Videos 0.5s
- 过渡：`all 0.8s cubic-bezier(0.23, 1, 0.32, 1)`

### 响应式策略

| 断点 | 布局 | 卡片宽度 | 间距 |
|------|------|----------|------|
| Desktop (>960px) | Flex 水平 | 300px | 48px |
| Tablet (768-960px) | Flex 水平 | 260px | 32px |
| Mobile (<768px) | Flex 垂直 | 100% (max 340px) | 40px |

### JavaScript 入场动画

```javascript
const entriesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = document.querySelectorAll('.entry-card');
      cards.forEach(card => card.classList.add('animate-in'));
      entriesObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

const entriesSection = document.querySelector('.entries-section');
if (entriesSection) {
  entriesObserver.observe(entriesSection);
}
```

## 验收标准

### 功能验证
- [ ] 三张配图正常显示在画框容器内
- [ ] 画框有深色背景 + 微妙边框效果
- [ ] Hover 时画框上浮 6px + 边框变为品牌色 + 彩色阴影
- [ ] Hover 时图片从灰色变彩色 + 微妙放大 1.03 倍
- [ ] Hover 时标题变为对应品牌色
- [ ] Hover 时描述文字变亮
- [ ] Hover 时底部线条从左向右展开
- [ ] Hover 某张卡片时其他卡片变暗至 60% 透明度
- [ ] 页面滚动到该区域时卡片有从下方淡入的入场动画
- [ ] 移动端垂直排列，无重叠效果

### 代码质量
- [ ] 删除 StampCards.astro 所有相关代码
- [ ] 新组件使用语义化类名
- [ ] CSS 变量与现有设计系统一致
- [ ] 动画使用 `cubic-bezier(0.23, 1, 0.32, 1)` 缓动曲线
- [ ] 支持 `prefers-reduced-motion` 媒体查询

### 性能要求
- [ ] 图片使用 `loading="lazy"` 延迟加载
- [ ] 动画使用 `transform` 和 `opacity` 确保 GPU 加速
- [ ] 无布局抖动（layout shift）

## 依赖关系

- 依赖图片文件：`/assets/images/card-blog.jpg`、`card-projects.jpg`、`card-videos.jpg`
- 依赖字体：`Cormorant Garamond`（标题字体）
- 与现有变量系统兼容：`--border-color`（`#262626`）用于区域分隔线

## 相关参考

- 类似实现：`docs/solutions/frontend/homepage-redesign-2026-02-17.md`
- 动画系统：`docs/solutions/frontend/homepage-development-journey.md`
- 现有卡片模式：`src/components/FeaturedPosts.astro`

## 风险评估

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 图片路径错误 | 低 | 中 | 验证图片存在于 `public/assets/images/` |
| 动画性能问题 | 低 | 低 | 使用 `transform` 和 `opacity`，避免触发重排 |
| 移动端布局问题 | 中 | 中 | 充分测试 768px 以下布局 |

## 测试建议

1. **桌面端测试**：验证所有 hover 效果和动画
2. **平板端测试**（960px 宽度）：验证卡片间距和尺寸
3. **移动端测试**（<768px）：验证垂直排列和触摸交互
4. **减少动画偏好测试**：在系统设置中开启"减少动画"，验证体验仍然可用
