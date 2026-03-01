# 解决方案：修复项目详情页硬编码链接问题

## 问题场景

项目详情页只有特定项目显示"查看源码"按钮，因为代码中使用了硬编码条件：

```astro
{project.slug === 'fomo-killer' && (
  <a href="https://github.com/RollingTheRock/ai-daily-digest">查看源码</a>
)}
```

## 解决方案

将硬编码替换为动态数据：

```astro
{project.github && (
  <a href={project.github} target="_blank" rel="noopener noreferrer">
    查看源码
  </a>
)}
```

## 关键修改

### 文件: `src/pages/projects/[...slug].astro`

**修改前**:
```astro
<div class="flex justify-center gap-4">
  {project.slug === 'fomo-killer' && (
    <a href="https://github.com/RollingTheRock/ai-daily-digest" ...>
      查看源码
    </a>
  )}
</div>
```

**修改后**:
```astro
<div class="flex justify-center gap-4">
  {project.github && (
    <a href={project.github} ... class="project-btn">
      <GitHubIcon /> 查看源码
    </a>
  )}
  {project.demo && (
    <a href={project.demo} ... class="project-btn project-btn-demo">
      <ExternalIcon /> 在线演示
    </a>
  )}
</div>
```

### 样式区分

```css
/* GitHub 按钮 - 青色 */
.project-btn:hover {
  border-color: #06B6D4;
  color: #06B6D4;
}

/* Demo 按钮 - 紫色 */
.project-btn-demo:hover {
  border-color: #A855F7;
  color: #A855F7;
}
```

## 教训

1. **避免硬编码**: 不要在模板中硬编码特定项目的逻辑
2. **使用动态数据**: 从 CMS 获取数据，通过条件渲染控制显示
3. **统一处理**: 所有项目应该使用相同的模板逻辑

## 相关方案

- [Notion CMS 项目卡片显示 GitHub/Demo 链接](./notion-github-demo-links.md)
