# 更新关于页文案内容和技术栈数据

## 任务概述

全面更新关于页的文案内容，包括个人简介、技术栈展示、时间线经历和页面正文，使内容更贴合当前技术方向和风格。

## 变更详情

### 1. 数据源更新 (constants.ts)

#### AUTHOR.bio
```diff
- 中南财经政法大学在读。白天研究区块链，晚上刷算法题，凌晨思考维特根斯坦到底在说什么（至今没想明白）。
+ 脑子里同时跑着四个线程，偶尔死锁。
```

#### SKILLS 技术栈
- **languages**: 新增 `JavaScript`, `TypeScript`
- **ai**: 完全更新为 `['LLM', 'RAG', 'Data Curation', 'Prompt Engineering', 'Deep Learning']`
- **新增 agent 字段**: `['LangChain', 'LangGraph', 'GitHub Actions', 'Notion API']`

#### TIMELINE 时间线
- **新增**: "AI & 数据科学"条目（在 ACM 和个人博客之间）
- **更新**: "个人博客写作"描述改为更随性的风格

### 2. 页面展示更新 (about.astro)

#### 顶部简介区域
添加加缪名言作为个人信条：
```html
<p class="text-sm text-[var(--text-muted)] italic max-w-2xl mx-auto mb-6">
  "One must imagine Sisyphus happy." — Albert Camus
</p>
```

#### "关于我"正文
替换为5段新文案，涵盖：
1. 自我介绍 + 推石头隐喻
2. Agent 工作流和数据集构建主线
3. 区块链、算法竞赛、维特根斯坦
4. 网站建设的意义
5. 邀请订阅 RSS

#### 技术栈展示
- AI 分类标题从 "AI & 数据" 改为 "AI & 数据工程"
- 新增 "Agent & 工作流" 分类展示

#### 联系我文案
```diff
- 如果你有任何问题、建议，或者想一起探讨技术话题，欢迎通过邮件联系我。
+ 如果你想聊技术、聊想法，或者只是想告诉我网站哪里有 bug，都欢迎通过邮件联系我。
```

## 文件变更

| 文件 | 变更 |
|------|------|
| `src/utils/constants.ts` | bio、SKILLS、TIMELINE 更新 |
| `src/pages/about.astro` | 页面文案、技术栈展示更新 |

## 设计思路

1. **风格统一**: 新文案保持了与网站整体一致的自嘲、随性的个人风格
2. **技术方向**: 突出当前重点（Agent 工作流、数据工程），同时保留原有技术栈
3. **哲学隐喻**: 西西弗斯神话呼应网站名称 "RollingTheRock"
4. **内容分层**: bio 简短有力，正文详细展开，名言点睛

## 检查清单

- [x] AUTHOR.bio 更新
- [x] SKILLS.languages 新增 JS/TS
- [x] SKILLS.ai 更新
- [x] SKILLS 新增 agent 字段
- [x] TIMELINE 新增 AI 条目
- [x] TIMELINE 博客描述更新
- [x] 顶部添加加缪名言
- [x] "关于我"正文替换
- [x] AI 分类标题更新
- [x] Agent & 工作流分类新增
- [x] 联系我文案更新
- [x] 构建成功（29 pages）
