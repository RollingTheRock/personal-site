# 网站字体配置方案

## 日期
2026-02-17

## 问题背景
个人网站需要统一使用衬线字体（Playfair Display + Noto Serif SC）作为展示字体，无衬线字体（Inter）作为正文字体。需要确保：
1. 字体正确加载，不依赖 fallback
2. 指定元素正确应用衬线字体
3. 性能优化（preconnect）

## 解决方案

### 1. 字体加载策略

在 `BaseLayout.astro` 的 `<head>` 中使用 `<link>` 标签加载 Google Fonts，而非 CSS @import：

```html
<!-- Preload fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Noto+Serif+SC:wght@600;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**关键点：**
- 使用 `preconnect` 提前建立连接，减少字体加载延迟
- 指定精确的字重，避免加载不必要的字体文件
- Playfair Display: 700, 900（英文标题）
- Noto Serif SC: 600, 700, 900（中文标题）

### 2. CSS 变量定义

在 `global.css` 中定义字体变量：

```css
:root {
  /* 字体 */
  --font-serif: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-sans: 'Inter', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* 字体变量 - 按用途 */
  --font-display: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}
```

**命名约定：**
- `--font-display`: 展示/标题字体（衬线体）
- `--font-body`: 正文字体（无衬线体）

### 3. 应用字体的元素

| 元素 | 字体变量 | 实现方式 |
|------|---------|---------|
| Logo "RollingTheRock" | `--font-display` | style 属性 |
| 主标题 "一名热爱技术的开发者" | `--font-display` | `font-display` 类 |
| "精选博客" 标题 | `--font-display` | `section-title-premium` 类 |
| "精选项目" 标题 | `--font-display` | `section-title-premium` 类 |
| "订阅更新" 标题 | `--font-display` | `font-display` 类 |
| 分类卡片标题 | `--font-display` | `font-display` 类 |
| 正文内容 | `--font-body` | body 默认样式 |

### 4. 工具类

添加 Tailwind 兼容的工具类：

```css
.font-display {
  font-family: var(--font-display);
}

.font-body {
  font-family: var(--font-body);
}
```

## 验证方法

1. **构建项目**: `npm run build`
2. **检查生成的 HTML**: 确认 `<head>` 中包含 Google Fonts 链接
3. **DevTools 检查**:
   - 选中 Logo 元素
   - 查看 Computed > font-family
   - 确认显示为 "Playfair Display" 而非 fallback

## 相关文件

- `src/layouts/BaseLayout.astro` - 字体链接
- `src/styles/global.css` - 字体变量和工具类
- `src/components/Logo.astro` - Logo 字体
- `src/components/HeroSection.astro` - 主标题字体
- `src/components/FeaturedPosts.astro` - 精选博客标题
- `src/components/FeaturedProjects.astro` - 精选项目标题
- `src/components/Subscribe.astro` - 订阅标题
- `src/components/CategoryCards.astro` - 分类卡片标题

## 注意事项

1. **不要使用 @import 加载字体** - 会阻塞渲染，改用 `<link>`
2. **指定精确字重** - 减少字体文件大小
3. **始终提供 fallback 字体** - 防止字体加载失败时页面无法阅读
4. **中文使用 Noto Serif SC** - Playfair Display 不支持中文
