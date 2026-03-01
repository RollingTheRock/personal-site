# 修复计划：相关项目卡片封面图不显示

## 问题分析

项目详情页底部的"相关项目"推荐区域，卡片封面图显示为灰色占位，没有加载出图片。

### 根本原因

在 `src/pages/projects/[...slug].astro` 第149行：

```astro
allProjects={allProjects.map(p => ({ ...p, data: { title: p.title, tech: p.tags } }))}
```

映射时**只传递了 `title` 和 `tech`，没有传递 `image`**！

### RelatedProjects 组件期望的数据结构

```typescript
interface Props {
  currentSlug: string;
  tech: string[];
  allProjects: CollectionEntry<'projects'>[];
}
```

使用方式：
```astro
<ProjectCard
  image={project.data.image}  // 需要 project.data.image
/>
```

## 修复方案

### 修改文件: `src/pages/projects/[...slug].astro`

**修改前** (第149行):
```astro
allProjects={allProjects.map(p => ({ ...p, data: { title: p.title, tech: p.tags } }))}
```

**修改后**:
```astro
allProjects={allProjects.map(p => ({
  ...p,
  data: {
    title: p.title,
    description: p.description,
    tech: p.techStack || p.tags,
    image: p.image,
    github: p.github,
    demo: p.demo
  }
}))}
```

## 验证清单

修复后确认相关项目卡片正确显示：
- [ ] 封面图显示正常
- [ ] 标题显示正常
- [ ] 技术栈显示正常
- [ ] GitHub/Demo 链接显示正常（如果有）

## 文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/pages/projects/[...slug].astro` | 修改 | 补充 data 对象中的缺失字段 |

## 测试计划

1. 运行 `npm run build`
2. 检查生成的项目详情页 HTML
3. 确认相关项目区域的 <img> 标签 src 属性不为空
