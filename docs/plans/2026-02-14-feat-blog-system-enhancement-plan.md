---
title: 博客系统完善：详情页优化与交互增强
type: feat
date: 2026-02-14
---

# 博客系统完善：详情页优化与交互增强

## Overview

优化博客详情页的阅读体验，集成完整功能：目录导航、阅读时间、文章分享、相关推荐，并完成 Giscus 评论系统的配置。

## Current State

博客详情页已有基础结构，但缺少以下功能：
- ❌ Table of Contents（文章目录导航）
- ❌ 阅读时间估算
- ❌ 文章分享功能
- ❌ 相关文章推荐
- ❌ 上一篇/下一篇导航
- ⚠️ Giscus 评论配置不完整（缺少 repoId/categoryId）

## Proposed Solution

### 1. 文章目录导航 (Table of Contents)

使用 `rehype-toc` 插件自动生成目录：
- 在文章右侧显示固定目录（桌面端）
- 点击目录项平滑滚动到对应位置
- 滚动时自动高亮当前阅读位置
- 移动端收起为可展开的面板

### 2. 阅读时间估算

创建工具函数计算阅读时间：
- 中文字符：按每分钟 300 字计算
- 英文单词：按每分钟 200 词计算
- 显示在文章头部 meta 区域

### 3. Giscus 评论系统配置

配置完整的 Giscus 集成：
- 用户需先在 https://giscus.app 启用仓库讨论功能
- 获取 repoId 和 categoryId
- 支持深浅色主题自适应

### 4. 文章分享功能

添加分享按钮组：
- Twitter/X 分享
- 复制链接到剪贴板
- 生成分享二维码（可选）

### 5. 相关文章推荐

基于标签/分类匹配：
- 显示 3 篇最相关的文章
- 使用 BlogCard 组件展示
- 无相关文章时隐藏该区块

### 6. 上一篇/下一篇导航

添加文章间导航：
- 按时间顺序显示上一篇/下一篇
- 使用卡片样式展示
- 放在评论区上方

## Technical Considerations

### 依赖安装

```bash
npm install rehype-toc reading-time
npm install -D @types/reading-time
```

### 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `astro.config.mjs` | 修改 | 添加 rehype-toc 插件 |
| `src/utils/readingTime.ts` | 新增 | 阅读时间计算工具 |
| `src/utils/toc.ts` | 新增 | 目录生成工具 |
| `src/components/TableOfContents.astro` | 新增 | 目录组件 |
| `src/components/ShareButtons.astro` | 新增 | 分享按钮组件 |
| `src/components/RelatedPosts.astro` | 新增 | 相关文章组件 |
| `src/components/PostNavigation.astro` | 新增 | 上一篇/下一篇导航 |
| `src/pages/blog/[...slug].astro` | 修改 | 集成所有新功能 |
| `src/utils/constants.ts` | 修改 | 更新 Giscus 配置说明 |
| `src/styles/global.css` | 修改 | 添加目录样式 |

## Acceptance Criteria

- [ ] 文章目录自动生成并正确显示
- [ ] 目录点击可平滑滚动到对应标题
- [ ] 阅读时间显示在文章头部
- [ ] Giscus 评论配置文档完整（含获取 ID 的步骤）
- [ ] 分享按钮可正常复制链接
- [ ] 相关文章基于标签/分类正确匹配
- [ ] 上一篇/下一篇导航正常显示
- [ ] 移动端体验良好（目录可折叠）
- [ ] 深色模式样式正确

## References

- rehype-toc: https://github.com/JS-DevTools/rehype-toc
- reading-time: https://github.com/ngryman/reading-time
- Giscus: https://giscus.app
