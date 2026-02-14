---
title: 完善基础布局组件
type: feat
date: 2026-02-14
---

# 完善基础布局组件

## Overview

优化现有的基础布局组件（BaseLayout、Header、Footer、ThemeToggle），添加缺失的 Sidebar 组件，确保响应式设计正常，主题切换流畅。采用 Every.to + Notion 极简风格，黑白灰配色。

## Current State Analysis

### 现有组件
- **BaseLayout.astro**: 基础页面布局，包含 SEO 元数据和主题脚本
- **Header.astro**: 粘性导航栏，含 Logo、导航链接、移动端菜单
- **Footer.astro**: 三栏式页脚，含品牌信息、导航、订阅
- **ThemeToggle.astro**: 主题切换按钮（亮色/暗色）
- **ImagePlaceholder.astro**: 图片占位符组件

### 需要改进的地方
1. **Header**: 移动端菜单缺少关闭按钮，缺少搜索入口
2. **ThemeToggle**: UI 只有两种状态，缺少"系统"选项
3. **Sidebar**: 缺失，需要为首页和博客页创建
4. **重复代码**: 博客卡片结构在多处重复，需提取为独立组件

## Proposed Solution

### 1. 优化 Header 组件
- 添加移动端菜单关闭功能
- 优化导航交互体验
- 确保响应式断点正常

### 2. 完善 ThemeToggle 组件
- 添加三态切换 UI（亮色/暗色/系统）
- 添加 `client:load` 指令
- 优化图标过渡动画

### 3. 创建 Sidebar 组件
- 个人简介卡片（头像、名称、简介）
- 分类列表
- 标签云
- 最新文章列表

### 4. 提取可复用卡片组件
- **BlogCard.astro**: 博客文章卡片
- **ProjectCard.astro**: 项目卡片（优化现有）
- **VideoCard.astro**: 视频卡片

### 5. 优化全局样式
- 修复 Tailwind 配置中的重复定义
- 完善响应式工具类
- 添加页面过渡动画基础

## Technical Approach

### File Structure
```
src/
├── components/
│   ├── Header.astro           # 优化现有
│   ├── Footer.astro           # 优化现有
│   ├── ThemeToggle.astro      # 优化现有（三态切换）
│   ├── Sidebar.astro          # 新建
│   ├── BlogCard.astro         # 新建
│   ├── ProjectCard.astro      # 新建/优化
│   ├── VideoCard.astro        # 新建
│   └── MobileMenu.astro       # 新建（提取移动端菜单）
├── layouts/
│   └── BaseLayout.astro       # 优化现有
└── styles/
    └── global.css             # 优化
```

### Key Implementation Details

#### ThemeToggle 三态设计
```
[太阳图标] [月亮图标] [显示器图标]
  亮色      暗色       系统
```

#### Sidebar 布局
- 宽度：280px（桌面端）
- 位置：首页左侧 / 博客页右侧
- 内容：个人简介、分类、标签、最新文章

#### 响应式断点
- 移动端：< 768px（隐藏 Sidebar，显示汉堡菜单）
- 平板：768px - 1024px（可选 Sidebar）
- 桌面：> 1024px（完整布局）

## Acceptance Criteria

### Header 优化
- [ ] 移动端菜单可以正常打开和关闭
- [ ] 当前页面导航项高亮显示
- [ ] 滚动时 Header 保持固定且背景模糊效果正常

### ThemeToggle 优化
- [ ] 支持三种主题模式切换：亮色、暗色、系统
- [ ] 主题切换即时生效，无闪烁
- [ ] 用户偏好保存在 localStorage
- [ ] 图标有平滑过渡动画

### Sidebar 组件
- [ ] 显示个人头像和简介
- [ ] 显示文章分类列表（带文章数）
- [ ] 显示热门标签云
- [ ] 显示最新文章列表（5篇）
- [ ] 在桌面端正常显示，移动端隐藏

### 卡片组件
- [ ] BlogCard：支持封面图/占位符、分类、日期、标题、摘要
- [ ] ProjectCard：支持封面图/占位符、技术栈、标题、描述
- [ ] VideoCard：支持缩略图/占位符、播放按钮、平台标识

### 代码质量
- [ ] 所有组件使用 TypeScript 类型
- [ ] 无重复代码，可复用逻辑已提取
- [ ] 响应式设计在各断点测试通过

## Files to Modify

### 优化现有文件
1. `src/layouts/BaseLayout.astro` - 优化 SEO 和主题脚本
2. `src/components/Header.astro` - 添加移动端菜单关闭功能
3. `src/components/Footer.astro` - 微调样式
4. `src/components/ThemeToggle.astro` - 三态切换 UI
5. `tailwind.config.mjs` - 修复重复定义
6. `src/styles/global.css` - 添加过渡动画

### 新建文件
1. `src/components/Sidebar.astro` - 侧边栏组件
2. `src/components/MobileMenu.astro` - 移动端菜单（提取）
3. `src/components/BlogCard.astro` - 博客卡片
4. `src/components/ProjectCard.astro` - 项目卡片
5. `src/components/VideoCard.astro` - 视频卡片

## Success Metrics
- 所有组件在本地开发环境正常显示
- 主题切换流畅无闪烁
- 响应式布局在各设备宽度正常
- 代码通过 TypeScript 类型检查

## References
- BaseLayout: `src/layouts/BaseLayout.astro`
- Header: `src/components/Header.astro`
- Footer: `src/components/Footer.astro`
- ThemeToggle: `src/components/ThemeToggle.astro`
- Design System: `src/styles/global.css`, `tailwind.config.mjs`
