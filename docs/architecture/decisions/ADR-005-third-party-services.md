# ADR-005: Third-Party Services

## Decision

| 功能 | 服务 | 原因 |
|------|------|------|
| 评论系统 | Giscus | 基于 GitHub Discussions，免费、无广告 |
| 邮件订阅 | Buttondown | 简洁的 Newsletter 服务，免费额度充足 |
| 部署托管 | Vercel | Astro 官方推荐，边缘网络、自动 HTTPS |
| 分析统计 | Vercel Analytics | 隐私友好，轻量级 |

## Rationale

### Giscus 评论系统

**配置**：
```javascript
// Giscus 配置
data-repo="RollingTheRock/personal-site"
data-repo-id="[REPO_ID]"
data-category="Comments"
data-category-id="[CATEGORY_ID]"
data-mapping="pathname"
```

**优势**：
- 无需自建数据库
- GitHub 用户直接登录
- 支持 Markdown
- 邮件通知
- 完全免费

### Buttondown 邮件订阅

**集成方式**：
```html
<form action="https://buttondown.email/api/emails/embed-subscribe/your-newsletter" method="post">
  <input type="email" name="email" placeholder="your@email.com" required />
  <button type="submit">订阅</button>
</form>
```

**优势**：
- 免费版支持最多 1000 订阅者
- 简洁的 API
- 支持 Markdown 编写邮件

### Vercel 部署

**配置**：
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
});
```

**优势**：
- 自动 CI/CD（Git 推送自动部署）
- 预览部署（PR 自动创建预览链接）
- 边缘网络，全球加速
- 内置图片优化

## Consequences

**正面影响**：
- 零后端维护成本
- 成熟稳定的服务
- 隐私友好的选择

**需要注意**：
- Giscus 需要公开 GitHub 仓库
- Buttondown 免费版有品牌标识
- 服务可用性依赖第三方
