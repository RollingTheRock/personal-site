# 更新关于页文案内容和技术栈数据

## 任务概述

更新关于页的文案内容和技术栈数据，涉及两个文件的修改：
1. `src/utils/constants.ts` - 更新数据源
2. `src/pages/about.astro` - 更新页面展示

## 详细变更清单

### 一、constants.ts 变更

#### 1. AUTHOR.bio
- **当前**: `中南财经政法大学在读。白天研究区块链，晚上刷算法题，凌晨思考维特根斯坦到底在说什么（至今没想明白）。`
- **新值**: `脑子里同时跑着四个线程，偶尔死锁。`

#### 2. SKILLS 对象
- **languages**: 新增 `JavaScript`, `TypeScript`
- **ai**: 完全更新为 `['LLM', 'RAG', 'Data Curation', 'Prompt Engineering', 'Deep Learning']`
- **新增 agent 字段**: `['LangChain', 'LangGraph', 'GitHub Actions', 'Notion API']`

#### 3. TIMELINE 数组
- **新增条目**: AI & 数据科学（在 ACM 和个人博客之间）
- **更新**: 个人博客写作的描述改为 `用输出倒逼输入，顺便治疗拖延症（效果待定）`

### 二、about.astro 变更

#### 1. 顶部简介区域（第26-28行）
添加加缪名言，以斜体灰色小字显示在 bio 下方：
```html
<p class="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-3">
  {AUTHOR.bio}
</p>
<p class="text-sm text-[var(--text-muted)] italic max-w-2xl mx-auto mb-6">
  "One must imagine Sisyphus happy." — Albert Camus
</p>
```

#### 2. "关于我"正文（第76-91行）
替换所有 `<p>` 标签为新文案，共5段。

#### 3. 技术栈区域
- **AI 分类标题**: 从 `AI & 数据` 改为 `AI & 数据工程`
- **新增 Agent & 工作流分类**: 在 AI 分类后添加新的技能展示块

#### 4. 联系我文案（第191行）
从 `如果你有任何问题、建议，或者想一起探讨技术话题，欢迎通过邮件联系我。`
改为 `如果你想聊技术、聊想法，或者只是想告诉我网站哪里有 bug，都欢迎通过邮件联系我。`

## 不变动的部分

- 页面布局结构和 HTML 骨架
- 头像样式和路径
- 社交链接按钮的结构和样式
- 联系我按钮的结构和样式
- 经历时间线的 HTML 结构和样式
- `<style>` 标签中的任何 CSS
- AUTHOR.name、AUTHOR.email、GITHUB_URL、TWITTER_URL 等其他常量

## 文件变更

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `src/utils/constants.ts` | 修改 | 更新 bio、SKILLS、TIMELINE |
| `src/pages/about.astro` | 修改 | 更新页面文案和布局 |

## 检查清单

**constants.ts:**
- [ ] AUTHOR.bio 更新为新文案
- [ ] SKILLS.languages 新增 JavaScript 和 TypeScript
- [ ] SKILLS.ai 更新
- [ ] SKILLS 新增 agent 字段
- [ ] TIMELINE 新增"AI & 数据科学"条目
- [ ] TIMELINE 中"个人博客写作"描述更新

**about.astro:**
- [ ] 顶部简介下方新增加缪名言
- [ ] "关于我"正文替换为新版文案
- [ ] 技术栈 AI 分类标题更新
- [ ] 技术栈新增"Agent & 工作流"分类
- [ ] 联系我文案更新
