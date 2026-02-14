---
title: 关于页面开发
type: feat
date: 2026-02-14
---

# 关于页面开发

## Overview

开发个人介绍页面，展示博主信息、技能栈、经历时间线和联系方式。

## Current State

- 关于页面路由已存在 (`/about.astro`)
- 当前为占位内容，需要完善设计
- 需要与整体 Every.to + Notion 极简风格保持一致

## Proposed Solution

### 页面结构

1. **头部区域**
   - 头像 + 姓名
   - 简短的个人介绍
   - 社交链接（GitHub、Twitter、邮箱）

2. **详细介绍**
   - 个人背景故事
   - 专业技能标签云
   - 技术栈图标展示

3. **时间线经历**
   - 工作或项目经历
   - 教育背景（可选）
   - 关键里程碑

4. **联系方式**
   - 邮箱联系按钮
   - 社交媒体链接
   - RSS 订阅提示

### 设计规范

**布局：**
- 居中布局，max-width 限制
- 大量留白，简洁优雅
- 响应式适配移动端

**配色：**
- 使用现有 CSS 变量系统
- 黑白灰主色调
- 技能标签使用次要背景色

**排版：**
- 大标题使用衬线字体
- 正文使用无衬线字体
- 时间线使用连接线和圆点

## Technical Considerations

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/pages/about.astro` | 重写 | 完整的关于页面 |
| `src/components/Timeline.astro` | 新增 | 时间线组件 |
| `src/components/SkillTags.astro` | 新增 | 技能标签组件 |
| `src/components/SocialLinks.astro` | 新增 | 社交链接组件（可复用） |
| `src/utils/constants.ts` | 修改 | 添加个人信息配置 |

### 配置扩展

```typescript
// src/utils/constants.ts
export const AUTHOR = {
  name: 'RollingTheRock',
  avatar: '/images/avatar.jpg',
  bio: '探索技术、分享思考、记录成长',
  email: '2891887360@qq.com',
  location: 'China',
  company: '',
};

export const SKILLS = [
  'Python', 'JavaScript', 'TypeScript',
  'React', 'Astro', 'Tailwind CSS',
  'Git', 'Docker', 'Linux',
  'AI/ML', 'NLP', 'Data Analysis'
];

export const TIMELINE = [
  {
    year: '2024',
    title: '开始运营 AI 日报',
    description: '创建自动化的 AI 论文摘要邮件系统',
    type: 'project'
  },
  // ...
];
```

## Acceptance Criteria

- [ ] 头像 + 姓名 + 简介展示
- [ ] 社交链接可点击跳转
- [ ] 技能标签云展示
- [ ] 时间线经历展示
- [ ] 联系方式区域
- [ ] 响应式布局正常
- [ ] 深色模式样式正确
- [ ] 与整体风格一致

## References

- 现有设计系统: `src/styles/global.css`
- 布局参考: 博客详情页 `src/pages/blog/[...slug].astro`
