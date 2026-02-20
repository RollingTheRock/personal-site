# 项目页风格改造计划

## 任务概述
将项目列表页和项目详情页的风格与博客页统一，采用复古拼贴设计语言：灰度图片 hover 变彩色、品牌色圆点、花体标题、杂志感布局。

## 涉及文件
1. `src/pages/projects/index.astro` - 列表页布局
2. `src/components/ProjectCard.astro` - 项目卡片组件
3. `src/pages/projects/[...slug].astro` - 详情页布局

## 改造清单

### ✅ 项目列表页 (index.astro)
- [x] 页眉改造：居中标题 → 左右布局 page-header
  - 标题改为 "Projects" (Playfair Display italic)
  - 副标题 "我的开源项目和个人作品"
  - 添加底部边框分隔线
- [x] 网格容器添加 `projects-grid` 类名（互斥暗化效果）

### ✅ 项目卡片 (ProjectCard.astro)
- [x] 图片：默认 grayscale，hover 去灰度 + scale(1.05)
- [x] 标题：添加品牌色圆点 `●` 前缀，hover 变品牌色 #A855F7
- [x] 技术标签：胶囊样式 → 纯文字 `·` 分隔
- [x] GitHub/Demo 链接：hover 变品牌色 #A855F7

### ✅ 项目详情页 ([...slug].astro)
- [x] 页眉：居中 → 左对齐
- [x] 添加顶部元信息行：`项目 · 日期`
- [x] 技术标签：纯文字 `·` 分隔
- [x] 操作按钮：边框样式，hover 品牌色填充
- [x] 封面图：分割线后全宽显示
- [ ] 保留：正文、分享按钮、导航、相关项目

## 技术规格
- 品牌色：`#A855F7` (紫色)
- 过渡动画：`transition-all duration-300`
- 深色模式：仅 dark mode，无需适配 light mode
- 响应式：≤960px 时 page-header 纵向排列

## 验收标准
- [ ] 视觉风格与博客页完全一致
- [ ] 所有 hover 效果正常工作
- [ ] 响应式布局无问题
- [ ] 构建无错误
