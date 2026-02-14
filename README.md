# RollingTheRock 个人网站

一个极简、优雅的个人网站，用于展示博客、项目和视频内容。

## 在线预览

[![Deploy to GitHub Pages](https://github.com/RollingTheRock/personal-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/RollingTheRock/personal-site/actions/workflows/deploy.yml)

🌐 [https://amiwrr.blog](https://amiwrr.blog)

## 技术栈

- **框架**: [Astro](https://astro.build) - 内容驱动网站的完美选择
- **样式**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- **部署**: [GitHub Pages](https://pages.github.com) - 自动构建部署
- **评论**: [Giscus](https://giscus.app) - 基于 GitHub Discussions
- **订阅**: [Buttondown](https://buttondown.email) - 简洁的 Newsletter

## 设计风格

- **参考**: Every.to + Notion
- **特点**: 极简、优雅、配图丰富、适度动效
- **配色**: 黑白灰为主，配图色彩丰富
- **字体**:
  - 标题: Playfair Display + Noto Serif SC
  - 正文: Inter + system-ui
  - 代码: JetBrains Mono

## 网站结构

```
/
├── 首页 (/)                    - 侧边导航 + Hero + 最新内容
├── 博客 (/blog)                - 文章列表
│   ├── 详情页 (/blog/:slug)    - 文章详情 + 评论
│   ├── 分类 (/blog/categories/:slug)
│   └── 标签 (/blog/tags/:slug)
├── 项目 (/projects)            - 项目展示
├── 视频 (/videos)              - 视频列表 + 嵌入播放
├── 关于 (/about)               - 个人介绍
└── RSS (/rss.xml)              - 订阅源
```

## 本地开发

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:4321

### 构建生产版本

```bash
npm run build
```

## 内容创作

### 创建博客文章

```bash
# 在 src/content/blog/ 创建新的 .md 文件
---
title: "文章标题"
description: "文章摘要"
date: 2026-02-14
categories: ["技术"]
tags: ["区块链", "零知识证明"]
image: "/images/blog/cover.jpg"
featured: false
draft: false
---

文章内容支持 Markdown 格式...
```

### 创建项目

```bash
# 在 src/content/projects/ 创建新的 .md 文件
---
title: "项目名称"
description: "一句话描述"
image: "/images/projects/cover.jpg"
github: "https://github.com/..."
demo: "https://..."
tech: ["Rust", "TypeScript"]
featured: true
date: 2026-01-01
---

项目详细介绍...
```

### 创建视频

```bash
# 在 src/content/videos/ 创建新的 .md 文件
---
title: "视频标题"
description: "视频描述"
date: 2026-02-14
platform: "bilibili"
video_id: "BV1234567"
thumbnail: "/images/videos/thumb.jpg"
---
```

## 主题切换

网站支持深色/亮色模式切换：
- 默认跟随系统偏好
- 手动切换按钮位于侧边栏/页脚
- 偏好设置保存在 localStorage

## 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages：

### 自动部署

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发构建
3. 构建完成后自动部署到 GitHub Pages

### 手动触发

在 GitHub 仓库页面：
- 进入 **Actions** 标签页
- 选择 **Deploy to GitHub Pages** 工作流
- 点击 **Run workflow**

### 首次设置（必需）

1. **启用 GitHub Pages**
   - 进入仓库 **Settings** → **Pages**
   - **Source**: 选择 "GitHub Actions"

2. **配置自定义域名**（可选）
   - 在 **Pages** 设置中添加自定义域名: `amiwrr.blog`
   - 勾选 **Enforce HTTPS**（推荐）
   - 或在仓库根目录创建 `public/CNAME` 文件（已配置）

3. **验证部署**
   - 访问 https://amiwrr.blog 查看站点
   - 或在 **Settings** → **Pages** 查看部署状态

## 致谢

- 设计灵感: [Every.to](https://every.to) + [Notion](https://notion.so)
- 构建工具: [Astro](https://astro.build)
- 图标: [Lucide Icons](https://lucide.dev)

## License

MIT License - 详见 [LICENSE](./LICENSE) 文件
