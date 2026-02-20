# 视频页风格改造方案

## 问题背景
博客页（紫色品牌色）和项目页（青色品牌色）已完成改造，需要将视频页统一到同一设计语言，使用橙色品牌色。

## 关键挑战

### 1. 视频内容数量变化
- 当前仅 1 个视频
- 未来可能增加更多
- **解决方案**：自适应布局
  - 单视频 → 全宽大卡片（更有存在感）
  - 多视频 → 两列网格 + 互斥暗化

### 2. 封面图字段差异
- 博客/项目使用 `image`
- 视频使用 `thumbnail`
- **处理**：在 VideoCard 组件中统一处理 `thumbnail` 字段

### 3. 视频嵌入需求
- 详情页需要 iframe 嵌入播放器
- 同时需要外链到原平台
- **处理**：分离 `getVideoUrl`（观看）和 `getVideoEmbedUrl`（嵌入）

## 实现要点

### 自适应布局逻辑
```astro
const isSingleVideo = sortedVideos.length === 1;

{isSingleVideo ? (
  <VideoCard layout="full" ... />
) : (
  <div class="videos-grid">
    <VideoCard layout="grid" ... />
  </div>
)}
```

### 播放图标设计
```css
.play-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.9);
}
.group:hover .play-icon {
  background: rgba(249, 115, 22, 0.3);
  color: #F97316;
}
```

### 详情页按钮样式
```css
.video-btn:hover {
  border-color: #F97316;
  color: #F97316;
  background: rgba(249, 115, 22, 0.1);
}
```

## 品牌色体系总结

| 页面类型 | 品牌色 | 用途 |
|---------|--------|------|
| 博客（思考/AI）| `#A855F7` | 紫色 |
| 项目（技术/工程）| `#06B6D4` | 青色 |
| 视频 | `#F97316` | 橙色 |

## 相关文件
- `src/utils/platform.ts` - 视频平台工具函数
- `docs/solutions/ui-ux/project-pages-styling-v2.md` - 项目页方案（青色）
