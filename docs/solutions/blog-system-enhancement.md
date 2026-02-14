---
title: 博客系统完善：详情页优化与交互增强
date: 2026-02-14
category: astro
tags: [astro, blog, toc, reading-time]
---

# 博客系统完善：详情页优化与交互增强

## 问题背景

在实现博客详情页时，需要添加一系列增强功能来提升阅读体验：文章目录导航、阅读时间估算、社交分享、相关文章推荐等。

## 解决方案概览

### 1. 文章目录导航 (Table of Contents)

**实现方式：**

```astro
// TableOfContents.astro
interface Heading {
  depth: number;
  slug: string;
  text: string;
}

// 从 Astro 的 render() 获取 headings
const { Content, headings } = await post.render();
```

**关键特性：**
- 响应式布局：桌面端固定侧边栏，移动端折叠面板
- 自动高亮：使用 IntersectionObserver 监听当前阅读位置
- 平滑滚动：点击目录项平滑滚动到对应标题
- 无障碍支持：`aria-label`、`aria-current`

**踩坑记录：**
- **重复渲染问题**：组件内部已处理响应式，不要在父组件渲染两次
- **内存泄漏**：页面切换时需清理 IntersectionObserver

```javascript
// 正确做法：页面切换时清理
let observer = null;

document.addEventListener('astro:before-swap', () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
```

### 2. 阅读时间估算

**算法：**

```typescript
// readingTime.ts
export function calculateReadingTime(content: string): ReadingTimeResult {
  // 移除 Markdown 语法
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')  // 代码块
    .replace(/`[^`]+`/g, '');         // 行内代码

  // 中文字符按 300字/分钟
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const chineseMinutes = chineseChars / 300;

  // 英文单词按 200词/分钟
  const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;
  const englishMinutes = englishWords / 200;

  const minutes = Math.max(1, Math.ceil(chineseMinutes + englishMinutes));
  return { minutes, text: `${minutes} 分钟阅读` };
}
```

**使用：**

```astro
---
const readingTime = calculateReadingTime(post.body);
---
<span>{readingTime.text}</span>
```

### 3. 社交分享功能

**实现 Clipboard API：**

```javascript
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    // 显示成功反馈
  } catch (err) {
    // 降级方案
    window.prompt('复制以下链接:', text);
  }
}
```

### 4. 相关文章推荐

**算法：基于标签/分类匹配**

```typescript
// 计算相关度分数
const scoredPosts = allPosts
  .filter(post => post.slug !== currentSlug)
  .map(post => {
    let score = 0;
    // 分类匹配权重更高
    post.data.categories.forEach(cat => {
      if (categories.includes(cat)) score += 3;
    });
    // 标签匹配
    post.data.tags.forEach(tag => {
      if (tags.includes(tag)) score += 2;
    });
    return { post, score };
  })
  .filter(({ score }) => score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);
```

**性能优化：**
- 通过 props 传递 `allPosts`，避免组件内重复获取数据
- 父组件已获取的数据直接传递给子组件

### 5. Giscus 评论集成

**配置步骤：**

1. 确保 GitHub 仓库已启用 Discussions
2. 访问 https://giscus.app 获取配置 ID
3. 填入 `src/utils/constants.ts`：

```typescript
export const GISCUS_CONFIG = {
  repo: 'username/repo',
  repoId: 'R_kgDO...',      // 从 giscus.app 获取
  category: 'Comments',
  categoryId: 'DIC_kwDO...', // 从 giscus.app 获取
  // ...
};
```

**未配置时的友好提示：**

```astro
{isConfigured ? (
  <script src="https://giscus.app/client.js" {...} />
) : (
  <div class="p-4 bg-secondary rounded-lg">
    💡 评论功能尚未配置，请访问 giscus.app 完成配置...
  </div>
)}
```

## 文件结构

```
src/
├── components/
│   ├── TableOfContents.astro    # 文章目录
│   ├── ShareButtons.astro       # 分享按钮
│   ├── RelatedPosts.astro       # 相关文章
│   └── PostNavigation.astro     # 上一篇/下一篇
├── utils/
│   └── readingTime.ts           # 阅读时间计算
└── pages/blog/
    └── [...slug].astro           # 集成所有功能的详情页
```

## 关键经验

1. **Astro 组件不需要 hydration**：纯 UI 组件不需要 `client:*` 指令
2. **数据流设计**：重复使用的数据应在父组件获取，通过 props 传递
3. **内存管理**：手动创建的 Observer 需要在页面切换时清理
4. **无障碍性**：导航类组件务必添加适当的 ARIA 属性
5. **渐进增强**：评论等外部服务未配置时提供友好降级

## 参考链接

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Giscus Documentation](https://giscus.app)
- [IntersectionObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
