# 修复计划：首页精选博客混入项目类型文章

## 问题描述

首页"精选博客"区域显示了所有 `featured=true` 的内容，包括类型为"项目"的文章。项目不应该出现在精选博客区域。

## 根本原因

`FeaturedPosts.astro` 组件调用了 `getFeaturedPosts()` 函数获取所有置顶内容，但没有按 `type === '博客'` 进行过滤。而 `FeaturedProjects.astro` 组件正确地进行了过滤。

## 当前代码状态

### FeaturedPosts.astro（问题代码）
```astro
const featuredPosts = await getFeaturedPosts();
// 没有按 type 过滤！
const mainPost = featuredPosts[0];
const sidePosts = featuredPosts.slice(1, 3);
```

### FeaturedProjects.astro（正确示例）
```astro
const featuredProjects = await getFeaturedPosts();
const projectPosts = featuredProjects.filter(post => post.type === '项目');  // 正确过滤
```

## 修复方案

### 方案：在 FeaturedPosts.astro 中添加类型过滤

**文件**: `src/components/FeaturedPosts.astro`

**修改内容**:
```astro
// 获取精选博客
const featuredPosts = await getFeaturedPosts();
const blogPosts = featuredPosts.filter(post => post.type === '博客');  // 添加过滤

// 第一篇作为主展示，接下来2篇作为侧边展示
const mainPost = blogPosts[0];
const sidePosts = blogPosts.slice(1, 3);
```

**后续使用 `blogPosts` 替换 `featuredPosts`**:
- 第23行: `{mainPost && (` 改为 `{mainPost && (` - 不需要修改，变量名不变
- 需要检查所有使用 `featuredPosts` 的地方是否已替换为 `blogPosts`

## 影响范围

| 组件 | 当前行为 | 修复后行为 |
|------|----------|-----------|
| FeaturedPosts.astro | 显示所有置顶内容（博客+项目+视频） | 仅显示置顶的博客 |
| FeaturedProjects.astro | 正确显示置顶的项目 | 保持不变 |
| LatestUpdates.astro | 混合显示最新内容 | 保持不变 |

## 测试验证

1. 启动开发服务器
2. 检查首页"精选博客"区域是否只显示博客类型的文章
3. 检查"精选项目"区域是否正常工作
4. 确认没有重复显示同一篇文章

## 任务清单

- [ ] 修改 `src/components/FeaturedPosts.astro`
- [ ] 本地验证修复效果
- [ ] 提交变更
