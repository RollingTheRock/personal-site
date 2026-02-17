# 站酷小薇体 (ZCOOL XiaoWei) 字体配置指南

## 字体介绍

**站酷小薇体 (ZCOOL XiaoWei)** 是一款来自 Google Fonts 的中文艺术字体，由站酷（ZCOOL）平台推出。

### 特性

- **设计风格**: 几何感、手写风格、艺术性强
- **字形特点**: 笔画流畅自然，带有手写体的温度感
- **适用场景**: 标题、品牌展示、海报设计
- **开源免费**: SIL Open Font License 1.1 授权

### 官方资源

- **Google Fonts**: https://fonts.google.com/specimen/ZCOOL+XiaoWei
- **GitHub**: https://github.com/googlefonts/zcool-xiaowei
- **许可证**: SIL Open Font License 1.1

## 安装配置

### 方法 1: 使用 npm 安装（推荐）

```bash
npm install @fontsource/zcool-xiaowei
```

复制字体文件到项目目录：

```bash
cp node_modules/@fontsource/zcool-xiaowei/files/zcool-xiaowei-chinese-simplified-400-normal.woff2 public/fonts/ZCOOLXiaoWei-Regular.woff2
cp node_modules/@fontsource/zcool-xiaowei/files/zcool-xiaowei-latin-400-normal.woff2 public/fonts/ZCOOLXiaoWei-Latin.woff2
```

### 方法 2: 直接下载

从 Google Fonts 下载：

```bash
curl -L -o public/fonts/ZCOOLXiaoWei-Regular.woff2 "https://fonts.gstatic.com/s/zcoolxiaowei/v5/hW2DwJ6gJYRttD7B82o-h-f8.woff2"
```

### 添加 @font-face

在 CSS 文件中添加：

```css
@font-face {
  font-family: 'ZCOOL XiaoWei';
  src: url('/fonts/ZCOOLXiaoWei-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### 设置字体变量

```css
:root {
  --font-display: 'Playfair Display', 'ZCOOL XiaoWei', Georgia, 'SimSun', serif;
  --font-body: system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

**字体回退链设计：**
- **Playfair Display**: 英文字体，优雅衬线
- **ZCOOL XiaoWei**: 中文字体，艺术手写风格
- **Georgia**: 系统衬线字体
- **SimSun**: Windows 宋体
- **serif**: 通用衬线

### 应用字体

```astro
<h2 style="font-family: var(--font-display) !important;">精选博客</h2>
```

## 与其他字体的对比

| 特性 | 站酷小薇体 (ZCOOL XiaoWei) | 得意黑 (Smiley Sans) | 思源宋体 (Noto Serif SC) |
|------|---------------------------|---------------------|--------------------------|
| 风格 | 手写艺术、自然流畅 | 几何、现代、动感 | 传统、优雅、正式 |
| 字形 | 手写感、有温度 | 窄字宽、大弧度 | 标准字宽、衬线装饰 |
| 倾斜 | 自然手写倾斜 | 自带 8° Oblique | 正体 |
| 适用 | 艺术、创意、个人网站 | 科技、创意、年轻化 | 阅读、出版、正式场合 |
| 体积 | ~2.1MB (woff2) | ~1.1MB (woff2) | ~12MB (otf) |

## 实际效果

站酷小薇体在以下场景表现出色：

- ✅ 网站标题（如"精选博客"）
- ✅ Hero 区域主标题
- ✅ 个人博客名称
- ✅ 艺术展示类内容

站酷小薇体不适合：
- ❌ 长文本正文（可读性不如正文字体）
- ❌ 需要严肃、正式感的场合

## 性能优化

1. **使用 woff2 格式**: 比 ttf 小约 50%，优先加载
2. **font-display: swap**: 防止字体加载阻塞渲染
3. **子集化字体**: @fontsource 包已按字符集分块，可只加载简体中文子集

## 文件大小

| 文件 | 大小 | 说明 |
|------|------|------|
| ZCOOLXiaoWei-Regular.woff2 | ~2.1MB | 简体中文子集 |
| ZCOOLXiaoWei-Latin.woff2 | ~14KB | 拉丁字符子集 |
| 总计 | ~2.1MB | 仅加载需要的子集 |

## 验证方法

1. **检查字体文件**
   ```bash
   ls -la public/fonts/
   # 确认 ZCOOLXiaoWei-Regular.woff2 约 2.1MB
   ```

2. **检查 @font-face**
   - 打开 DevTools → Elements 面板
   - 查看 `<head>` 中的样式
   - 确认 @font-face 规则存在

3. **验证字体应用**
   - 选中页面文字
   - 查看 Computed 中的 font-family
   - 确认显示 "ZCOOL XiaoWei"

4. **视觉确认**
   - "精选博客" 等中文应有明显的手写艺术感
   - 笔画流畅自然，带有手写温度
   - 与思源宋体的正式感明显不同

## 常见问题

### Q: 字体看起来和之前一样？
A: 检查以下几点：
1. @font-face 的 src 路径是否正确（使用绝对路径 `/fonts/xxx`）
2. 浏览器 Network 面板中字体文件是否加载成功（状态 200）
3. CSS 变量是否正确应用到元素

### Q: 部分文字显示为系统字体？
A: 可能是字体文件未包含该字符。站酷小薇体覆盖 GB2312 字符集，大部分常用中文都有。

### Q: 如何调整字体粗细？
A: 站酷小薇体目前只有 Regular (400) 一个字重。如需粗体效果，可用：
```css
font-weight: 700; /* 浏览器会合成加粗 */
```

## 参考

- [ZCOOL XiaoWei - Google Fonts](https://fonts.google.com/specimen/ZCOOL+XiaoWei)
- [@fontsource/zcool-xiaowei - npm](https://www.npmjs.com/package/@fontsource/zcool-xiaowei)
- [ZCOOL 站酷官网](https://www.zcool.com.cn/)
- [SIL Open Font License](https://scripts.sil.org/OFL)

---

**创建时间**: 2026-02-17
**相关提交**: 替换中文字体为站酷小薇体 (ZCOOL XiaoWei)
