# 全站链接检查与修正计划

## 任务概述

检查并修正全站所有链接，确保社交链接、RSS 订阅、导航链接、内容链接等全部正确。

## 当前问题发现

### 1. Twitter/X 链接错误
- **当前**: `https://twitter.com/RollingTheRock`
- **应改为**: `https://x.com/2Anrew_ru3`
- **影响文件**:
  - `src/utils/constants.ts` - TWITTER_URL
  - `src/components/JsonLd.astro` - JSON-LD 中的 twitter 链接

### 2. Site 配置不一致
- **astro.config.mjs**: site 为 `https://amiwrr.blog`
- **constants.ts**: SITE_URL 为 `https://rollingtherock.github.io`
- **应统一为**: `https://rollingtherock.blog`

### 3. RSS 功能状态
- ✅ RSS 文件存在 (`src/pages/rss.xml.ts`)
- ✅ @astrojs/rss 依赖已安装
- ⚠️ 需要更新 site 配置确保 RSS 正常工作

### 4. 内容链接检查
- 发现 `fomo-killer.md` 中的 GitHub 链接指向 `ai-daily-digest` 仓库，这是正确的（仓库名未变）
- 未发现 `ai-daily-digest` 的旧页面链接
- 未发现 `href="#"` 占位符链接

## 详细变更清单

### constants.ts
```diff
- export const TWITTER_URL = 'https://twitter.com/RollingTheRock';
+ export const TWITTER_URL = 'https://x.com/2Anrew_ru3';

- export const SITE_URL = 'https://rollingtherock.github.io';
+ export const SITE_URL = 'https://rollingtherock.blog';
```

### astro.config.mjs
```diff
- site: 'https://amiwrr.blog',
+ site: 'https://rollingtherock.blog',
```

### JsonLd.astro
更新 JSON-LD 结构化数据中的 twitter 链接。

## 检查清单

- [ ] Twitter 链接更新为 `https://x.com/2Anrew_ru3`
- [ ] SITE_URL 更新为 `https://rollingtherock.blog`
- [ ] astro.config.mjs site 更新为 `https://rollingtherock.blog`
- [ ] JsonLd.astro 中的 twitter 链接更新
- [ ] RSS 功能正常工作
- [ ] 构建成功

## 文件变更

| 文件 | 变更 |
|------|------|
| `src/utils/constants.ts` | 更新 TWITTER_URL 和 SITE_URL |
| `astro.config.mjs` | 更新 site 配置 |
| `src/components/JsonLd.astro` | 更新 twitter 链接 |
