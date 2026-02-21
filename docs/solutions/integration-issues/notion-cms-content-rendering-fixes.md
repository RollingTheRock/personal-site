---
title: Notion CMS 内容渲染问题修复
description: 修复 Notion CMS 集成中的文章内容不显示、TOC目录不显示、图片URL过期等问题
date: 2026-02-22
category: integration-issues
tags:
  - notion
  - astro
  - cms
  - troubleshooting
status: completed
---

# Notion CMS 内容渲染问题修复

## 问题概述

在使用 Notion 作为 CMS 的 Astro 博客项目中，遇到了多个集成问题：

1. **文章正文不显示** - 页面只显示标题、封面图和标签，正文内容为空
2. **TOC目录不显示** - 侧边目录组件无内容
3. **图片URL过期** - Notion图片在部署后约1小时失效

---

## 问题 1: 文章正文不显示

### 症状
- 博客详情页只显示标题、封面图、标签
- 正文内容区域完全空白
- 构建时无错误，但内容未渲染

### 根因分析

**ID格式不匹配问题**:
- Notion页面ID使用UUID格式（带连字符，如 `30d785b0-9b71-80c1-a20d-fa1c9fcf8b98`）
- 本地Markdown使用简单字符串ID（如 `welcome-to-my-blog`）
- `isValidNotionPageId()` 函数只接受32位无连字符的十六进制，导致所有Notion文章被误判

**Notion API ID格式问题**:
- Notion API返回的ID带连字符（36字符）
- 但API调用时需要去掉连字符（32字符）

### 解决方案

```typescript
// src/lib/notion-cms.ts

/**
 * 检查ID是否为有效的Notion页面ID（支持带/不带连字符的UUID）
 */
function isValidNotionPageId(id: string): boolean {
  if (!id) return false;
  // 带连字符的标准UUID格式（36字符）
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) {
    return true;
  }
  // 不带连字符的32位十六进制
  if (/^[a-f0-9]{32}$/i.test(id)) {
    return true;
  }
  return false;
}

/**
 * 将Notion页面ID转换为API格式（去掉连字符）
 */
function toNotionApiId(id: string): string {
  return id.replace(/-/g, '');
}

export async function getPostContent(pageId: string, slug?: string, type?: string): Promise<string> {
  // 1. 尝试从Notion获取（仅在ID是有效的Notion UUID时）
  if (isNotionConfigured() && isValidNotionPageId(pageId)) {
    try {
      const apiPageId = toNotionApiId(pageId);
      const blocks = await getPageBlocks(apiPageId);
      return await blocksToHtml(blocks);
    } catch (error) {
      console.warn('Notion 内容获取失败，尝试本地回退:', error);
    }
  }

  // 2. 回退到本地Markdown
  if (slug) {
    const localContent = type === '项目'
      ? await getLocalProjectContent(slug)
      : await getLocalBlogContent(slug);
    if (localContent) return localContent;
  }

  return '';
}
```

### 关键学习
- 混合数据源时，必须使用正则验证ID格式以区分来源
- Notion API需要无连字符的ID，尽管查询结果返回带连字符的ID

---

## 问题 2: TOC目录不显示

### 症状
- 侧边目录组件完全空白
- 移动端折叠式目录也无法显示

### 根因分析

**内容格式假设错误**:
```typescript
// 旧代码（失效）
const headings = content.split('\n')
  .filter(line => line.startsWith('#'))  // 假设是Markdown格式
  .map(...)
```

切换到Notion后，`content`是HTML格式（通过`blocksToHtml()`渲染），不再是Markdown：
- HTML使用`<h1>`, `<h2>`, `<h3>`标签
- 没有以`#`开头的行
- `headings`数组始终为空

### 解决方案

**步骤1: 给标题添加ID属性**

```typescript
// src/lib/notion-renderer.ts

function slugify(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // 去掉HTML标签
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')     // 空格转连字符
    .replace(/[^\w\u4e00-\u9fff-]/g, '') // 保留中文、字母、数字、连字符
    .substring(0, 50);
}

case 'heading_2': {
  const h2Text = renderRichText(content.rich_text || []);
  const h2Slug = slugify(h2Text);
  return `${indent}<h2 id="${h2Slug}">${h2Text}</h2>\n`;
}
```

