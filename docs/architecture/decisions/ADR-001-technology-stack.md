# ADR-001: Technology Stack

## Decision

使用 **Astro 5.x** 作为核心框架，配合 **Tailwind CSS** 构建个人网站。

## Rationale

### 选择 Astro 的原因：

1. **内容驱动网站的首选**：Astro 专为内容网站设计，博客、文档站等场景表现优异
2. **零 JavaScript 默认**：页面默认无 JS，需要交互的组件才加载（Islands Architecture）
3. **卓越的 Core Web Vitals**：内置图片优化、CSS 优化、 prefetch 等性能特性
4. **灵活的渲染模式**：支持 SSG（静态生成）、SSR（服务端渲染）、混合模式
5. **原生支持 Markdown/MDX**：内置 Content Collections，无需额外配置
6. **框架无关的组件**：可混用 React、Vue、Svelte、Solid 组件

### 选择 Tailwind CSS 的原因：

1. **Utility-first 设计**：快速构建界面，无需写大量自定义 CSS
2. **深色模式内置支持**：`dark:` 修饰符实现主题切换简单优雅
3. **设计系统一致性**：通过配置统一颜色、字体、间距
4. **与 Astro 完美集成**：官方 `@astrojs/tailwind` 集成包

### 其他关键技术：

| 技术 | 用途 |
|------|------|
| Vercel | 部署托管，原生支持 Astro |
| Giscus | 基于 GitHub Discussions 的评论系统 |
| Buttondown | 邮件订阅服务 |
| Playfair Display + Inter | Google Fonts 字体 |

## Alternatives Considered

| 方案 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| **Next.js** | React 生态成熟，App Router 强大 | 对内容站过重，JS 依赖较重 | ❌ 否决 |
| **Hugo** | Go 编写，构建极快 | 模板语法复杂，定制性受限 | ❌ 否决 |
| **Gatsby** | React 生态，插件丰富 | 构建慢，过时技术栈 | ❌ 否决 |
| **Hexo** | 中文社区活跃 | 主题定制复杂，扩展性一般 | ❌ 否决 |

## Consequences

**正面影响**：
- 极快的页面加载速度（接近完美的 Lighthouse 分数）
- 简洁的代码结构，易于维护
- 灵活的组件系统，可逐步添加交互
- 优秀的开发者体验（HMR、清晰的错误提示）

**负面影响/权衡**：
- 需要学习 Astro 特有的语法（类似 JSX）
- 复杂交互需要引入其他框架（React/Vue）
- 社区资源相对 Next.js 较少
