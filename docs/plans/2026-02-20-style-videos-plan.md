# 视频页风格改造计划

## 任务概述
将视频列表页和详情页风格与全站统一，使用橙色品牌色 `#F97316`。

## 关键发现
- 视频使用 `thumbnail` 字段作为封面（非 `image`）
- 平台字段为 `platform: 'bilibili' | 'youtube'`
- 当前仅 1 个视频内容，需支持单视频全宽展示

## 改造清单

### 视频列表页 (src/pages/videos/index.astro)
- [x] 页眉：居中 → 左右布局 `page-header`
- [x] 标题改为 "Videos" (Playfair Display italic)
- [x] 自适应布局：1 个视频全宽，2+ 两列网格
- [x] 互斥暗化效果（多视频时）

### 视频卡片 (src/components/VideoCard.astro)
- [x] 封面图默认灰度，hover 去灰度 + scale(1.05)
- [x] 播放图标：默认半透明白色，hover 变橙色
- [x] 标题：橙色圆点 `●` 前缀，hover 变橙色
- [x] 来源标签：胶囊 → 纯文字灰色小字
- [x] 单视频布局支持（大封面 + 描述）

### 视频详情页 (src/pages/videos/[...slug].astro)
- [x] 保持居中布局
- [x] 添加元信息行：`平台(橙色) · 日期`
- [x] 移除平台胶囊标签
- [x] 按钮：边框风格，hover 橙色 + 轻微背景
- [x] iframe 嵌入（移除重复标题）
- [x] 右上角辅助外链

### 工具函数 (src/utils/platform.ts)
- [x] 添加 `getVideoEmbedUrl` 函数

## 技术规格
- 品牌色：`#F97316` (橙色)
- 过渡动画：`transition: all 0.3s ease`
- 图片字段：`thumbnail`（视频专用）
- 平台字段：`platform` → `getPlatformName()`

## 响应式策略
- 单视频：全宽展示，更大封面
- 多视频：两列网格，互斥暗化