**步骤2: 从HTML提取标题**

```typescript
// src/lib/notion-cms.ts

export function extractHeadings(html: string): { depth: number; slug: string; text: string }[] {
  const headings: { depth: number; slug: string; text: string }[] = [];
  const regex = /<h([1-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-3]>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const depth = parseInt(match[1]);
    const slug = match[2];
    const text = match[3].replace(/<[^>]*>/g, ''); // 去掉内部HTML标签
    if (text && slug) {
      headings.push({ depth, slug, text });
    }
  }

  return headings;
}
```

**步骤3: 在页面中使用**

```astro
---
// src/pages/blog/[...slug].astro
import { extractHeadings } from '../../lib/notion-cms.js';

const content = await getPostContent(post.id, post.slug, post.type);
const headings = extractHeadings(content); // 从HTML提取
---

<TableOfContents headings={headings} />
```

### 关键学习
- 切换内容源时，必须审计所有下游消费者的格式假设
- 中文slug处理：使用 `\u4e00-\u9fff` 正则范围保留中文字符
- HTML正则解析在受控场景下（如Notion生成的HTML）是可行的

---

## 问题 3: Notion图片URL过期

### 症状
- 图片在构建后能正常显示约1小时
- 之后图片变为404/403错误
- 刷新页面无法恢复

### 根因分析

Notion的文件URL托管在AWS S3上，是**签名URL**，有过期时间（约1小时）：
1. 构建时获取的URL是新鲜的
2. 1小时后签名过期
3. 静态网站继续使用过期URL
4. 用户看到图片失效

### 解决方案

**步骤1: 创建图片下载工具**

```typescript
// src/lib/notion-images.ts

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const IMAGE_DIR = 'dist/images/notion';

export async function downloadNotionImage(url: string): Promise<string> {
  if (!url) return '';

  // 跳过已是本地的URL
  if (url.startsWith('/images/')) return url;

  // 跳过非Notion的外部URL
  if (!url.includes('amazonaws.com') && !url.includes('notion')) {
    return url;
  }

  ensureDir();

  try {
    // 使用URL哈希作为文件名（去掉查询参数）
    const hash = crypto.createHash('md5').update(url.split('?')[0]).digest('hex');
    const ext = getExtension(url);
    const filename = `${hash}${ext}`;
    const filepath = path.join(IMAGE_DIR, filename);

    // 已下载则直接返回
    if (fs.existsSync(filepath)) {
      return `/images/notion/${filename}`;
    }

    // 下载图片
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`下载图片失败 (${res.status}): ${url.substring(0, 100)}...`);
      return url;
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // 验证图片格式（magic bytes）
    if (!isValidImage(buffer)) {
      console.warn(`无效的图片数据: ${url.substring(0, 100)}...`);
      return url;
    }

    fs.writeFileSync(filepath, buffer);
    console.log(`已下载图片: ${filename}`);

    return `/images/notion/${filename}`;
  } catch (error) {
    console.warn(`下载图片出错: ${error}`);
    return url;
  }
}

/**
 * 验证图片magic bytes
 */
function isValidImage(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;

  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return true;

  // WebP: RIFF....WEBP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    if (buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return true;
    }
  }

  // SVG
  const header = buffer.toString('utf8', 0, 100).toLowerCase();
  if (header.includes('<?xml') || header.includes('<svg')) return true;

  return false;
}
```

**步骤2: 在渲染器中处理图片**

```typescript
// src/lib/notion-renderer.ts

case 'image': {
  let url = '';
  if (content.type === 'external') {
    url = content.external?.url || '';
  } else if (content.type === 'file') {
    url = content.file?.url || '';
  }

  const caption = content.caption?.map((rt: RichText) => rt.plain_text || '').join('') || '';

  if (!url) return '';

  // 下载Notion图片到本地
  const localUrl = await downloadNotionImage(url);

  return `${indent}<figure>\n${indent}  <img src="${localUrl}" alt="${caption}" loading="lazy" />\n${indent}</figure>\n`;
}
```

**步骤3: 处理封面图**

