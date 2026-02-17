# 本地字体方案实施指南

## 问题背景

CDN 字体（fonts.loli.net、fonts.googleapis.com 等）在国内网络环境下可能加载缓慢或失败，需要将字体文件托管在项目中实现本地加载。

## 解决方案

### 1. 下载字体文件

将字体文件放在 `public/fonts/` 目录下（Astro 会自动复制到 dist）：

```bash
mkdir -p public/fonts

# 下载字体文件（示例）
curl -L -o public/fonts/PlayfairDisplay-Bold.woff2 "[字体链接]"
curl -L -o public/fonts/NotoSerifSC-Bold.otf "[字体链接]"
```

**字体来源推荐：**
- **Google Fonts GitHub**: https://github.com/google/fonts
- **Noto CJK GitHub**: https://github.com/googlefonts/noto-cjk
- **霞鹜文楷 CDN**: https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/

### 2. 删除外部 CDN 链接

在 `src/layouts/BaseLayout.astro` 中删除所有外部字体链接：

```html
<!-- 删除以下链接 -->
<link href="https://fonts.googleapis.com/...">
<link href="https://fonts.loli.net/...">
<link href="https://fonts.font.im/...">
```

### 3. 添加 @font-face 规则

在 `src/styles/global.css` 最顶部添加：

```css
/* 本地字体加载 - @font-face 定义 */

/* 英文衬线体 - Playfair Display */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 中文衬线体 - Noto Serif SC */
@font-face {
  font-family: 'Noto Serif SC';
  src: url('/fonts/NotoSerifSC-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

**关键点：**
- 使用**绝对路径** `/fonts/xxx.woff2`（不是相对路径）
- `format()` 必须与实际文件格式匹配：
  - `woff2` 文件 → `format('woff2')`
  - `otf` 文件 → `format('opentype')`
  - `ttf` 文件 → `format('truetype')`
- `font-display: swap` 防止字体加载时的闪烁

### 4. 更新字体变量

```css
:root {
  --font-display: 'Playfair Display', 'Noto Serif SC', Georgia, 'SimSun', serif;
  --font-body: system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

### 5. 应用字体

在组件中使用 CSS 变量：

```astro
<h2 style="font-family: var(--font-display) !important;">精选博客</h2>
```

## 验证方法

1. **检查字体文件**
   ```bash
   ls -la public/fonts/
   # 确认文件大小正常（几百KB到几MB）
   ```

2. **构建项目**
   ```bash
   npm run build
   # 确认 dist/fonts/ 目录下有字体文件
   ```

3. **浏览器验证**
   - 打开 DevTools → Network 面板
   - 筛选 "Font"
   - 刷新页面，确认字体文件请求状态为 200
   - 选中文字元素，查看 Computed 中的 font-family

## 文件结构

```
public/
  fonts/
    ├── PlayfairDisplay-Bold.woff2  (300KB)
    └── NotoSerifSC-Bold.otf        (12MB)
src/
  layouts/
    └── BaseLayout.astro            (删除 CDN 链接)
  styles/
    └── global.css                   (添加 @font-face)
```

## 最佳实践

1. **使用绝对路径**：`/fonts/xxx.woff2` 而不是 `../fonts/xxx.woff2`
2. **选择合适的格式**：woff2 压缩率最好，优先使用
3. **限制字重数量**：只下载需要的字重（如仅 Bold），减少文件体积
4. **设置 font-display: swap**：防止字体加载阻塞渲染
5. **保留 fallback 字体**：确保字体加载失败时有系统字体替代

## 常见问题

### Q: 字体文件未被复制到 dist 目录？
A: 确保字体放在 `public/fonts/` 目录下，Astro 会自动复制。如果放在其他位置，需要手动配置复制规则。

### Q: 浏览器显示 404 找不到字体文件？
A: 检查 @font-face 中的路径是否为绝对路径 `/fonts/xxx`，以及文件是否真的存在于 public/fonts/ 目录。

### Q: 字体加载很慢？
A: 考虑使用更小的字体文件（如霞鹜文楷替代思源宋体），或仅加载必要字重。

## 参考

- [Astro 静态资源处理](https://docs.astro.build/en/guides/imports/)
- [CSS @font-face MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [Google Fonts GitHub 仓库](https://github.com/google/fonts)

---

**创建时间**: 2026-02-17
**相关提交**: 改用本地字体方案
