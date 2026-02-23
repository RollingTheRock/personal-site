# 解决方案：按类型过滤精选内容

## 问题

首页"精选博客"区域显示了所有 `featured=true` 的内容，包括项目类型的文章。项目应该只出现在"精选项目"区域。

## 原因

`FeaturedPosts.astro` 组件获取所有置顶内容后没有按类型过滤，而 `FeaturedProjects.astro` 正确地进行了过滤。

## 解决方案

在组件内部添加类型过滤：

```typescript
const featuredPosts = await getFeaturedPosts();

// 按类型过滤
const blogPosts = featuredPosts.filter(post => post.type === '博客');

// 使用过滤后的数组
const mainPost = blogPosts[0];
const sidePosts = blogPosts.slice(1, 3);
```

## 最佳实践

1. **统一过滤模式**：所有精选组件都应按类型过滤，即使 `getFeaturedPosts()` 返回所有类型
2. **组件职责**：组件负责决定显示什么类型的内容，数据层只负责获取数据
3. **类型安全**：确保 Post 类型包含 `type` 字段，值为 `'博客' | '项目' | '视频'`

## 相关文件

- `src/components/FeaturedPosts.astro` - 精选博客（过滤 type === '博客'）
- `src/components/FeaturedProjects.astro` - 精选项目（过滤 type === '项目'）
- `src/lib/notion-cms.ts` - Post 类型定义和 getFeaturedPosts() 函数

## 参考提交

- 提交: `9c8b0d9`
- 日期: 2026-02-23
