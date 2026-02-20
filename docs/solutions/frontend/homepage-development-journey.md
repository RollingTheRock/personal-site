# 个人网站首页开发历程

## 日期
2026-02-17

## 项目背景
基于 Astro + Tailwind CSS 构建个人博客首页，经过多个迭代版本逐步完善视觉效果和用户体验。

## 开发迭代记录

### 版本 1: 基础框架
**核心组件:**
- Logo 组件 - 居中显示，Playfair Display 字体
- HeroSection - 头像 + 简介文字
- CategoryCards - 三个分类入口卡片
- MobileMenu - 侧边抽屉式导航
- Hamburger 菜单按钮 - 固定定位

**技术要点:**
- 使用 `window.openMobileMenu()` 全局函数控制菜单
- CSS 动画：`animate-fade-in-down`、`animate-scale-in`、`animate-slide-up`

### 版本 2: 视觉增强
**改进内容:**
- 头像添加装饰层（虚线边框、紫色 glow 效果、纹理背景）
- 三层文字结构：主标题 + 紫色副标题 + 描述
- 分类卡片重新设计（emoji + 纯色背景）

**关键技术:**
```css
/* 头像装饰效果 */
border: 2px dashed #A855F7;
box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
```

### 版本 3: 内容扩展
**新增组件:**
- FeaturedPosts - 精选博客区域（一大两小布局）
- FeaturedProjects - 精选项目区域（两列卡片）
- 滚动动画 - IntersectionObserver 实现渐入效果

**布局特点:**
- 精选博客：`grid-cols-[3fr_2fr]` 非对称布局
- 卡片渐变背景 + 斜向装饰线

### 精致度优化
**质感提升:**
1. **全局噪点纹理** - 提升整体质感
2. **卡片边框** - `rgba(255,255,255,0.06)` 微妙边框
3. **渐变背景** - `linear-gradient(145deg, #1a1a1a, #141414)`
4. **标签样式** - backdrop-filter blur 毛玻璃效果

**间距系统:**
- Logo → 头像：64px
- 头像 → 文字：32px
- 文字 → 卡片：64px
- 各 section 之间：80-96px

### 字体系统修复
**最终方案:**
```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Noto+Serif+SC:wght@600;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**CSS 变量:**
```css
--font-display: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
```

**应用规则:**
- 标题/Logo/展示文字 → `--font-display`
- 正文/描述/UI 文字 → `--font-body`

### 容器宽度系统
**三层容器:**
| 容器 | max-width | 用途 |
|------|-----------|------|
| container-narrow | 680px | Hero、订阅（聚焦） |
| container-medium | 960px | 分类卡片（适中） |
| container-wide | 1200px | Header、精选、Footer |

**设计原则:**
- section 全宽，背景色延伸到边缘
- container 限制内容宽度
- 不同区域不同宽度，创造层次感

## 技术栈总结

### 核心技术
- **框架:** Astro 5.x（静态站点生成）
- **样式:** Tailwind CSS + 自定义 CSS
- **字体:** Google Fonts（Playfair Display + Noto Serif SC + Inter）
- **动画:** CSS Keyframes + Intersection Observer

### 关键技巧
1. **全局函数模式**
   ```javascript
   window.openMobileMenu = function() { ... }
   ```

2. **CSS 变量管理**
   ```css
   :root {
     --font-display: ...;
     --bg-primary: ...;
   }
   ```

3. **响应式策略**
   ```css
   @media (max-width: 768px) { ... }
   ```

4. **渐变边框**
   ```css
   border-left: 3px solid;
   border-image: linear-gradient(to bottom, #06B6D4, #A855F7) 1;
   ```

## 文件结构

```
src/
├── components/
│   ├── Logo.astro
│   ├── HeroSection.astro
│   ├── CategoryCards.astro
│   ├── FeaturedPosts.astro
│   ├── FeaturedProjects.astro
│   ├── MobileMenu.astro
│   ├── Subscribe.astro
│   └── Footer.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
└── styles/
    └── global.css
```

## 明日继续建议

### 可能的改进方向
1. **文章详情页** - 统一使用容器系统
2. **暗色模式** - 完善 `data-theme="dark"` 样式
3. **交互动画** - 添加更多微交互（按钮 hover、卡片悬停）
4. **性能优化** - 图片懒加载、字体子集化
5. **SEO** - 完善 meta 标签、结构化数据

### 注意事项
- 保持容器系统的统一使用
- 所有标题使用 `font-display` 变量
- 移动端 padding 统一为 20px
- 卡片统一使用 `card-premium` 类

## 经验总结

1. **先结构后样式** - 先搭建 HTML 结构，再添加样式
2. **组件化思维** - 每个区域独立成组件，便于维护
3. **变量驱动** - 使用 CSS 变量统一管理颜色和字体
4. **渐进增强** - 从基础版本逐步添加视觉效果
5. **文档先行** - 复杂方案先写计划文档，避免返工

---

**今天的开发到此结束。明天继续！**
