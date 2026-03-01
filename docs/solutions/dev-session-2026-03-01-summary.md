# 开发会话总结：Personal Site UI/UX 改进与 Bug 修复

---
session_date: "2026-03-01"
project: "personal-site"
tech_stack:
  - Astro
  - Tailwind CSS
  - TypeScript
  - Notion CMS
workflow: "/fullflow (PLAN → WORK → REVIEW → COMPOUND)"
---

## 概述

本次开发会话完成了一系列 UI/UX 改进和 Bug 修复，涵盖首页布局优化、Notion CMS 数据集成、项目展示功能完善等方面。

---

## 完成的任务清单

### 1. 最新动态板块固定数量
- **问题**: 板块随内容增加无限变长，破坏页面布局
- **解决**: 使用 `.slice(0, N)` 限制显示数量
- **文件**: `src/components/LatestUpdates.astro`

### 2. 三栏底部对齐
- **问题**: 左侧博客、中间大图、右侧项目三栏底部不对齐
- **解决**: Grid `align-items: stretch` + Flexbox `justify-content: space-between`
- **文件**: `src/components/LatestUpdates.astro`

### 3. 项目卡片显示 GitHub/Demo 链接
- **功能**: 从 Notion CMS 提取 GitHub、Demo、技术栈字段
- **解决**: 扩展 Post 接口，添加 url 类型支持，改进技术栈标签样式
- **文件**: `notion-cms.ts`, `ProjectCard.astro`, `FeaturedProjects.astro`

### 4. 修复项目详情页查看源码按钮
- **问题**: 只有 FOMO Killer 显示按钮（硬编码）
- **解决**: 替换为动态 `project.github` 数据
- **文件**: `src/pages/projects/[...slug].astro`

### 5. 修复相关项目卡片封面图
- **问题**: 相关项目卡片图片不显示
- **解决**: 补充 data 对象中的 `image` 字段
- **文件**: `src/pages/projects/[...slug].astro`

---

## 核心技术方案

### 方案 1: 列表数量限制模式

```astro
// 过滤 → 排序 → 限制数量
const blogItems = allPosts
  .filter(p => p.type === '博客')
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 4);  // 限制 4 篇
```

**适用场景**: 首页精选内容、相关文章推荐、分页前的预览列表

---

### 方案 2: CSS 三栏底部对齐

```css
/* Grid 控制宏观布局 */
.three-col-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: stretch;  /* 关键：拉伸等高 */
}

/* Flexbox 控制微观分布 */
.col-items {
  display: flex;
  flex-direction: column;
  justify-content: space-between;  /* 关键：内容均匀分布 */
  height: 100%;
}
```

**适用场景**: 首页多栏布局、需要底部对齐的卡片布局

---

### 方案 3: Notion CMS 字段扩展

```typescript
// 1. 扩展接口
interface Post {
  // ... 现有字段
  github?: string;
  demo?: string;
  techStack?: string[];
}

// 2. 添加属性类型支持
case 'url':
  return property.url || '';

// 3. 提取字段
github: getPropertyValue(properties['GitHub']) || undefined,
demo: getPropertyValue(properties['Demo']) || undefined,
techStack: getPropertyValue(properties['技术栈']) as string[] | undefined,
```

**适用场景**: CMS 字段扩展、多数据源统一接口

---

### 方案 4: 避免硬编码（数据驱动）

```astro
<!-- 错误：硬编码特定项目 -->
{project.slug === 'fomo-killer' && <GitHubLink />}

<!-- 正确：数据驱动 -->
{project.github && <GitHubLink href={project.github} />}
```

**教训**: 所有项目应使用统一的模板逻辑，数据由 CMS 管理

---

### 方案 5: 完整数据映射

```astro
<!-- 错误：缺少字段 -->
allProjects.map(p => ({ ...p, data: { title: p.title } }))

<!-- 正确：完整映射 -->
allProjects.map(p => ({
  ...p,
  data: {
    title: p.title,
    description: p.description,
    tech: p.techStack || p.tags,
    image: p.image,        // 别忘了这个！
    github: p.github,
    demo: p.demo
  }
}))
```

**教训**: 确保映射后的对象包含组件需要的所有字段

---

## 关键决策与权衡

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 数据切片位置 | 组件层 `.slice()` | 保持数据层通用，组件控制更灵活 |
| 三栏对齐策略 | Grid stretch + Flexbox | 比固定高度更适应不同屏幕 |
| 左右栏数量 | 4博客 + 2项目 | 高度平衡：4小 ≈ 1大图 ≈ 2项目 |
| 字段命名 | Notion中文 + 代码英文 | 便于内容管理 + 符合编码规范 |
| 新字段类型 | 全部可选 (`?`) | 保证向后兼容 |
| 事件冲突处理 | `stopPropagation()` | 简单直接，无需额外 JS |

---

## 预防策略与最佳实践

### 1. 避免硬编码检查清单
- [ ] 代码中是否存在特定项目名/ID？
- [ ] 是否可以使用数据属性替代条件判断？
- [ ] 新功能是否对所有项目生效？

### 2. 数据完整性检查清单
- [ ] 组件 Props 类型定义是否完整？
- [ ] 父组件传递的数据是否包含所有必需字段？
- [ ] 是否使用了 TypeScript `strict` 模式？
- [ ] 可选字段是否有默认值处理？

### 3. 防御性编程模式
```typescript
// 空值保护
(tech || []).slice(0, 5)

// 可选链
project.techStack?.map(...)

// 条件渲染
{project.github && <GitHubLink />}

// 默认值
const tech = project.techStack || project.tags || []
```

### 4. 布局最佳实践
```css
/* 宏观 Grid + 微观 Flexbox */
.container {
  display: grid;
  align-items: stretch;
}

.card {
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1;
}
```

---

## 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 列表限制 | `astro-fixed-list-limit.md` | 限制显示数量方案 |
| 三栏对齐 | `css-three-column-bottom-align.md` | Grid + Flexbox 布局 |
| Notion 集成 | `notion-github-demo-links.md` | CMS 字段扩展 |
| 硬编码修复 | `fix-hardcoded-project-links.md` | 数据驱动渲染 |
| 数据映射 | `fix-related-projects-image.md` | 完整数据传递 |

---

## 教训总结

1. **避免硬编码**: 不要在模板中写死特定项目的逻辑，使用数据驱动
2. **数据映射完整**: 确保传递的数据对象包含组件需要的所有字段
3. **向后兼容**: 新增字段使用可选类型，避免破坏现有数据
4. **事件处理**: 嵌套可点击元素时使用 `stopPropagation` 防止冲突
5. **空值保护**: 使用 `(array || [])` 避免 `undefined` 错误

---

## 开发流程总结

本次会话严格遵循 `/fullflow` 工作流：

```
需求描述 → PLAN (创建 plan.md) → 用户确认
  → WORK (执行修改) → REVIEW (代码审查)
  → COMPOUND (创建 solution.md) → 推送代码
```

每个功能点都有：
- 详细的计划文档 (`docs/plans/YYYY-MM-DD-*.md`)
- 对应的解决方案文档 (`docs/solutions/*.md`)
- 完整的 Git 提交记录

---

*文档生成时间: 2026-03-01*
*会话总提交数: 5*
*修改文件数: 8*
*新增文档数: 10*
