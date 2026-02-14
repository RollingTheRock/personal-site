---
title: GitHub Pages 部署 Astro 站点配置与故障排除
date: 2026-02-14
category: deployment
tags: [github-pages, astro, deployment, github-actions, dns, cname]
related_to: [astro, github-actions, static-site-deployment]
status: resolved
---

# GitHub Pages 部署 Astro 站点配置与故障排除

## 问题概述

将 Astro 静态站点部署到 GitHub Pages 时遇到多个配置问题，导致部署失败或站点无法访问。

## 症状

1. **部署失败**: GitHub Actions workflow 运行失败，提示 "Get Pages site failed"
2. **404 错误**: 启用 Pages 后访问返回 404
3. **自动重定向到未配置域名**: 由于 CNAME 文件存在，访问 GitHub Pages 地址自动跳转到未配置 DNS 的自定义域名

## 根本原因

### 1. GitHub Pages 未在仓库设置中启用
- **位置**: Settings → Pages
- **问题**: 首次使用 GitHub Pages 需要手动启用或设置 `enablement: true`

### 2. actions/configure-pages 缺少 enablement 参数
- **文件**: `.github/workflows/deploy.yml`
- **问题**: 首次部署需要显式启用 Pages 服务
- **解决**: 添加 `enablement: true`

### 3. CNAME 文件导致重定向问题
- **文件**: `public/CNAME`
- **问题**: 文件存在但 DNS 未配置，导致访问 GitHub Pages 地址时重定向失败
- **解决**: 临时删除 CNAME，待 DNS 配置完成后再恢复

## 解决方案

### 1. 完整的工作流配置

**文件**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4
        with:
          enablement: true  # 关键：首次部署需要启用 Pages

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. 启用 GitHub Pages 的步骤

1. 访问仓库 Settings → Pages
2. **Source**: 选择 "GitHub Actions"
3. （可选）**Custom domain**: 输入 `amiwrr.blog`
4. 勾选 **Enforce HTTPS**
5. 点击 **Save**

### 3. CNAME 文件管理

**添加自定义域名**（DNS 配置完成后）:
```bash
echo "amiwrr.blog" > public/CNAME
git add public/CNAME
git commit -m "feat: enable custom domain"
git push
```

**临时移除自定义域名**（DNS 未配置时）:
```bash
rm public/CNAME
git add public/CNAME
git commit -m "fix: remove CNAME until DNS is configured"
git push
```

### 4. Astro 配置

**文件**: `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amiwrr.blog',  // 自定义域名
  // 或使用 GitHub Pages 默认地址:
  // site: 'https://rollingtherock.github.io',
  // base: '/personal-site',  // 如果是项目页面而非用户页面
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
```

## 预防措施

### 部署前检查清单

- [ ] GitHub Pages 已在 Settings → Pages 中启用
- [ ] workflow 文件包含 `enablement: true`（首次部署）
- [ ] 确认 CNAME 文件存在性与 DNS 配置状态匹配
- [ ] 本地运行 `npm run build` 验证构建成功
- [ ] 确认 `site` 配置与部署地址一致

### DNS 配置最佳实践

**A 记录**（apex 域名）:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME 记录**（www 子域名）:
```
www.amiwrr.blog → RollingTheRock.github.io
```

### 常见错误避免

| 错误 | 原因 | 解决 |
|------|------|------|
| "Get Pages site failed" | Pages 未启用 | 添加 `enablement: true` 或手动启用 |
| 404 访问 GitHub Pages 地址 | CNAME 配置导致重定向 | 删除 CNAME 或完成 DNS 配置 |
| 构建成功但页面空白 | base 路径配置错误 | 检查 `base` 配置与仓库名是否匹配 |
| 资源加载失败 | 相对路径问题 | 使用 `import.meta.env.BASE_URL` |

## 验证步骤

1. **检查部署状态**:
   ```bash
   gh run list --limit 5
   ```

2. **验证网站访问**:
   - 默认地址: `https://rollingtherock.github.io/personal-site/`
   - 自定义域名: `https://amiwrr.blog/`

3. **检查 GitHub Pages 设置**:
   - 访问 Settings → Pages
   - 确认显示 "Your site is live at..."

## 相关文档

- [Astro GitHub Pages 部署指南](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [actions/configure-pages](https://github.com/actions/configure-pages)

## 参考文件

- `.github/workflows/deploy.yml` - GitHub Actions 工作流
- `astro.config.mjs` - Astro 配置文件
- `public/CNAME` - 自定义域名配置（可选）
