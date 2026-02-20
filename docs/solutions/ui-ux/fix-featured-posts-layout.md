# 修复精选博客组件布局和标签颜色

## 问题背景

`FeaturedPosts.astro` 组件存在两个问题：
1. 分类标签配色没有根据分类动态应用，所有标签都是统一的白色边框
2. 大卡片高度没有和右侧两个小卡片对齐，视觉不协调

## 解决方案

### 1. 标签颜色动态化

**问题**：标签使用固定的半透明边框，没有反映分类品牌色。

**修复**：使用 `CATEGORY_COLOR_MAP` 动态设置标签边框色：

```astro
<span
  class="post-tag relative z-10 inline-block text-white text-xs px-3 py-1 rounded-md"
  style={`
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    border: 1px solid ${getPostColor(post.data.categories)};
  `}
>
```

颜色映射来自 `src/utils/constants.ts`：
- 思考/随笔 → 紫色 `#A855F7`
- 技术/ACM/基础算法/项目 → 青色 `#06B6D4`
- 生活 → 橙色 `#F97316`

### 2. 高度对齐

**问题**：原布局使用 `grid-cols-[3fr_2fr]`，大卡片高度固定，无法对齐右侧两个小卡片。

**修复方案**：改用 CSS Grid 的 2x2 布局，大卡片跨两行：

```astro
<!-- 网格容器：2列2行 -->
<div class="featured-grid grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6">

  <!-- 大卡片：跨两行 -->
  <a href={`/blog/${mainPost.slug}`} class="block md:row-span-2 h-full">
    <article class="... h-full flex flex-col">
      <!-- 图片区域：flex-1 自动填充 -->
      <div class="post-image flex-1 ... min-h-[200px]">
        ...
      </div>
      <div class="post-content p-6">
        ...
      </div>
    </article>
  </a>

  <!-- 小卡片：各自占据一行 -->
  {sidePosts.map((post) => (
    <a href={`/blog/${post.slug}`} class="block">
      <article class="... h-full flex flex-col">
        ...
      </article>
    </a>
  ))}
</div>
```

**关键点**：
- `md:grid-cols-2 md:grid-rows-2` - 桌面端 2x2 网格
- `md:row-span-2` - 大卡片跨两行
- `h-full flex flex-col` - 大卡片撑满高度并启用 flex 布局
- `flex-1` - 图片区域自动填充剩余空间
- `min-h-[200px]` - 保证图片最小高度

### 3. 响应式处理

移动端（≤768px）自动恢复单列布局：
- `grid-cols-1` - 单列
- 大卡片不再跨行，正常堆叠

## 文件变更

| 文件 | 变更 |
|------|------|
| `src/components/FeaturedPosts.astro` | 标签边框动态配色 + 2x2 网格布局 |

## 检查清单

- [x] 分类标签边框色根据 `CATEGORY_COLOR_MAP` 动态应用
- [x] 大卡片高度等于右侧两个小卡片总高度 + gap
- [x] 移动端单列布局正常
- [x] 其他样式和交互保持不变
- [x] 构建成功（29 pages）

## 相关文档

- [动态精选组件改造](./dynamic-featured-components.md)
