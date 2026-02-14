# ADR-002: Architecture Pattern

## Decision

采用 **静态站点生成 (SSG)** 为主，**内容驱动架构**，配合 **Islands Architecture** 实现交互。

## Rationale

### 1. 静态站点生成 (SSG)

```
构建时 (Build Time)          运行时 (Runtime)
     ↓                              ↓
 Markdown/MDX 文件     →     静态 HTML/CSS/JS
     ↓                              ↓
 Content Collections           CDN 分发
```

**原因**：
- 个人网站内容相对静态，更新频率低
- SSG 提供最快的访问速度（预渲染 HTML）
- 零服务器成本，CDN 部署即可
- SEO 友好，搜索引擎可直接抓取

### 2. 内容驱动架构

使用 Astro Content Collections 组织内容：

```
src/content/
├── blog/              # 博客文章（Markdown/MDX）
├── projects/          # 项目数据（YAML frontmatter）
└── videos/            # 视频数据（YAML frontmatter）
```

**优势**：
- 内容与展示分离
- 类型安全的内容 schema（Zod 验证）
- 自动生成类型定义

### 3. Islands Architecture

```
页面 (Static HTML)
    ├── Header (静态)
    ├── Hero (静态)
    ├── BlogCard (静态)
    ├── ThemeToggle (交互 Island - client:load)
    ├── Search (交互 Island - client:visible)
    └── Footer (静态)
```

**优势**：
- 大部分页面无 JavaScript
- 仅在需要时加载交互组件
- 使用 `client:*` 指令控制 hydrate 时机

## Consequences

**正面影响**：
- 极致的性能表现
- 清晰的内容管理
- 可预测的行为

**权衡**：
- 搜索功能需要客户端实现（或第三方服务如 Algolia）
- 评论系统需要客户端加载（Giscus）
- 内容更新需要重新构建部署
