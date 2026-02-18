# 博客详情页修复：订阅模块恢复与 TOC 高亮优化

## 问题背景

修复博客详情页的两个问题：
1. 恢复订阅模块
2. 修复目录的 sticky 跟随和章节高亮

## 解决方案

### 1. 恢复订阅模块

复用了项目中已有的 `Subscribe.astro` 组件，它支持：
- 通过 Buttondown API 提交订阅
- 完整版和紧凑版两种模式
- 成功/失败状态提示

在 `[...slug].astro` 中：
- 导入 Subscribe 组件
- 放置在 Tags 之后、Comments 之前

### 2. 修复 TOC 高亮

**原问题**：高亮逻辑依赖 `data-heading-id` 属性，但 heading 可能没有 id。

**修复方案**：
- 改为通过 `href` 属性提取 id 来匹配 heading
- 使用 `decodeURIComponent` 处理中文 id
- 如果 heading 不存在则跳过，不报错
- 默认高亮第一个目录项

**关键代码**：
```javascript
const headings = [];
tocLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;

  const hashIndex = href.lastIndexOf('#');
  if (hashIndex === -1) return;

  const id = decodeURIComponent(href.substring(hashIndex + 1));
  const heading = document.getElementById(id);
  if (heading) {
    headings.push({ id, element: heading, link });
  }
});
```

### 3. TOC Sticky 定位

原有代码已正确设置：
```css
.toc-sidebar {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
```

**关键点**：
- Grid 布局不设 `align-items`，让右侧 aside 高度与左侧相等
- Sticky 设在内部 `.toc-sidebar`，不是外层 wrapper

## 涉及文件

- `src/pages/blog/[...slug].astro` - 添加 Subscribe 导入和引用
- `src/components/TableOfContents.astro` - 优化高亮 JS 逻辑

## 验收标准验证

- [x] 文章正文末尾有订阅模块
- [x] 目录 sticky 跟随滚动
- [x] 滚动时目录当前章节高亮（紫色文字 + 左侧紫色竖线）
- [x] 目录标题为花体 "Contents"
- [x] 正文链接为品牌紫色
- [x] ≤1280px 时目录隐藏
- [x] JS 不报错，即使 heading 没有 id
- [x] 不依赖任何新 npm 包
- [x] 不修改 astro.config.mjs

## 经验教训

### TOC 高亮实现要点

1. **避免依赖可选属性**：不要假设 heading 一定有 id 或 data 属性，应从 href 解析
2. **处理中文 id**：中文 heading 的 id 可能被编码，需用 `decodeURIComponent` 解码
3. **防御性编程**：找不到对应 heading 时优雅跳过，不抛出错误
4. **默认状态**：页面加载时默认高亮第一个目录项，提升用户体验

### Sticky 定位陷阱

1. **Grid 布局中的 sticky**：父容器不要设置 `align-items: stretch` 以外的值，否则 sticky 可能失效
2. **sticky 元素的父级**：sticky 元素需要有足够高度的父级容器才能"粘"住
3. **top 值选择**：`top: 80px` 要考虑固定导航栏的高度

### 组件复用原则

1. **优先使用现有组件**：项目中已有 `Subscribe.astro`，无需重新实现
2. **props 设计**：好的组件应支持多种模式（compact/full）适应不同场景
3. **放置位置**：订阅模块放在 Tags 之后、Comments 之前是合理的内容流

## 参考代码

### TableOfContents.astro 高亮逻辑

```javascript
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;

    // 从 href 中提取 id，而不是依赖 data-heading-id
    const headings = [];
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const hashIndex = href.lastIndexOf('#');
      if (hashIndex === -1) return;

      const id = decodeURIComponent(href.substring(hashIndex + 1));
      const heading = document.getElementById(id);
      if (heading) {
        headings.push({ id, element: heading, link });
      }
    });

    if (headings.length === 0) return;

    // 默认高亮第一个
    headings[0].link.classList.add('active');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(link => link.classList.remove('active'));
            const activeHeading = headings.find(h => h.element === entry.target);
            if (activeHeading) {
              activeHeading.link.classList.add('active');
            }
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(h => observer.observe(h.element));
  });
</script>
```

### [...slug].astro 布局结构

```astro
---
import Subscribe from '../../components/Subscribe.astro';
---

<article>
  <!-- 文章正文 -->
  <div class="prose">...</div>

  <!-- 标签 -->
  <div class="tags">...</div>

  <!-- 订阅模块 -->
  <Subscribe variant="compact" />

  <!-- 评论 -->
  <Comments />
</article>

<aside class="toc-container">
  <div class="toc-sidebar">
    <TableOfContents headings={headings} />
  </div>
</aside>
```

---

**记录时间**: 2026-02-19
**相关提交**: 博客详情页 TOC 和订阅模块修复
