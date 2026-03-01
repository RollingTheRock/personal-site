# 解决方案：修复相关项目卡片图片不显示

## 问题场景

项目详情页底部的"相关项目"推荐区域，卡片封面图显示为灰色占位，没有加载出图片。

## 根本原因

传递数据时只映射了部分字段：

```astro
allProjects={allProjects.map(p => ({ ...p, data: { title: p.title, tech: p.tags } }))}
```

**缺少 `image` 字段**，导致 ProjectCard 无法显示封面图。

## 解决方案

补充完整的 data 对象字段：

```astro
allProjects={allProjects.map(p => ({
  ...p,
  data: {
    title: p.title,
    description: p.description,
    tech: p.techStack || p.tags,
    image: p.image,        // ← 关键：添加 image
    github: p.github,
    demo: p.demo
  }
}))}
```

## 教训

1. **数据映射要完整**：确保映射后的对象包含组件需要的所有字段
2. **类型检查**：TypeScript 的 `CollectionEntry` 类型应该能帮助发现缺失字段
3. **组件契约**：组件 Props 需要什么，父组件就必须提供什么

## 参考实现

- **文件**: `src/pages/projects/[...slug].astro`
- **行数**: 第149行
