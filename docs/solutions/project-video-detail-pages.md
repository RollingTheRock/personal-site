---
title: 项目详情页和视频详情页开发
date: 2026-02-14
category: astro
tags: [astro, project, video, detail-page]
---

# 项目详情页和视频详情页开发

## 问题背景

项目详情页和视频详情页初始实现较简单，需要增强以提供与博客详情页一致的阅读体验。

## 解决方案

### 1. 通用导航组件

创建 `ContentNavigation.astro` 支持博客/项目/视频三种类型：

```astro
interface Props {
  prev?: Item;
  next?: Item;
  basePath: string;
  prevLabel?: string;
  nextLabel?: string;
}
```

### 2. 相关推荐算法

**项目推荐**（基于技术栈）：
```typescript
const scoredProjects = allProjects
  .filter(p => p.slug !== currentSlug)
  .map(p => {
    let score = 0;
    p.data.tech.forEach(t => {
      if (tech.includes(t)) score += 2;
    });
    return { project: p, score };
  })
  .filter(({ score }) => score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);
```

**视频推荐**（基于平台）：
```typescript
const scoredVideos = allVideos
  .filter(v => v.slug !== currentSlug)
  .map(v => ({
    video: v,
    score: v.data.platform === platform ? 2 : 0
  }))
  .sort((a, b) => /* score then date */)
  .slice(0, 3);
```

### 3. 平台抽象层

创建 `src/utils/platform.ts` 统一管理视频平台：

```typescript
export type VideoPlatform = 'bilibili' | 'youtube';

export const PLATFORM_CONFIG: Record<VideoPlatform, PlatformConfig> = {
  bilibili: { name: 'Bilibili', icon: '...', urlTemplate: '...' },
  youtube: { name: 'YouTube', icon: '...', urlTemplate: '...' },
};
```

优势：
- 新增平台只需添加配置，无需修改多处代码
- 类型安全，避免拼写错误
- 图标、名称、URL 集中管理

### 4. 视频详情页 UX 设计

采用封面图 + 播放按钮的设计而非直接嵌入：

```astro
<a href={videoUrl} target="_blank" class="group relative">
  <!-- 缩略图 -->
  <img src={thumbnail} class="group-hover:scale-105" />

  <!-- 播放按钮 -->
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="w-20 h-20 bg-white/90 rounded-full
                flex items-center justify-center
                group-hover:scale-110 transition-transform">
      <svg><!-- 播放图标 --></svg>
    </div>
  </div>

  <!-- 平台标识 -->
  <div class="absolute top-4 right-4 bg-black/60 text-white">
    在 {platformName} 观看
  </div>
</a>
```

设计考量：
- 避免自动加载 iframe 影响性能
- 明确告知用户将跳转到外部平台
- 保持品牌一致性（播放按钮样式统一）

## 工具函数抽象

### 日期格式化 (`src/utils/date.ts`)

```typescript
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string;
export function formatDateFull(date: Date): string;      // 年月日
export function formatDateYearMonth(date: Date): string; // 年月
```

### 平台工具 (`src/utils/platform.ts`)

```typescript
export function getPlatformName(platform: VideoPlatform): string;
export function getPlatformIcon(platform: VideoPlatform): string;
export function getVideoUrl(videoId: string, platform: VideoPlatform): string;
```

## 文件结构

```
src/
├── components/
│   ├── ContentNavigation.astro   # 通用导航
│   ├── RelatedProjects.astro     # 相关项目
│   └── RelatedVideos.astro       # 相关视频
├── pages/
│   ├── projects/[...slug].astro  # 项目详情页
│   ├── videos/[...slug].astro    # 视频详情页
│   └── blog/[...slug].astro      # 博客详情页（参考）
└── utils/
    ├── date.ts                   # 日期格式化
    └── platform.ts               # 视频平台工具
```

## 关键经验

1. **DRY 原则**：重复的 `formatDate`、`getPlatformName` 等提取到工具函数
2. **配置优于条件**：使用 `PLATFORM_CONFIG` 对象替代 if/else，更易扩展
3. **类型安全**：使用 `VideoPlatform` 类型而非 `string`，编译时捕获错误
4. **组件复用**：`ContentNavigation` 通用于所有内容类型
5. **性能考量**：视频页使用封面图而非 iframe，减少初始加载

## 扩展建议

- 新增视频平台：在 `PLATFORM_CONFIG` 添加配置即可
- 增强项目推荐：可基于 README 内容提取关键词匹配
- 添加评论：项目/视频页可复用 `Comments.astro` 组件
