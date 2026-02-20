---
title: 首页 V3 重大 redesign
type: feat
date: 2026-02-17
---

# 首页 V3 重大 redesign

## Overview

基于 V2 进行全面升级，重点解决汉堡菜单可用性问题，增强视觉冲击力，新增精选博客和精选项目区域。

## Phase 1: 修复汉堡菜单（最高优先级）

### 问题诊断
- 当前菜单按钮和 MobileMenu 组件的事件绑定可能不一致
- 需要使用统一的 toggle 机制

### 实现方案
1. 重写 MobileMenu.astro：
   - 使用 `.open` 类控制显示/隐藏
   - transform: translateX(100%) → translateX(0)
   - 添加遮罩层 overlay
   - 点击遮罩、关闭按钮、ESC 键均可关闭

2. 更新 index.astro：
   - 汉堡菜单使用绝对定位
   - 点击触发菜单 toggle

### 验收标准
- [ ] 点击 ☰ 菜单从右侧滑出
- [ ] 点击遮罩层菜单关闭
- [ ] 点击关闭按钮菜单关闭
- [ ] 按 ESC 键菜单关闭
- [ ] 菜单项 hover 变紫色 #A855F7

## Phase 2: Logo 居中 + 增强视觉

### 实现方案
```astro
<header class="relative py-6">
  <Logo class="text-center" />
  <button class="absolute right-4 top-1/2 -translate-y-1/2">☰</button>
</header>
```

### Logo 样式
- font-family: 'Playfair Display', serif
- font-weight: 900（尝试 900，若太夸张则改用 700）
- font-size: clamp(3rem, 8vw, 6rem)
- letter-spacing: -0.02em
- text-align: center

### 字体引入
检查 BaseLayout.astro 是否已引入 Playfair Display 700/900 weight。

### 验收标准
- [ ] Logo 水平居中
- [ ] 字号有冲击力
- [ ] 汉堡菜单不影响居中

## Phase 3: Hero 区域文字重设计

### 三层文字结构
```
第一行（主标题）:
"一名热爱技术的开发者"
- font-size: clamp(1.5rem, 4vw, 2.5rem)
- font-weight: 700
- color: #ffffff
- margin-bottom: 16px

第二行（副标题）:
"探索技术，分享思考，记录成长"
- font-size: clamp(1rem, 2vw, 1.25rem)
- color: #A855F7（品牌紫）
- font-weight: 500
- margin-bottom: 12px

第三行（描述）:
"这里记录我的学习历程、项目实践和技术思考。"
- font-size: 16px
- color: #a3a3a3
- margin-bottom: 32px
```

### 验收标准
- [ ] 三层文字正确显示
- [ ] 副标题为紫色 #A855F7
- [ ] 间距正确

## Phase 4: 卡片区域优化

### 规格调整
- 卡片高度: 300px（原 280px）
- 图标区域: 占卡片 60%
- 图标区域背景: 比卡片底色深 10%
- 图标大小: 64px（原 48px）
- 标题字号: 28px（原 24px）

### 背景色计算
- Blog #7C3AED → 图标区 #6D28D9（深 10%）
- Projects #0891B2 → 图标区 #077A96
- Videos #EA580C → 图标区 #D14A0A

### 验收标准
- [ ] 卡片高度 300px
- [ ] 图标区域有独立背景色
- [ ] 图标大小 64px
- [ ] 标题字号 28px

## Phase 5: 新增精选博客区域

### 组件结构
```astro
<section class="featured-posts">
  <div class="section-header">
    <h2>精选博客</h2>
    <a href="/blog" class="view-all">查看全部 →</a>
  </div>
  <div class="posts-grid">
    <!-- 左侧大卡片 -->
    <article class="post-card post-card--large">...</article>
    <!-- 右侧两个小卡片 -->
    <div class="post-stack">
      <article class="post-card post-card--small">...</article>
      <article class="post-card post-card--small">...</article>
    </div>
  </div>
</section>
```

### 样式规格
- section max-width: 1200px，居中
- posts-grid: grid-template-columns: 3fr 2fr, gap: 24px
- post-card: background #1a1a1a, border-radius 16px
- post-image 高度: 200px（大）/ 120px（小）
- 渐变色占位
- h2: 32px 白色
- view-all: #A855F7，hover 下划线

### 移动端
- posts-grid 改为单列
- 大卡片在上，两个小卡片在下

### 验收标准
- [ ] 左右布局正确
- [ ] 渐变色占位正确
- [ ] 响应式正确

## Phase 6: 新增精选项目区域

### 组件结构
```astro
<section class="featured-projects">
  <div class="section-header">
    <h2>精选项目</h2>
    <a href="/projects" class="view-all">查看全部 →</a>
  </div>
  <div class="projects-grid">
    <article class="project-card">...</article>
    <article class="project-card">...</article>
  </div>
</section>
```

### 样式规格
- projects-grid: repeat(2, 1fr), gap: 24px
- project-card: background #1a1a1a, border-radius 16px, padding 32px
- 左边框: 4px solid #0891B2
- project-icon: 48px
- h3: 20px 白色，hover #06B6D4
- project-tags: background #262626, color #a3a3a3
- project-links: #06B6D4

### 验收标准
- [ ] 两列布局
- [ ] 左边框青色
- [ ] hover 效果正确

## Phase 7: 间距和分隔线

### Section padding
- Hero: 80px 0 60px
- 卡片区域: 0 0 80px
- 精选博客: 80px 0
- 精选项目: 0 0 80px
- 订阅区域: 80px 0

### 分隔线
```css
section:not(:first-child) {
  border-top: 1px solid #262626;
}
```

## Phase 8: 滚动进入动画

### Intersection Observer 实现
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
});
```

### 动画类
```css
.scroll-animate {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.scroll-animate.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 应用区域
- 精选博客卡片
- 精选项目卡片

## 文件变更

### 修改
- src/pages/index.astro - 整体布局、间距
- src/components/Logo.astro - 字号、字重
- src/components/HeroSection.astro - 三层文字
- src/components/CategoryCards.astro - 卡片优化
- src/components/MobileMenu.astro - 修复菜单
- src/styles/global.css - 滚动动画样式

### 新增
- src/components/FeaturedPosts.astro - 精选博客
- src/components/FeaturedProjects.astro - 精选项目

## 执行顺序

1. **Phase 1**: 修复汉堡菜单（必须可用）
2. **Phase 2**: Logo 居中
3. **Phase 3**: Hero 文字
4. **Phase 4**: 卡片优化
5. **Phase 5**: 精选博客
6. **Phase 6**: 精选项目
7. **Phase 7**: 间距和分隔线
8. **Phase 8**: 滚动动画

## Acceptance Criteria

- [ ] 汉堡菜单完全可用
- [ ] Logo 居中且有冲击力
- [ ] Hero 三层文字正确显示
- [ ] 卡片高度 300px，图标区域有层次感
- [ ] 精选博客区域显示正确
- [ ] 精选项目区域显示正确
- [ ] 各 section 间距正确，有分隔线
- [ ] 滚动动画正常
- [ ] 响应式正确

---

**优先级**: P0 - 汉堡菜单修复
**预估工时**: 2-3 小时
**风险**: 汉堡菜单交互逻辑需要仔细测试
