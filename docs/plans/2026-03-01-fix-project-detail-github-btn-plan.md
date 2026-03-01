# 修复计划：项目详情页显示"查看源码"按钮

## 问题分析

**现状**: 只有 FOMO Killer 项目显示"查看源码"按钮，其他3个项目没有。

**根本原因**: 项目详情页 (`src/pages/projects/[...slug].astro`) 使用了硬编码条件：

```astro
{project.slug === 'fomo-killer' && (
  <a href="https://github.com/RollingTheRock/ai-daily-digest" ...>
    查看源码
  </a>
)}
```

而不是使用 `project.github` 动态数据。

## 修复方案

### 修改 1: 替换硬编码为动态数据

**文件**: `src/pages/projects/[...slug].astro` 第76-90行

**修改前**:
```astro
<!-- Links -->
<div class="flex justify-center gap-4">
  {project.slug === 'fomo-killer' && (
    <a
      href="https://github.com/RollingTheRock/ai-daily-digest"
      target="_blank"
      rel="noopener noreferrer"
      class="project-btn"
    >
      <svg...></svg>
      查看源码
    </a>
  )}
</div>
```

**修改后**:
```astro
<!-- Links -->
<div class="flex justify-center gap-4">
  {project.github && (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      class="project-btn"
    >
      <svg...></svg>
      查看源码
    </a>
  )}
  {project.demo && (
    <a
      href={project.demo}
      target="_blank"
      rel="noopener noreferrer"
      class="project-btn"
    >
      <svg...></svg>
      在线演示
    </a>
  )}
</div>
```

### 修改 2: 为 Demo 按钮添加样式

在 `<style>` 中添加 Demo 按钮的 hover 效果：

```css
.project-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}
.project-btn:hover {
  border-color: #06B6D4;
  color: #06B6D4;
  background: rgba(6, 182, 212, 0.1);
}

/* Demo 按钮用紫色 */
.project-btn[data-type="demo"]:hover,
.project-btn[href*="demo"]:hover,
.project-btn:nth-child(2):hover {
  border-color: #A855F7;
  color: #A855F7;
  background: rgba(168, 85, 247, 0.1);
}
```

或者简化处理，让 GitHub 和 Demo 使用相同的 hover 色。

## 验证清单

修复后确认4个项目都能正确显示按钮：

- [ ] FOMO Killer → https://github.com/RollingTheRock/ai-daily-digest
- [ ] 个人博客系统 → https://github.com/RollingTheRock/personal-site
- [ ] 联盟链供应链金融系统 → https://github.com/wukuidou/commercial-paper
- [ ] 科研数据联邦流通平台 → https://github.com/RollingTheRock/data-task-platform

## 文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/pages/projects/[...slug].astro` | 修改 | 替换硬编码为动态数据 |

## 测试计划

1. 运行 `npm run build`
2. 检查构建输出中4个项目的 HTML 是否包含 GitHub 链接
3. 验证按钮点击跳转正常
