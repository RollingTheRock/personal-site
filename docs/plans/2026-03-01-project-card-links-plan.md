# 功能规划：项目卡片显示 GitHub 和 Demo 链接

## 背景

CMS 数据库新增三个属性：
- **GitHub** (url) — 项目 GitHub 仓库链接
- **Demo** (url) — 项目在线演示链接
- **技术栈** (multi_select) — 项目使用的技术

## 当前实现分析

### 1. Post 接口 (`src/lib/notion-cms.ts`)
当前字段：id, title, slug, description, date, image, categories, tags, featured, type

**缺失**: github, demo, techStack

### 2. ProjectCard 组件
- 已支持 `github` 和 `demo` Props
- 链接按钮样式已实现
- 技术栈显示需要改进为标签样式

### 3. 使用场景
- `FeaturedProjects.astro`: 硬编码了 fomo-killer 的链接
- `projects/index.astro`: 硬编码了链接

## 修改方案

### 修改 1: notion-cms.ts - 数据层

#### 1.1 Post 接口添加字段
```typescript
export interface Post {
  // ... 现有字段
  github?: string;
  demo?: string;
  techStack?: string[];
}
```

#### 1.2 getPropertyValue 添加 url 类型
```typescript
case 'url':
  return property.url || '';
```

#### 1.3 pageToPost 提取新属性
```typescript
return {
  // ... 现有字段
  github: getPropertyValue(properties['GitHub']),
  demo: getPropertyValue(properties['Demo']),
  techStack: getPropertyValue(properties['技术栈']) as string[],
};
```

#### 1.4 getLocalProjects 提取本地字段
```typescript
return entries.map((entry) => ({
  // ... 现有字段
  github: entry.data.github,
  demo: entry.data.demo,
  techStack: entry.data.tech,
}));
```

### 修改 2: ProjectCard.astro - 展示层

#### 2.1 技术栈标签样式
```astro
{techStack && techStack.length > 0 && (
  <div class="tech-stack flex flex-wrap gap-2 mt-4">
    {techStack.map((tech) => (
      <span class="tech-tag">{tech}</span>
    ))}
  </div>
)}
```

#### 2.2 CSS 样式
```css
.tech-tag {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #333;
  background: transparent;
  color: #a3a3a3;
  font-family: 'Courier New', monospace;
}
```

### 修改 3: FeaturedProjects.astro - 使用层

替换硬编码为动态数据：
```astro
<div class="project-links">
  {project.github && (
    <a href={project.github} target="_blank" rel="noopener">GitHub →</a>
  )}
  {project.demo && (
    <a href={project.demo} target="_blank" rel="noopener">Demo →</a>
  )}
</div>
<div class="tech-stack">
  {project.techStack?.map(tech => <span class="tech-tag">{tech}</span>)}
</div>
```

### 修改 4: projects/index.astro

传递新属性到 ProjectCard：
```astro
<ProjectCard
  title={project.title}
  description={project.description}
  slug={project.slug}
  image={project.image}
  tech={project.techStack || []}
  github={project.github}
  demo={project.demo}
/>
```

## 文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/lib/notion-cms.ts` | 修改 | Post接口、属性提取、本地项目 |
| `src/components/ProjectCard.astro` | 修改 | 技术栈标签样式 |
| `src/components/FeaturedProjects.astro` | 修改 | 动态链接、技术栈 |
| `src/pages/projects/index.astro` | 修改 | 传递新属性 |

## Notion CMS 配置

需要在 Notion 数据库添加：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| GitHub | URL | 项目仓库链接 |
| Demo | URL | 项目演示链接 |
| 技术栈 | Multi-select | 技术标签 |

## 测试计划

1. **数据层**: 验证 Notion 和本地项目都能正确提取新字段
2. **组件层**: 验证 ProjectCard 正确显示链接和标签
3. **集成层**: 验证首页和项目列表页显示正确
4. **边界**: 验证无链接项目不显示按钮

## 样式设计

技术栈标签与分类/标签区分：
- 透明背景 + 细边框
- 等宽字体 (monospace)
- 小号字体 (12px)
- 圆角较小 (4px)
