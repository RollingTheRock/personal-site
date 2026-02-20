# Markdown → Notion 迁移指南

**日期**: 2026-02-21
**用途**: 将本地 Markdown 文章批量导入 Notion 数据库

---

## 前置条件

1. **Notion Integration** 已创建并获取 Token
2. **Notion 数据库** 已按 CMS 结构创建
3. **环境变量** 已配置在 `.env` 文件中：

```bash
NOTION_TOKEN=ntn_xxxxx
NOTION_DATABASE_ID=b77f3ac61a7944c585287503df4a285d
```

## 数据库结构要求

确保数据库有以下属性：

| 属性名 | 类型 | 必需 |
|--------|------|------|
| 标题 | title | ✅ |
| Slug | rich_text | ✅ |
| 摘要 | rich_text | ✅ |
| 发布日期 | date | ✅ |
| 类型 | select | ✅ |
| 状态 | status | ✅ |
| 分类 | multi_select | ❌ |
| 标签 | multi_select | ❌ |
| 封面图 | files | ❌ |
| 置顶 | checkbox | ❌ |

状态选项必须包含：**✅ 已发布**

类型选项必须包含：**博客**、**项目**

---

## 运行迁移

```bash
npm run migrate
```

或直接使用 tsx：

```bash
npx tsx scripts/migrate-to-notion.ts
```

---

## 支持的 Markdown 格式

### Frontmatter 映射

博客文件 (`src/content/blog/*.md`):
```yaml
---
title: "文章标题"           → 标题
description: "摘要"        → 摘要
date: 2026-01-18           → 发布日期
categories: ["技术"]        → 分类
tags: ["AI", "思考"]        → 标签
featured: true             → 置顶
image: "/path/to.jpg"      → 封面图
---
```

项目文件 (`src/content/projects/*.md`):
```yaml
---
title: "项目名称"
description: "项目描述"
date: 2026-02-20
tech: ["Python", "AI"]      → 分类 + 标签
featured: true
image: "/path/to.jpg"
---
```

### 正文转换

| Markdown | Notion Block |
|----------|--------------|
| `# 标题` | heading_1 |
| `## 标题` | heading_2 |
| `### 标题` | heading_3 |
| `- 列表项` | bulleted_list_item |
| `1. 列表项` | numbered_list_item |
| `\`\`\`js` | code (带语言) |
| `> 引用` | quote |
| `---` | divider |
| `![alt](url)` | image |
| `**粗体**` | 富文本粗体 |
| `*斜体*` | 富文本斜体 |
| `\`代码\`` | 富文本代码 |
| `[链接](url)` | 富文本链接 |

---

## 迁移流程

```
1. 读取所有 blog/*.md 文件
   └── 每篇创建 Notion 页面 + 内容 blocks

2. 读取所有 projects/*.md 文件
   └── 每个创建 Notion 页面 + 内容 blocks

3. 输出迁移报告
```

---

## 速率限制

Notion API 限制 **3 req/s**，脚本已内置保护：

- 每批 blocks 间延迟 **350ms**
- 每篇文章间延迟 **350ms**

5 篇文章预计耗时：**~10 秒**

---

## 故障排除

### 错误：path.block_id should be a valid uuid

**原因**: 数据库 ID 格式不正确
**解决**: 确保使用数据库 ID（32位字符串），不是页面 URL

### 错误：数据库缺少属性

**原因**: Notion 数据库结构与预期不符
**解决**: 检查属性名称和类型是否匹配上述要求

### 错误：Could not find database

**原因**: Integration 没有数据库访问权限
**解决**:
1. 在 Notion 数据库页面点击 "..."
2. 选择 "Add connections"
3. 添加你的 Integration

---

## 迁移后验证

1. 在 Notion 中查看数据库，确认文章已导入
2. 重新构建网站：`npm run build`
3. 检查网站是否正确显示 Notion 内容
4. 确认无误后，可删除本地 Markdown 文件

---

## 注意事项

- ⚠️ **重复运行会创建重复页面** - 如需重新迁移，先手动删除旧页面
- 📝 图片使用外部 URL，不会上传到 Notion
- 🔒 确保 `.env` 文件在 `.gitignore` 中，不要提交到 Git
