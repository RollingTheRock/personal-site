# V1.0.0 正式发布

## 发布信息

- **版本**: V1.0.0
- **发布日期**: 2026-02-20
- **部署地址**: https://rollingtherock.blog

## 主要更新内容

### 🎨 全新设计系统
- 复古拼贴风格（Retro Collage）设计
- 三品牌色系统：紫色（思考/博客）、青色（技术/项目）、橙色（生活/视频）
- 灰度图片悬停变彩色效果
- Playfair Display + Cormorant Garamond 字体组合

### 📄 页面改造
- **首页**: 全新 Hero 区域、精选博客/项目、最新动态瀑布流
- **博客列表**: 卡片式布局，分类标签颜色区分
- **博客详情**: TOC 目录导航、订阅区域、相关文章推荐
- **项目列表**: 与博客一致的视觉风格
- **项目详情**: 统一布局，外链按钮
- **视频列表/详情**: 橙色主题，自适应布局
- **关于页**: 新 bio、技术栈展示、时间线

### ⚙️ 功能特性
- 动态精选组件（从 content collection 读取）
- RSS 订阅（/rss.xml）
- 搜索功能
- 响应式设计
- 深色模式（默认）

### 🔧 技术实现
- Astro 5.3 + TypeScript
- Tailwind CSS
- Content Collections
- @astrojs/rss
- @astrojs/sitemap

## Git 提交记录

```
d633ed2 Merge branch 'dev/homepage-adjustments' into main
2f1638d feat: complete website redesign and content update
```

## 部署状态

✅ **已部署至 GitHub Pages**
- 域名: rollingtherock.blog
- 状态: 在线
- SSL: 已启用

## 后续维护

- 通过 GitHub Actions 自动部署
- 推送至 main 分支即可触发重新部署
- 部署完成通常需要 1-2 分钟
