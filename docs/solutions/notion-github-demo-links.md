# 解决方案：Notion CMS 项目卡片显示 GitHub/Demo 链接

## 问题场景

需要在项目卡片中显示 GitHub 仓库链接、在线 Demo 链接和技术栈标签，这些数据存储在 Notion CMS 中。

## 解决方案架构

### 1. 数据层 (notion-cms.ts)

#### 扩展 Post 接口
```typescript
export interface Post {
  // ... 现有字段
  github?: string;
  demo?: string;
  techStack?: string[];
}
```

#### 添加 URL 类型支持
```typescript
function getPropertyValue(property: any): any {
  switch (property.type) {
    // ... 现有 case
    case 'url':
      return property.url || '';
  }
}
```

#### 提取新属性
```typescript
async function pageToPost(page: any): Promise<Post> {
  return {
    // ... 现有字段
    github: getPropertyValue(properties['GitHub']) || undefined,
    demo: getPropertyValue(properties['Demo']) || undefined,
    techStack: getPropertyValue(properties['技术栈']) as string[] | undefined,
  };
}
```

#### 本地项目数据映射
```typescript
async function getLocalProjects(): Promise<Post[]> {
  return entries.map((entry) => ({
    // ... 现有字段
    github: entry.data.github,
    demo: entry.data.demo,
    techStack: entry.data.tech,
  }));
}
```

### 2. 展示层 (ProjectCard.astro)

#### 技术栈标签样式
```astro
<div class="flex flex-wrap gap-2 mt-auto">
  {(tech || []).slice(0, 5).map((t) => (
    <span class="tech-tag">{t}</span>
  ))}
</div>
```

```css
.tech-tag {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #333;
  background: transparent;
  color: #a3a3a3;
  font-family: monospace;
}
```

#### GitHub/Demo 链接按钮
```astro
{(github || demo) && (
  <div class="px-5 pb-5 flex gap-3">
    {github && (
      <a href={github} target="_blank" rel="noopener noreferrer"
         onclick="event.stopPropagation()">
        <GitHubIcon /> GitHub
      </a>
    )}
    {demo && (
      <a href={demo} target="_blank" rel="noopener noreferrer"
         onclick="event.stopPropagation()">
        <ExternalIcon /> Demo
      </a>
    )}
  </div>
)}
```

### 3. 使用层

#### 项目列表页
```astro
<ProjectCard
  title={project.title}
  description={project.description}
  slug={project.slug}
  image={project.image}
  tech={project.techStack || project.tags}
  github={project.github}
  demo={project.demo}
/>
```

#### 精选项目
```astro
<div class="project-links flex gap-4">
  {project.github && (
    <a href={project.github} target="_blank"
       class="text-[#06B6D4] hover:underline"
       onclick="event.stopPropagation()">
      GitHub →
    </a>
  )}
  {project.demo && (
    <a href={project.demo} target="_blank"
       class="text-[#A855F7] hover:underline"
       onclick="event.stopPropagation()">
      Demo →
    </a>
  )}
</div>
```

## Notion CMS 配置

在 Notion 数据库中添加以下属性：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| GitHub | URL | 项目仓库链接 |
| Demo | URL | 项目演示链接 |
| 技术栈 | Multi-select | 技术标签列表 |

## 关键点

### 1. 向后兼容
- 所有新字段定义为可选 (`?:`)
- 使用 `|| undefined` 将空字符串转换为可选值
- 空值时不显示对应元素

### 2. 事件处理
使用 `event.stopPropagation()` 防止点击链接时触发卡片导航：
```astro
<a onclick="event.stopPropagation()" ...>
```

### 3. 空值保护
```astro
{(tech || []).slice(0, 5).map(...)}  // 避免 undefined.slice() 错误
```

### 4. 技术栈样式区分
- **分类标签**: 品牌色背景
- **普通标签**: 默认样式
- **技术栈标签**: 透明背景 + 细边框 + 等宽字体

## 参考实现

- **数据层**: `src/lib/notion-cms.ts`
- **卡片组件**: `src/components/ProjectCard.astro`
- **精选项目**: `src/components/FeaturedProjects.astro`
- **项目列表**: `src/pages/projects/index.astro`
- **计划文档**: `docs/plans/2026-03-01-project-card-links-plan.md`

## 相关方案

- [CSS 三栏布局底部对齐](./css-three-column-bottom-align.md)
- [Astro 组件中限制列表显示数量](./astro-fixed-list-limit.md)
