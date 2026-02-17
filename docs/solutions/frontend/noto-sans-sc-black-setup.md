# 思源黑体超粗体 (Noto Sans SC Black) 配置指南

## 字体介绍

**思源黑体 (Noto Sans SC)** 是 Google Noto CJK 项目的一部分，是一款现代无衬线中文字体。

### 特性

- **设计风格**: 现代无衬线、几何规整、力量感强
- **字形特点**: 笔画横平竖直，没有任何花哨装饰
- **多字重支持**: 从 Thin 到 Black 共 7 个字重
- **超粗字重**: Black (900) 极具冲击力，适合大标题
- **开源免费**: SIL Open Font License 1.1 授权

### 官方资源

- **Google Fonts**: https://fonts.google.com/noto/specimen/Noto+Sans+SC
- **GitHub**: https://github.com/googlefonts/noto-cjk
- **许可证**: SIL Open Font License 1.1

## 安装配置

### 方法 1: 使用 npm 安装（推荐）

```bash
npm install @fontsource/noto-sans-sc
```

复制需要的字重到项目目录：

```bash
# Black (900) 用于主标题
cp node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-900-normal.woff2 public/fonts/NotoSansSC-Black.woff2

# Bold (700) 用于副标题
cp node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff2 public/fonts/NotoSansSC-Bold.woff2
```

### 方法 2: 直接下载

从 Google Fonts 或 GitHub 下载：

```bash
# 从 GitHub 下载 Black 字重
curl -L -o public/fonts/NotoSansSC-Black.otf "https://github.com/googlefonts/noto-cjk/raw/main/Sans/SubsetOTF/SC/NotoSansSC-Black.otf"

# 从 GitHub 下载 Bold 字重
curl -L -o public/fonts/NotoSansSC-Bold.otf "https://github.com/googlefonts/noto-cjk/raw/main/Sans/SubsetOTF/SC/NotoSansSC-Bold.otf"
```

### 添加 @font-face

在 CSS 文件中添加：

```css
/* 思源黑体 Black (900) */
@font-face {
  font-family: 'Noto Sans SC';
  src: url('/fonts/NotoSansSC-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* 思源黑体 Bold (700) */
@font-face {
  font-family: 'Noto Sans SC';
  src: url('/fonts/NotoSansSC-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### 设置字体变量

```css
:root {
  --font-display: 'Playfair Display', 'Noto Sans SC', sans-serif;
  --font-body: 'Noto Sans SC', system-ui, -apple-system, sans-serif;
}
```

### 配置字重和 letter-spacing

```css
/* 超粗体 - 用于主标题 */
.font-black {
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em;  /* 中文超粗体加字间距更大气 */
}

/* 粗体 - 用于副标题和卡片 */
.font-bold {
  font-family: var(--font-display) !important;
  font-weight: 700 !important;
}

/* 主标题 */
.hero-title {
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em;
}

/* 区域标题 */
.section-header h2 {
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em;
}

/* 卡片标题 */
.card-title {
  font-family: var(--font-display) !important;
  font-weight: 700 !important;
}

/* 文章标题 */
.post-card h3 {
  font-family: var(--font-display) !important;
  font-weight: 700 !important;
}

/* 正文 */
body {
  font-family: var(--font-body);
  font-weight: 400;
}
```

## 与其他字体的对比

| 特性 | 思源黑体 Black | 站酷小薇体 | 得意黑 |
|------|---------------|-----------|--------|
| 风格 | 现代无衬线、力量感 | 手写艺术、温度感 | 几何、动感 |
| 字形 | 规整、横平竖直 | 流畅、手写感 | 窄字宽、斜切 |
| 字重 | Black (900) 极具冲击力 | Regular 单一 | Regular 单一 |
| 适用 | 科技、现代、专业 | 艺术、创意、个人 | 科技、年轻化 |
| 体积 | ~1.1MB (woff2) | ~2.1MB (woff2) | ~1.1MB (woff2) |

## 实际效果

思源黑体超粗体在以下场景表现出色：

- ✅ 网站主标题（如"一名热爱技术的开发者"）
- ✅ 区域标题（如"精选博客"）
- ✅ Hero 区域大标题
- ✅ 需要力量感、专业感的品牌展示

思源黑体不适合：
- ❌ 需要柔和、艺术感的场合
- ❌ 长文本正文（虽然可读性好，但缺乏个性）

## 性能优化

1. **使用 woff2 格式**: 比 otf 小约 50%
2. **按需加载字重**: 只加载需要的字重（如仅 700 和 900）
3. **font-display: swap**: 防止字体加载阻塞渲染
4. **letter-spacing: 0.05em**: 让中文超粗体更大气，提升视觉效果

## 文件大小

| 文件 | 大小 | 说明 |
|------|------|------|
| NotoSansSC-Black.woff2 | ~1.1MB | 900 字重，简体中文子集 |
| NotoSansSC-Bold.woff2 | ~1.2MB | 700 字重，简体中文子集 |
| 总计 | ~2.3MB | 两个字重覆盖所有场景 |

## 验证方法

1. **检查字体文件**
   ```bash
   ls -la public/fonts/
   # 确认 NotoSansSC-Black.woff2 约 1.1MB
   # 确认 NotoSansSC-Bold.woff2 约 1.2MB
   ```

2. **检查 @font-face**
   - 打开 DevTools → Elements 面板
   - 查看 `<head>` 中的样式
   - 确认 @font-face 规则存在

3. **验证字体应用**
   - 选中页面文字
   - 查看 Computed 中的 font-family
   - 确认显示 "Noto Sans SC"

4. **视觉确认**
   - "精选博客" 等中文应非常粗、有力量感
   - 笔画规整，横平竖直
   - 无手写或花哨感
   - 与 Playfair Display 形成中西对比

## 常见问题

### Q: 字体看起来不够粗？
A: 检查以下几点：
1. 确认使用了 `font-weight: 900` 而不是 `font-weight: bold`
2. 确认 @font-face 中 font-weight 与实际使用的一致
3. 检查是否有其他 CSS 覆盖了字重

### Q: 中文显示为系统字体？
A: 可能是字体文件未包含该字符。思源黑体覆盖完整的中文 Unicode 范围。

### Q: letter-spacing 不生效？
A: 确保 letter-spacing 应用于正确的元素，且没有被其他样式覆盖。

### Q: 如何添加更多字重？
A: 可以从 npm 包中复制其他字重：
```bash
cp node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2 public/fonts/NotoSansSC-Regular.woff2
```
然后添加对应的 @font-face：
```css
@font-face {
  font-family: 'Noto Sans SC';
  src: url('/fonts/NotoSansSC-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## 参考

- [Noto Sans SC - Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+SC)
- [@fontsource/noto-sans-sc - npm](https://www.npmjs.com/package/@fontsource/noto-sans-sc)
- [Noto CJK GitHub](https://github.com/googlefonts/noto-cjk)
- [SIL Open Font License](https://scripts.sil.org/OFL)

---

**创建时间**: 2026-02-17
**相关提交**: 替换中文字体为思源黑体超粗体 (Noto Sans SC Black)
