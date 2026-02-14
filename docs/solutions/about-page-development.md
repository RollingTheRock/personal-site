---
title: 关于页面开发
date: 2026-02-14
category: astro
tags: [astro, about-page, portfolio]
---

# 关于页面开发

## 问题背景

关于页面需要展示博主信息、技能栈和经历，与整体网站风格保持一致。

## 解决方案

### 1. 配置驱动设计

将个人信息提取到 `constants.ts`，便于维护：

```typescript
export const AUTHOR = {
  name: 'RollingTheRock',
  email: '2891887360@qq.com',
  avatar: '/images/avatar.jpg',
  bio: '探索技术、分享思考、记录成长',
};

export const SKILLS = {
  languages: ['Python', 'JavaScript', 'TypeScript'],
  frontend: ['React', 'Astro', 'Tailwind CSS'],
  // ...
};

export const TIMELINE = [
  { year: '2024', title: '...', description: '...' },
];
```

### 2. 时间线布局

使用交替布局（Alternating Timeline）：

```astro
{TIMELINE.map((item, index) => (
  <div class={`md:w-1/2 ${
    index % 2 === 0
      ? 'md:pr-12 md:text-right'
      : 'md:ml-auto md:pl-12'
  }`}>
    <!-- Content -->
  </div>
))}
```

**效果：** 桌面端左右交替，移动端统一左对齐。

### 3. 技术栈展示

按类别分组展示，使用小标题区分：

```
编程语言    [Python] [JavaScript] [TypeScript]
前端开发    [React] [Astro] [Tailwind CSS]
后端 & 数据库 [Node.js] [FastAPI] [PostgreSQL]
工具 & 平台  [Git] [Docker] [Linux]
AI & 数据   [DeepSeek] [NLP] [Data Analysis]
```

### 4. 社交链接设计

使用胶囊按钮样式，统一图标风格：

```astro
<a class="px-4 py-2 border rounded-full text-sm
          hover:bg-[var(--bg-secondary)]
          hover:border-[var(--text-primary)]">
  <svg><!-- Icon --></svg>
  GitHub
</a>
```

## 关键经验

1. **配置化** - 个人信息集中管理，修改方便
2. **响应式时间线** - 交替布局在移动端优雅降级
3. **分类展示** - 技能按类别分组，信息层次清晰
4. **CTA 设计** - 明显的邮件和 RSS 入口

## 文件结构

```
src/
├── pages/
│   └── about.astro          # 关于页面
└── utils/
    └── constants.ts         # AUTHOR, SKILLS, TIMELINE 配置
```
