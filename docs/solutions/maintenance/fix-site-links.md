# 全站链接检查与修正

## 问题背景

全站链接存在不一致和错误：
1. Twitter/X 链接指向错误账号
2. Site URL 配置不一致（astro.config.mjs vs constants.ts）
3. 需要验证 RSS 功能正常工作

## 修正内容

### 1. Twitter/X 链接更新

**变更：**
```diff
- export const TWITTER_URL = 'https://twitter.com/RollingTheRock';
+ export const TWITTER_URL = 'https://x.com/2Anrew_ru3';
```

**影响位置：**
- `src/utils/constants.ts` - 主常量定义
- `src/components/JsonLd.astro` - 结构化数据（改为使用常量引用）

### 2. Site URL 统一

**问题：**
- `astro.config.mjs`: `https://amiwrr.blog`
- `constants.ts`: `https://rollingtherock.github.io`

**修正后统一为：** `https://rollingtherock.blog`

```diff
// astro.config.mjs
- site: 'https://amiwrr.blog',
+ site: 'https://rollingtherock.blog',

// constants.ts
- export const SITE_URL = 'https://rollingtherock.github.io';
+ export const SITE_URL = 'https://rollingtherock.blog';
```

### 3. JsonLd.astro 优化

改为从常量导入社交链接，避免硬编码：

```diff
- import { AUTHOR, SITE_TITLE, SITE_URL } from '../utils/constants';
+ import { AUTHOR, SITE_TITLE, SITE_URL, GITHUB_URL, TWITTER_URL } from '../utils/constants';

// ...

- sameAs: [
-   'https://github.com/RollingTheRock',
-   'https://twitter.com/RollingTheRock',
- ],
+ sameAs: [
+   GITHUB_URL,
+   TWITTER_URL,
+ ],
```

## RSS 功能验证

RSS 生成正常，使用新的 site 配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>RollingTheRock</title>
    <link>https://rollingtherock.blog/</link>
    <!-- ... -->
  </channel>
</rss>
```

## 其他检查结果

- ✅ 无 `href="#"` 占位符链接
- ✅ 无遗留的 `ai-daily-digest` 旧页面链接
- ✅ 导航链接全部正确
- ✅ 外部链接都有 `target="_blank"` 和 `rel="noopener noreferrer"`

## 文件变更

| 文件 | 变更 |
|------|------|
| `src/utils/constants.ts` | 更新 TWITTER_URL 和 SITE_URL |
| `astro.config.mjs` | 更新 site 配置 |
| `src/components/JsonLd.astro` | 使用常量替代硬编码链接 |

## 检查清单

- [x] Twitter 链接更新为 `https://x.com/2Anrew_ru3`
- [x] RSS 功能正常工作
- [x] astro.config.mjs site 配置更新
- [x] constants.ts SITE_URL 更新
- [x] JsonLd.astro 使用常量引用
- [x] 构建成功（28 pages）
