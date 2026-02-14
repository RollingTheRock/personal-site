# ADR-004: Styling Approach

## Decision

使用 **Tailwind CSS** 作为主要样式方案，配合 **CSS Variables** 实现主题系统。

## Rationale

### Tailwind CSS 配置

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',  // 通过 class 控制深色模式
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A1A',
          dark: '#EEEEEE',
        },
        secondary: {
          DEFAULT: '#555555',
          dark: '#A0A0A0',
        },
        muted: {
          DEFAULT: '#888888',
          dark: '#666666',
        },
        bg: {
          primary: '#FFFFFF',
          secondary: '#FAFAFA',
          tertiary: '#F5F5F5',
          dark: {
            primary: '#0A0A0A',
            secondary: '#111111',
            tertiary: '#1A1A1A',
          }
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'PingFang SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      maxWidth: {
        'article': '680px',
        'medium': '900px',
        'wide': '1100px',
      }
    }
  }
}
```

### CSS Variables 主题系统

```css
/* src/styles/global.css */
:root {
  /* 颜色 */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --bg-tertiary: #F5F5F5;
  --text-primary: #1A1A1A;
  --text-secondary: #555555;
  --text-muted: #888888;
  --border: #E5E5E5;

  /* 字体 */
  --font-serif: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-sans: 'Inter', -apple-system, 'PingFang SC', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

[data-theme="dark"] {
  --bg-primary: #0A0A0A;
  --bg-secondary: #111111;
  --bg-tertiary: #1A1A1A;
  --text-primary: #EEEEEE;
  --text-secondary: #A0A0A0;
  --text-muted: #666666;
  --border: #2A2A2A;
}
```

### 响应式断点

| 断点 | 宽度 | 用途 |
|------|------|------|
| `sm` | 640px | 小屏手机 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 小桌面 |
| `xl` | 1280px | 标准桌面 |
| `2xl` | 1536px | 大桌面 |

### 设计令牌

| 属性 | 值 | 用途 |
|------|-----|------|
| 文章宽度 | 680px | 博客正文最佳阅读宽度 |
| 列表宽度 | 1100px | 列表页、首页内容宽度 |
| 行高（正文） | 1.75 | 舒适的阅读体验 |
| 行高（标题） | 1.3 | 紧凑的标题 |

## Consequences

**正面影响**：
- 统一的设计系统
- 深色/亮色模式无缝切换
- 快速样式开发

**最佳实践**：
- 复杂自定义样式使用 `<style>` 标签
- 避免 `@apply`，直接使用 utility classes
- 使用 `prose` 类处理 Markdown 内容（@tailwindcss/typography）
