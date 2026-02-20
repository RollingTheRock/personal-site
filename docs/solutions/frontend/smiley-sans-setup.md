# 得意黑 (Smiley Sans) 字体配置指南

## 字体介绍

**得意黑 (Smiley Sans)** 是一款由 atelier-anchor 设计工作室开发的几何风格中文字体。

### 特性

- **几何感**: 基于几何形状构建，线条简洁有力
- **微倾斜 (Oblique)**: 自带 8° 倾斜，动感现代
- **窄字宽**: 横向紧凑，适合标题展示
- **大弧度**: 笔画转折处使用大圆角，柔和而不失力度
- **开源免费**: SIL Open Font License 1.1 授权

### 适用场景

- 网站标题、品牌展示
- 海报、Banner 设计
- 需要现代感、科技感的视觉设计

### 官方资源

- **GitHub**: https://github.com/atelier-anchor/smiley-sans
- **下载**: https://github.com/atelier-anchor/smiley-sans/releases
- **许可证**: SIL Open Font License 1.1

## 安装配置

### 1. 下载字体文件

从 GitHub Releases 下载：

```bash
# 下载最新版本
curl -L -o /tmp/smiley-sans.zip "https://github.com/atelier-anchor/smiley-sans/releases/download/v2.0.1/smiley-sans-v2.0.1.zip"

# 解压
unzip /tmp/smiley-sans.zip -d /tmp/smiley-sans

# 复制到项目目录
cp /tmp/smiley-sans/SmileySans-Oblique.ttf public/fonts/
cp /tmp/smiley-sans/SmileySans-Oblique.ttf.woff2 public/fonts/SmileySans-Oblique.woff2
```

或使用 jsDelivr CDN 下载：

```bash
curl -L -o public/fonts/SmileySans-Oblique.ttf "https://cdn.jsdelivr.net/gh/atelier-anchor/smiley-sans@v2.0.1/dist/SmileySans-Oblique.ttf"
```

### 2. 添加 @font-face

在 CSS 文件中添加：

```css
@font-face {
  font-family: 'Smiley Sans';
  src: url('/fonts/SmileySans-Oblique.woff2') format('woff2'),
       url('/fonts/SmileySans-Oblique.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

**注意：**
- 得意黑本身就是 Oblique（倾斜）设计，不需要设置 `font-style: italic`
- 建议同时提供 woff2 和 ttf 格式，确保兼容性

### 3. 设置字体变量

```css
:root {
  --font-display: 'Playfair Display', 'Smiley Sans', Georgia, 'SimSun', sans-serif;
  --font-body: system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

**字体回退链设计：**
- **Playfair Display**: 英文字体，优雅衬线
- **Smiley Sans**: 中文字体，几何斜切
- **Georgia**: 系统衬线字体
- **SimSun**: Windows 宋体
- **sans-serif**: 通用无衬线

### 4. 应用字体

```astro
<h2 style="font-family: var(--font-display) !important;">精选博客</h2>
```

**自动应用：**
如果 CSS 已设置标题使用 `var(--font-display)`，则无需额外修改组件。

## 与思源宋体的对比

| 特性 | 得意黑 (Smiley Sans) | 思源宋体 (Noto Serif SC) |
|------|----------------------|--------------------------|
| 风格 | 几何、现代、动感 | 传统、优雅、正式 |
| 字形 | 窄字宽、大弧度 | 标准字宽、衬线装饰 |
| 倾斜 | 自带 8° Oblique | 正体，需要人工斜体 |
| 适用 | 科技、创意、年轻化 | 阅读、出版、正式场合 |
| 体积 | ~2.5MB (ttf) | ~12MB (otf) |

## 实际效果

得意黑在以下场景表现出色：

- ✅ 网站标题（如"精选博客"）
- ✅ 按钮文字
- ✅ 卡片标签
- ✅ Hero 区域主标题

得意黑不适合：
- ❌ 长文本正文（可读性不如正文字体）
- ❌ 需要传统、正式感的场合

## 性能优化

1. **使用 woff2 格式**: 比 ttf 小约 50%，优先加载
2. **font-display: swap**: 防止字体加载阻塞渲染
3. **预加载关键字体**: 如需进一步优化可添加 `<link rel="preload">`

## 文件大小

| 文件 | 大小 | 说明 |
|------|------|------|
| SmileySans-Oblique.ttf | ~2.6MB | 完整字体 |
| SmileySans-Oblique.woff2 | ~1.1MB | 压缩版本，推荐 |
| NotoSerifSC-Bold.otf | ~12MB | 思源宋体（对比）|

得意黑比思源宋体小约 5 倍，加载更快。

## 验证方法

1. **检查字体文件**
   ```bash
   ls -la public/fonts/
   # 确认 SmileySans-Oblique.ttf 约 2.6MB
   # 确认 SmileySans-Oblique.woff2 约 1.1MB
   ```

2. **检查 @font-face**
   - 打开 DevTools → Elements 面板
   - 查看 `<head>` 中的样式
   - 确认 @font-face 规则存在

3. **验证字体应用**
   - 选中页面文字
   - 查看 Computed 中的 font-family
   - 确认显示 "Smiley Sans"

4. **视觉确认**
   - "精选博客" 等中文应有明显的几何感
   - 文字整体略微倾斜
   - 笔画粗细对比明显

## 常见问题

### Q: 字体看起来和之前一样？
A: 检查以下几点：
1. @font-face 的 src 路径是否正确（使用绝对路径 `/fonts/xxx`）
2. 浏览器 Network 面板中字体文件是否加载成功（状态 200）
3. CSS 变量是否正确应用到元素

### Q: 部分文字显示为系统字体？
A: 可能是字体文件未包含该字符。得意黑覆盖 GB2312 字符集，大部分常用中文都有。

### Q: 如何调整字体粗细？
A: 得意黑目前只有 Regular（Oblique）一个字重。如需粗体效果，可用：
```css
font-weight: 700; /* 浏览器会合成加粗 */
```

## 参考

- [得意黑 GitHub 仓库](https://github.com/atelier-anchor/smiley-sans)
- [atelier-anchor 官网](https://atelier-anchor.com/)
- [SIL Open Font License](https://scripts.sil.org/OFL)

---

**创建时间**: 2026-02-17
**相关提交**: 替换中文字体为得意黑 (Smiley Sans)
