---
title: 项目详情页和视频详情页开发
type: feat
date: 2026-02-14
---

# 项目详情页和视频详情页开发

## Overview

开发项目和视频的详情页，统一内容展示风格，与博客详情页保持一致的阅读体验。

## Current State

- 项目列表页已存在 (`/projects/index.astro`)
- 视频列表页已存在 (`/videos/index.astro`)
- 项目详情页路由已配置 (`/projects/[...slug].astro`) 但内容简单
- 视频详情页路由已配置 (`/videos/[...slug].astro`) 但内容简单
- 缺少富文本内容展示

## Proposed Solution

### 1. 项目详情页 (Project Detail)

页面结构：
- 项目标题 + 描述
- 项目封面图（大图展示）
- 技术栈标签展示
- 项目链接（GitHub / Demo）
- 项目详细介绍（支持 Markdown）
- 相关项目推荐
- 上一篇/下一篇导航

新增字段支持：
```typescript
// content/config.ts
projects: {
  title: string;
  description: string;
  date: Date;
  image: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}
```

### 2. 视频详情页 (Video Detail)

页面结构：
- 视频标题 + 描述
- 视频封面（带播放按钮）
- 平台标识（Bilibili/YouTube）
- 视频链接跳转
- 视频详细介绍
- 相关视频推荐
- 上一篇/下一篇导航

### 3. 统一布局组件

创建 `ContentDetailLayout` 抽象组件：
- 统一的头部样式（标题、描述、日期）
- 统一的封面图展示
- 统一的元信息区域
- 统一的底部导航

### 4. 样式统一

所有详情页保持一致的：
- 最大宽度 (`max-w-article` / `max-w-medium`)
- 字体排版
- 间距系统
- 深色模式支持

## Technical Considerations

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/content/config.ts` | 修改 | 确保 projects/videos schema 完整 |
| `src/pages/projects/[...slug].astro` | 重写 | 完整的项目详情页 |
| `src/pages/videos/[...slug].astro` | 重写 | 完整的视频详情页 |
| `src/components/ProjectLinks.astro` | 新增 | GitHub/Demo 链接按钮组 |
| `src/components/VideoPlayer.astro` | 新增 | 视频平台跳转组件 |
| `src/components/RelatedItems.astro` | 新增 | 通用的相关项目/视频推荐 |
| `src/components/ContentHeader.astro` | 新增 | 统一的内容头部组件 |

### 示例内容

更新项目内容文件，添加详细介绍：
```markdown
---
title: "AI Daily Digest"
description: "自动抓取 AI 论文并生成日报邮件"
date: 2024-01-15
tech: ["Python", "OpenAI", "GitHub Actions"]
github: "RollingTheRock/ai-daily-digest"
demo: "https://rollingtherock.github.io/ai-daily-digest"
image: "/images/projects/ai-daily.jpg"
---

## 项目介绍

AI Daily Digest 是一个自动化的 AI 论文聚合工具...

## 技术栈

- **Python**: 核心抓取和摘要逻辑
- **OpenAI API**: 论文摘要生成
- **GitHub Actions**: 定时任务调度

## 功能特性

1. 自动抓取 arXiv 最新论文
2. 智能摘要生成
3. 邮件订阅推送
```

## Acceptance Criteria

- [ ] 项目详情页完整展示项目信息
- [ ] 视频详情页完整展示视频信息
- [ ] 技术栈/平台标签样式统一
- [ ] 外部链接（GitHub/Demo/视频）可正常跳转
- [ ] 相关推荐基于技术栈/平台匹配
- [ ] 上一篇/下一篇导航正常工作
- [ ] 移动端体验良好
- [ ] 深色模式样式正确
- [ ] 与博客详情页风格一致

## References

- 博客详情页实现: `src/pages/blog/[...slug].astro`
- RelatedPosts 组件: `src/components/RelatedPosts.astro`
