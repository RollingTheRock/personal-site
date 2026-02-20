---
title: 首页 V2 精细化调整
type: feat
date: 2026-02-17
---

# 首页 V2 精细化调整

## Overview

基于首页 V1 的反馈，进行精细化调整，优化视觉层次和交互体验。

## Requirements

### 1. 页眉导航重构
- [ ] 删除右上角文字导航（博客、项目、视频、关于）
- [ ] 仅保留汉堡菜单图标 ☰
- [ ] 实现侧边导航面板：
  - 从右侧滑出
  - 包含：首页、博客、项目、视频、关于、深色/浅色切换
  - 背景：半透明毛玻璃效果 (backdrop-filter: blur(20px))

### 2. Logo 优化
- [ ] 字号增大约 20%
- [ ] 保持衬线体
- [ ] 左对齐，与汉堡菜单同一行

### 3. Hero 头像区域重设计
- [ ] 删除卡通头像
- [ ] 使用真实头像占位图（圆形，180-200px）
- [ ] 外圈：2px 紫色虚线边框 (#A855F7)
- [ ] 背后装饰层：复古报纸纹理圆形背景，比头像大，偏移 10px
- [ ] 紫色发光效果：box-shadow: 0 0 30px rgba(168, 85, 247, 0.3)

### 4. 介绍文字调整
- [ ] 删除"我是 RollingTheRock"
- [ ] 第一行（24px，白色，font-weight 600）："一名热爱技术的开发者"
- [ ] 第二行（16px，#e5e5e5）："这里记录我的学习历程、项目实践和技术思考。"
- [ ] 居中对齐

### 5. 删除配色标签
- [ ] 完全移除三个配色标签

### 6. 模块化入口卡片重设计
- [ ] 三卡片并排，间距 24px
- [ ] 卡片规格：
  - 圆角 16px
  - 内边距 32px
  - 高度约 280px
  - 配图占上半部分 60%
  - filter: grayscale(100%) contrast(1.2)
- [ ] Blog 卡片：#7C3AED，标题"Blog"，描述"思考观点 · 技术笔记"
- [ ] Projects 卡片：#0891B2，标题"Projects"，描述"案例展示 · 开源作品"
- [ ] Videos 卡片：#EA580C，标题"Videos"，描述"教程资源 · 分享推荐"
- [ ] 悬停效果：translateY(-8px)，box-shadow 加深，配图 scale(1.05)
- [ ] 配图占位：纯色 + emoji（📝💼🎥）

### 7. 响应式
- [ ] 移动端卡片垂直堆叠

## Technical Approach

### 文件变更

#### 修改
- `src/pages/index.astro` - 页眉结构、HeroSection 调用
- `src/components/HeroSection.astro` - 完全重写
- `src/components/Logo.astro` - 字号调整
- `src/components/CategoryCards.astro` - 卡片重设计

#### 新增
- `src/components/MobileMenu.astro` - 侧边导航面板（或改造现有组件）

### 关键实现

#### 侧边导航
```astro
<!-- 使用 fixed 定位 + transform translate-x 实现滑入 -->
<aside class="fixed inset-y-0 right-0 w-80 transform translate-x-full transition-transform"
       class:list={[{ 'translate-x-0': isOpen }]}>
  <div class="h-full backdrop-blur-xl bg-black/50">
    <!-- 导航内容 -->
  </div>
</aside>
```

#### 头像装饰层
```astro
<div class="relative">
  <!-- 复古纹理背景 -->
  <div class="absolute inset-0 rounded-full opacity-20 translate-x-2 translate-y-2"
       style="background-image: url(...);"></div>
  <!-- 头像 -->
  <img class="relative rounded-full border-2 border-dashed border-[#A855F7]"
       style="box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);" />
</div>
```

#### 卡片结构
```astro
<a class="group rounded-2xl p-8 h-[280px] flex flex-col"
   style={`background-color: ${color};`}>
  <!-- 配图区域 60% -->
  <div class="h-[60%] flex items-center justify-center">
    <span class="text-6xl grayscale contrast-125">{emoji}</span>
  </div>
  <!-- 文字区域 -->
  <div class="flex-1">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
</a>
```

## Acceptance Criteria

- [ ] 汉堡菜单点击滑出侧边导航
- [ ] 侧边导航包含所有链接和主题切换
- [ ] Logo 字号明显增大
- [ ] 新头像样式正确（虚线边框+发光+装饰层）
- [ ] 介绍文字两行正确显示
- [ ] 配色标签已删除
- [ ] 三卡片并排，间距 24px
- [ ] 卡片配图使用 emoji 占位
- [ ] 悬停效果正常
- [ ] 移动端响应式正确

## References

- 基于：docs/solutions/homepage-retro-modern-redesign.md
- 当前分支：dev/homepage-adjustments
