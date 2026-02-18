# 博客详情页 TOC（目录）功能实现指南

**日期**: 2026-02-19
**标签**: #frontend #astro #toc #sticky #intersection-observer

---

## 开发背景

博客详情页需要实现两个核心功能：
1. 目录 sticky 跟随滚动（固定在视口右侧）
2. 滚动时自动高亮当前阅读章节

---

## 遇到的问题及解决方案

### 问题 1: Sticky 定位失效

**症状**: 目录不跟随滚动，一直停留在原位

**尝试的修复**:
- 移除 `max-height` 和 `overflow-y: auto` ❌ 部分有效
- 设置 `align-self: start` ❌ 错误方向
- 检查祖先元素 overflow ❌ 未发现问题

**根本原因**: DOM 结构层级错误
- 之前: `aside` > `.toc-container` > `.toc-sidebar`
- `.toc-container` 高度只有内容高度，不是正文高度
- sticky 元素的父容器高度不足

**最终方案**:
```astro
<!-- 修复后：移除中间层，让 sticky 元素直接作为 aside 子元素 -->
<aside class="article-toc">
  <div class="toc-sidebar" data-toc-sidebar>
    ...
  </div>
</aside>
```

**关键认知**:
- sticky 元素的**直接父容器**必须有足够高度（等于正文高度）
- Grid item 默认 stretch 是 friend，不要设 `align-self: start`
- overflow 任何非 visible 值都会阻断 sticky

---

### 问题 2: 章节高亮失效/混乱

**症状**: 高亮不稳定，有时不工作，有时选择器冲突

**根本原因**:
- 移动 TOC 和桌面 TOC 都使用 `.toc-link` 类
- `document.querySelectorAll('.toc-link')` 选中了移动端的链接
- 移动端链接没有高亮样式，导致逻辑混乱

**最终方案**:
```javascript
// 限定选择器范围，只在桌面 sidebar 内查找
const tocSidebar = document.querySelector('[data-toc-sidebar]');
const tocLinks = tocSidebar.querySelectorAll('.toc-link');
```

```css
/* CSS 也限定范围 */
.toc-sidebar .toc-link { ... }
.toc-sidebar .toc-link.active { ... }
```

---

### 问题 3: Heading 没有 id

**症状**: 高亮逻辑找到 heading，但 `document.getElementById(id)` 返回 null

**原因**: Astro 默认不给 heading 添加 id，需要 rehype-slug 插件

**解决方案**:
```js
// astro.config.mjs
import rehypeSlug from 'rehype-slug';
export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeKatex],
  },
});
```

---

## 技术要点总结

### CSS Sticky 工作原理

1. 元素设置 `position: sticky; top: Npx`
2. 父容器必须有足够高度（滚动空间）
3. 祖先元素不能有 `overflow: hidden/auto/scroll`
4. 在 Grid 中，item 默认 stretch 给 sticky 提供空间

### IntersectionObserver 最佳实践

```javascript
const observerOptions = {
  root: null,
  rootMargin: '-100px 0px -70% 0px', // 上偏移 100px，下偏移 70%
  threshold: 0,
};
```

- `-100px` 补偿 header 高度
- `-70%` 让高亮在章节进入视口上部时触发

### 防御性编程

```javascript
// 通过 href 反查 heading，不依赖特定 id 生成方式
const hashIndex = href.lastIndexOf('#');
const id = decodeURIComponent(href.substring(hashIndex + 1));
const heading = document.getElementById(id);
if (heading) {
  headings.push({ id, element: heading, link });
}
```

---

## 文件变更

| 文件 | 变更内容 |
|------|----------|
| `src/components/TableOfContents.astro` | TOC 组件核心逻辑 |
| `src/pages/blog/[...slug].astro` | 博客详情页布局 |
| `astro.config.mjs` | 添加 rehype-slug 插件 |

---

## 验收标准

- [x] 目录 sticky 跟随滚动
- [x] 滚动时当前章节高亮（紫色 #A855F7）
- [x] 目录标题花体 "Contents"
- [x] 平滑滚动到章节
- [x] 响应式：≤1280px 隐藏桌面 TOC
- [x] 无新 npm 包（使用已安装的 rehype-slug）

---

## 关键教训

### 1. DOM 结构对 Sticky 的影响
Sticky 定位依赖于父容器的高度。如果父容器高度不足（例如只是内容高度而非整个正文高度），sticky 元素将无法正确跟随滚动。

### 2. 选择器作用域的重要性
当页面存在多个相似组件（如移动端和桌面端 TOC）时，必须使用更精确的选择器或限定作用域，避免选中错误的元素。

### 3. 使用 data 属性作为锚点
使用 `data-toc-sidebar` 等 data 属性作为 JavaScript 选择器的锚点，比使用 class 更稳定，不易被样式修改影响。

### 4. 第三方插件配置
Astro 等框架的默认行为可能不符合预期（如不给 heading 添加 id），需要了解并正确配置相关插件（rehype-slug）。

---

## 参考代码

### TableOfContents.astro 核心结构

```astro
---
// 接收 headings 数据
interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

const { headings } = Astro.props;
---

<aside class="article-toc">
  <div class="toc-sidebar" data-toc-sidebar>
    <h2 class="toc-title">Contents</h2>
    <nav class="toc-nav">
      {headings.map((heading) => (
        <a
          href={`#${heading.slug}`}
          class={`toc-link toc-link-h${heading.depth}`}
          data-toc-link
        >
          {heading.text}
        </a>
      ))}
    </nav>
  </div>
</aside>

<script>
  // IntersectionObserver 高亮逻辑
  const tocSidebar = document.querySelector('[data-toc-sidebar]');
  if (tocSidebar) {
    const tocLinks = tocSidebar.querySelectorAll('.toc-link');
    // ... 高亮逻辑
  }
</script>
```

### 关键 CSS

```css
.article-toc {
  /* 作为 grid item，默认 stretch 提供足够高度 */
}

.toc-sidebar {
  position: sticky;
  top: 100px; /* header 高度 + 间距 */
}
```

---

*记录于 2026-02-19，供后续类似功能参考*
