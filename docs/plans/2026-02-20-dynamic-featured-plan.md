# 首页精选组件动态化改造计划

## 任务概述
将 FeaturedPosts.astro 和 FeaturedProjects.astro 从硬编码改为从 content collection 动态读取。

## 现状分析
- LatestUpdates.astro 已经是动态读取 ✅
- Content schema 已定义 `featured: boolean` 字段 ✅
- 需要抽取 `categoryColorMap` 到公共位置

## 改造清单

### 1. 抽取分类颜色映射 (src/utils/constants.ts)
- [ ] 添加 `CATEGORY_COLOR_MAP`
- [ ] 添加 `getBrandColor()` 辅助函数
- [ ] 添加 `formatDateCN()` 中文日期格式化函数

### 2. 改造 FeaturedPosts.astro
- [ ] 使用 `getCollection('blog')` 动态获取
- [ ] 过滤 `featured: true`，按日期倒序
- [ ] 第一篇为大卡片，后两篇为小卡片
- [ ] 动态分类标签颜色
- [ ] 动态标题 hover 颜色（CSS 变量实现）
- [ ] 卡片可点击跳转 `/blog/${slug}`
- [ ] 空状态：不渲染整个板块

### 3. 改造 FeaturedProjects.astro
- [ ] 使用 `getCollection('projects')` 动态获取
- [ ] 过滤 `featured: true`，按日期倒序
- [ ] 动态读取 GitHub/Demo 链接（不再是 `#`）
- [ ] 卡片可点击跳转 `/projects/${slug}`
- [ ] 外链按钮阻止事件冒泡
- [ ] 空状态：不渲染整个板块

### 4. LatestUpdates.astro（检查确认）
- [ ] 确认已是动态读取
- [ ] 复用 constants.ts 中的颜色映射

## 数据映射

### 博客字段映射
| 模板变量 | Content 字段 |
|---------|-------------|
| title | post.data.title |
| description | post.data.description |
| date | formatDateCN(post.data.date) |
| image | post.data.image |
| tag | post.data.categories[0] |
| link | /blog/${post.slug} |
| hoverColor | CATEGORY_COLOR_MAP[category] |

### 项目字段映射
| 模板变量 | Content 字段 |
|---------|-------------|
| title | project.data.title |
| description | project.data.description |
| image | project.data.image |
| tags | project.data.tech |
| github | project.data.github |
| demo | project.data.demo |
| link | /projects/${project.slug} |

## 注意事项
- 保持现有 HTML 结构和样式不变
- 标题 hover 颜色使用 CSS 变量 `--hover-color` 实现动态化
- 卡片整体可点击，外链按钮阻止冒泡
