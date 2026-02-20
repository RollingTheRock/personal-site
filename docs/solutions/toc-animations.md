# 目录动态交互效果

## 背景

为博客详情页右侧目录（TOC）增加三个动态交互效果，提升阅读跟随的灵动感。

## 实现效果

### 1. 滑动指示条

用一个绝对定位的指示条元素，当 active 章节变化时平滑滑动到新位置。

**HTML 结构：**
```astro
<nav class="toc-nav">
  <div class="toc-indicator"></div>  <!-- 滑动指示条 -->
  <a class="toc-link" href="#section-1">...</a>
  <a class="toc-link" href="#section-2">...</a>
</nav>
```

**CSS：**
```css
.toc-indicator {
  position: absolute;
  left: 0;
  width: 2px;
  background: #A855F7;
  border-radius: 1px;
  transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.4);
  pointer-events: none;
}
```

**JS 位置更新：**
```javascript
function updateIndicator() {
  const activeLink = document.querySelector('.toc-link.active');
  const indicator = document.querySelector('.toc-indicator');
  const nav = document.querySelector('.toc-nav');

  const navRect = nav.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();

  indicator.style.top = (linkRect.top - navRect.top) + 'px';
  indicator.style.height = linkRect.height + 'px';
}
```

### 2. 阅读进度条

目录底部细长进度条，随页面滚动实时填充。

**HTML：**
```astro
<div class="toc-progress">
  <div class="toc-progress-bar"></div>
</div>
```

**CSS：**
```css
.toc-progress {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 1.5rem;
  border-radius: 1px;
  overflow: hidden;
}

.toc-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #A855F7, #7C3AED);
  width: 0%;
  transition: width 0.15s ease-out;
}
```

**JS 进度计算：**
```javascript
function updateProgress() {
  const article = document.querySelector('.article-main');
  const progressBar = document.querySelector('.toc-progress-bar');

  const articleTop = articleRect.top + window.scrollY;
  const articleHeight = article.offsetHeight;
  const viewportHeight = window.innerHeight;

  // 从文章顶部进入视口到文章底部离开视口
  const scrolled = window.scrollY - articleTop + viewportHeight;
  const total = articleHeight + viewportHeight;
  const progress = Math.min(Math.max((scrolled / total) * 100, 0), 100);

  progressBar.style.width = progress + '%';
}
```

### 3. 目录项微位移

hover/active 时向右轻微位移，增加灵动感。

```css
.toc-link {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}

.toc-link:hover,
.toc-link.active {
  transform: translateX(4px);
}
```

## 性能优化

### RAF 节流

```javascript
let ticking = false;
function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
```

### 资源清理

```javascript
document.addEventListener('astro:before-swap', () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (progressRafId) {
    cancelAnimationFrame(progressRafId);
    progressRafId = null;
  }
  window.removeEventListener('scroll', handleScroll);
});
```

## 响应式处理

只在桌面端启用效果（TOC 可见时）：

```javascript
const tocContainer = document.querySelector('[data-toc-container]');
if (!tocContainer || tocContainer.classList.contains('hidden')) return;
```

## 关键技术点

1. **getBoundingClientRect()** - 获取元素相对于视口的位置
2. **cubic-bezier(0.4, 0, 0.2, 1)** - ease-out 缓动曲线，动画流畅自然
3. **requestAnimationFrame** - 节流 scroll 事件，避免卡顿
4. **passive: true** - 提升滚动性能
5. **pointer-events: none** - 指示条不阻挡点击

## 相关文件

- `src/components/TableOfContents.astro` - 目录组件
