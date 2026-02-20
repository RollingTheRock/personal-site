# TOC 高亮功能修复

## 问题描述

博客详情页目录（TOC）的 active 章节高亮在上一轮改动后完全消失。原因是移除了 `.toc-link.active` 原有的 `border-left` 高亮样式，改用独立的 `.toc-indicator` 指示条元素，但 JS 定位逻辑未能正确运行。

## 修复方案

放弃独立的指示条方案，改为直接在 `.toc-link` 上用 CSS 实现所有效果，更加简单可靠。

## 代码变更

### 1. 删除独立指示条元素

从 HTML 中移除 `<div class="toc-indicator"></div>` 元素。

### 2. 恢复并增强 .toc-link 样式

```css
.toc-link {
  display: block;
  font-size: 13px;
  color: #6B7280;
  padding: 0.375rem 0;
  padding-left: 0.75rem;
  text-decoration: none;
  border-left: 2px solid transparent;  /* 新增：默认透明边框 */
  transform: translateX(0);             /* 新增：默认位置 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
}

.toc-link:hover {
  color: #ffffff;
  transform: translateX(4px);
}

.toc-link.active {
  color: #A855F7;
  border-left-color: #A855F7;  /* 新增：紫色左侧竖线 */
  transform: translateX(4px);
}
```

**关键点：**
- `border-left: 2px solid transparent` 作为默认状态，确保 active 时左侧竖线有平滑过渡
- `transition: all 0.3s` 让颜色变化、竖线出现、位移都有动画
- hover 时向右位移 4px + 变白
- active 时向右位移 4px + 品牌紫色 + 左侧紫色竖线

### 3. 清理 JS 代码

删除了 `updateIndicator()` 函数及其所有调用。

## 保留的功能

- **IntersectionObserver**：章节检测逻辑保持不变
- **阅读进度条**：`.toc-progress` 和 `.toc-progress-bar` 正常工作
- **RAF 节流**：scroll 监听使用 requestAnimationFrame 节流
- **平滑滚动**：点击目录链接平滑滚动到对应章节

## 关键技术点

1. **CSS transition 优化**：使用 `cubic-bezier(0.4, 0, 0.2, 1)` ease-out 曲线，动画流畅自然
2. **transform 性能**：使用 `transform: translateX()` 而非 `margin-left`，避免重排
3. **border 动画技巧**：默认透明边框确保状态切换时有平滑的颜色过渡

## 验收结果

- [x] 滚动时当前阅读章节的目录项有紫色高亮（文字紫色 + 左侧紫色竖线）
- [x] 切换章节时高亮有平滑过渡动画（颜色、竖线、位移都有 0.3s 过渡）
- [x] 目录项 hover 时向右位移 4px + 变白色
- [x] 目录项 active 时向右位移 4px + 紫色
- [x] 阅读进度条正常显示，随滚动填充
- [x] 目录 sticky 定位不受影响
- [x] ≤960px 时目录隐藏，JS 不报错

## 相关文件

- `src/components/TableOfContents.astro` - 目录组件
