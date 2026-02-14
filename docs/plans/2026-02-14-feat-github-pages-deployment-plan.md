---
title: "配置 GitHub Pages 自动部署"
type: feat
date: 2026-02-14
---

# 配置 GitHub Pages 自动部署

## Overview

为 Astro 静态站点配置 GitHub Actions 自动部署到 GitHub Pages，支持自定义域名 amiwrr.blog，实现代码推送后自动构建和部署。

## Current State

- Astro 配置已设置 `site: 'https://amiwrr.blog'`
- Output 模式已为 `static`
- `.github/workflows` 目录已存在但为空
- 项目使用 Node.js 18+ 和 npm

## Proposed Solution

创建 GitHub Actions 工作流，在以下情况触发部署：
1. 代码推送到 `main` 分支
2. 手动触发（workflow_dispatch）

## Technical Details

### 1. GitHub Actions 工作流

文件：`.github/workflows/deploy.yml`

关键配置：
- **触发器**: `push` 到 main 分支 + `workflow_dispatch`
- **权限**: `contents: read`, `pages: write`, `id-token: write`
- **并发控制**: 防止重复部署
- **构建步骤**:
  1. Checkout 代码
  2. 设置 Node.js 环境
  3. 安装依赖 (`npm ci`)
  4. 构建 Astro (`npm run build`)
  5. 部署到 GitHub Pages

### 2. Astro 配置调整

文件：`astro.config.mjs`

可能需要添加：
```javascript
base: '/', // 或使用 repository 名称作为 subpath
```

### 3. 自定义域名配置

文件：`public/CNAME`

内容：
```
amiwr.blog
```

GitHub Pages 将自动读取此文件配置自定义域名。

### 4. GitHub 仓库设置

需要用户手动配置的设置项（在 README 中说明）：
1. Settings → Pages → Source: GitHub Actions
2. Settings → Pages → Custom domain: amiwrr.blog
3. Settings → Pages → Enforce HTTPS (推荐)

## Acceptance Criteria

- [ ] 创建 `.github/workflows/deploy.yml` 工作流文件
- [ ] 创建 `public/CNAME` 自定义域名文件
- [ ] 更新 `README.md` 添加部署状态徽章和部署说明
- [ ] 验证 Astro 配置正确设置 site URL
- [ ] 提供手动部署触发方式
- [ ] 文档说明 GitHub 仓库必要设置

## Testing Steps

1. 推送代码到 main 分支
2. 检查 Actions 标签页是否有工作流运行
3. 验证构建成功，无错误
4. 检查 Settings → Pages 显示部署状态
5. 访问 https://amiwrr.blog 验证站点可访问

## References

- Astro 部署文档: https://docs.astro.build/en/guides/deploy/github/
- GitHub Pages 文档: https://docs.github.com/en/pages
- 当前 Astro 配置: `astro.config.mjs:8` (site URL)
