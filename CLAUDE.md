# Personal Site - Claude Collaboration Config

## Project Context

### Technology Stack
- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript 5.x
- **Deployment**: Vercel (Static)
- **Comments**: Giscus
- **Newsletter**: Buttondown

### Architecture Pattern
- **Static Site Generation (SSG)**: 所有页面在构建时生成
- **Content Collections**: 使用 Astro Content Collections 管理内容
- **Islands Architecture**: 仅在需要时加载 JavaScript
- **Dark/Light Theme**: 使用 CSS Variables + Tailwind dark mode

### Design System
- **Primary Font**: Inter (sans-serif)
- **Heading Font**: Playfair Display (serif)
- **Chinese Font**: Noto Serif SC
- **Code Font**: JetBrains Mono
- **Primary Color**: #1A1A1A (dark mode: #EEEEEE)
- **Background**: #FFFFFF (dark mode: #0A0A0A)

### Directory Structure
```
src/
├── components/          # Reusable components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Sidebar.astro
│   ├── ThemeToggle.astro
│   ├── BlogCard.astro
│   ├── ProjectCard.astro
│   ├── VideoCard.astro
│   ├── Subscribe.astro
│   └── Comments.astro
├── layouts/             # Page layouts
│   ├── BaseLayout.astro
│   ├── HomeLayout.astro
│   ├── BlogLayout.astro
│   └── PageLayout.astro
├── pages/               # Routes
│   ├── index.astro
│   ├── about.astro
│   ├── 404.astro
│   ├── blog/
│   │   ├── index.astro
│   │   ├── [...slug].astro
│   │   ├── categories/
│   │   └── tags/
│   ├── projects/
│   └── videos/
├── styles/
│   └── global.css
└── content/             # Content Collections
    ├── blog/
    ├── projects/
    └── videos/
```

### Content Schema

**Blog Post** (`src/content/blog/*.md`):
```yaml
---
title: "文章标题"
description: "文章摘要"
date: 2026-02-14
categories: ["技术"]
tags: ["区块链", "零知识证明"]
image: "/images/blog/cover.jpg"
featured: false
draft: false
---
```

**Project** (`src/content/projects/*.md`):
```yaml
---
title: "项目名称"
description: "一句话描述"
image: "/images/projects/cover.jpg"
github: "https://github.com/..."
demo: "https://..."
tech: ["Rust", "TypeScript"]
featured: true
date: 2026-01-01
---
```

**Video** (`src/content/videos/*.md`):
```yaml
---
title: "视频标题"
description: "视频描述"
date: 2026-02-14
platform: "bilibili"  # bilibili | youtube
video_id: "BV1234567"
thumbnail: "/images/videos/thumb.jpg"
---
```

### Key Conventions

1. **Component Naming**: PascalCase (e.g., `BlogCard.astro`)
2. **File Naming**: kebab-case for pages (e.g., `[...slug].astro`)
3. **CSS Classes**: Tailwind utilities, custom classes in `global.css`
4. **Imports**: Use `@/` alias for `src/` directory
5. **Types**: Use TypeScript strict mode

### Client-Side Directives

Use sparingly for islands:
- `client:load` - 页面加载时立即 hydrate（用于 ThemeToggle）
- `client:visible` - 进入视口时 hydrate（用于 Comments）
- `client:idle` - 浏览器空闲时 hydrate

### Theme Implementation

```astro
<!-- ThemeToggle.astro -->
<script>
  const theme = localStorage.getItem('theme') || 'system';
  // System preference detection
  // Theme toggle logic
</script>
```

CSS Variables approach:
- `data-theme="dark"` on `<html>` element
- Tailwind `darkMode: 'class'` config

### Development Workflow

1. **Local Development**:
   ```bash
   npm run dev      # Start dev server at localhost:4321
   ```

2. **Build**:
   ```bash
   npm run build    # Build for production
   ```

3. **Preview**:
   ```bash
   npm run preview  # Preview production build
   ```

### Deployment

- **Platform**: Vercel
- **Trigger**: Push to main branch
- **Preview**: Automatic preview deployments for PRs

### Performance Guidelines

1. Use Astro's built-in image optimization
2. Lazy load images below the fold
3. Minimize client-side JavaScript
4. Use `font-display: swap` for fonts
5. Preload critical resources

## Inherited Rules

Follow global `~/.claude/CLAUDE.md` rules.
This file overrides where conflicts exist.