```typescript
// src/lib/notion-cms.ts

async function pageToPost(page: any): Promise<Post> {
  const properties = page.properties;

  // 下载封面图
  const notionImageUrl = getPropertyValue(properties['封面图']);
  const image = await downloadNotionImage(notionImageUrl);

  return {
    id: page.id,
    title: getPropertyValue(properties['标题']),
    slug: getPropertyValue(properties['Slug']),
    description: getPropertyValue(properties['摘要']),
    date: getPropertyValue(properties['发布日期']),
    image, // 现在是本地路径如 /images/notion/a1b2c3d4.png
    // ...
  };
}
```

**步骤4: 更新.gitignore**

```gitignore
# 下载的Notion图片（构建时自动生成）
dist/images/notion/
```

### 关键学习
- **永远不要**在生产环境直接使用Notion的签名URL
- MD5哈希创建确定性文件名，避免重复下载
- Magic bytes验证比文件扩展名更可靠
- 下载失败时保留原始URL作为fallback
- 注意：图片下载到 `dist/` 而非 `public/`，因为Astro在构建开始时已复制完public目录

---

## 问题 4: @notionhq/client SDK 打包问题

### 症状
- 运行时错误：`TypeError: notion.databases.query is not a function`
- 本地开发正常，静态构建失败

### 根因分析

`@notionhq/client` v5 使用ESM/CJS混合导出，在Vite SSR打包时出现问题：
- 类可以实例化
- 但方法（`databases`, `pages`, `blocks`）在运行时为`undefined`

### 解决方案

完全替换SDK为原生`fetch`：

```typescript
// src/lib/notion.ts

export const NOTION_TOKEN = import.meta.env?.NOTION_TOKEN || process.env?.NOTION_TOKEN || '';
export const NOTION_DATABASE_ID = import.meta.env?.NOTION_DATABASE_ID || process.env?.NOTION_DATABASE_ID || '';
const NOTION_API = 'https://api.notion.com/v1';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

export async function queryDatabase(filter?: any, sorts?: any[]): Promise<any> {
  const url = `${NOTION_API}/databases/${NOTION_DATABASE_ID}/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ filter, sorts }),
  });
  return res.json();
}

export async function getPageBlocks(pageId: string): Promise<any[]> {
  const allBlocks: any[] = [];
  let cursor: string | undefined;

  do {
    const url = `${NOTION_API}/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    allBlocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return allBlocks;
}
```

### 关键学习
- SDK可能在Node.js工作但在SSR/静态环境中失败
- 原生`fetch`在所有JavaScript环境中都可靠
- Notion REST API直接调用简单直接
- 使用原生API时需要手动处理分页（`has_more`/`next_cursor`）

---

## 总结

| 问题 | 根因 | 解决方案 |
|------|------|----------|
| 正文不显示 | ID格式不匹配；UUID格式假设错误 | 正则验证UUID格式；API ID格式转换 |
| TOC不显示 | HTML内容被当作Markdown解析 | HTML正则提取；渲染时添加heading ID |
| 图片过期 | Notion S3签名URL 1小时过期 | 构建时下载到本地；使用hash文件名 |
| SDK打包错误 | `@notionhq/client` v5 ESM/CJS问题 | 原生`fetch`实现 |

---

## 预防建议

1. **混合CMS策略**：使用ID前缀或清晰的类型区分不同来源的内容
2. **格式文档化**：明确记录每个数据流的内容格式（Markdown/HTML）
3. **外部资源审查**：所有第三方URL都需要检查是否签名/过期
4. **SDK评估**：在SSR/静态生成项目中，优先评估原生API调用
5. **构建时资产处理**：所有动态获取的资产（图片、字体）都应在构建时下载到输出目录

---

## 相关文件

- `src/lib/notion.ts` - 原生fetch实现的Notion API客户端
- `src/lib/notion-cms.ts` - 内容获取和转换逻辑
- `src/lib/notion-renderer.ts` - Notion blocks到HTML渲染器
- `src/lib/notion-images.ts` - 图片下载工具
- `src/pages/blog/[...slug].astro` - 博客详情页
- `.github/workflows/deploy.yml` - 部署工作流
