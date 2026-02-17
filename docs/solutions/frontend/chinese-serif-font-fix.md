# 中文衬线字体修复方案

## 问题背景

在国内网络环境下，Google Fonts 加载缓慢或失败，导致中文衬线字体（Noto Serif SC）无法正常显示，影响网站视觉效果。

## 解决方案

### 1. 使用国内 CDN 镜像

替换 Google Fonts 为 fonts.loli.net（国内镜像）：

```html
<link href="https://fonts.loli.net/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Noto+Serif+SC:wght@600;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

备选 CDN（fonts.loli.net 不可用时）：
```html
<link href="https://fonts.font.im/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Noto+Serif+SC:wght@600;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 2. 设置完整的字体 Fallback 链

在 CSS 变量中设置完整的 fallback，确保字体加载失败时有合适的替代：

```css
:root {
  /* 展示字体 - 用于标题、Logo */
  --font-display: 'Playfair Display', 'Noto Serif SC', Georgia, 'SimSun', serif;

  /* 正文字体 - 用于正文内容 */
  --font-body: 'Inter', system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

**Fallback 策略：**
- **Playfair Display**: 英文字体，优雅衬线
- **Noto Serif SC**: 思源宋体，中文衬线
- **Georgia**: Windows/Mac 都有的衬线字体
- **SimSun**: 宋体，Windows 系统默认中文字体
- **PingFang SC**: 苹方，macOS/iOS 默认中文字体
- **Microsoft YaHei**: 微软雅黑，Windows 默认中文字体

### 3. 强制应用衬线字体

使用 `!important` 确保衬线字体覆盖其他样式：

```astro
<h2 style="font-family: var(--font-display) !important;">精选博客</h2>
```

**应用位置：**
1. Logo "RollingTheRock"
2. Hero 主标题 "一名热爱技术的开发者"
3. 区域标题 "精选博客"、"精选项目"、"订阅更新"
4. 分类卡片标题 "Blog"、"Projects"、"Videos"

### 4. 验证字体加载

在浏览器 DevTools 中验证：

1. **Network 面板**
   - 筛选 "Font" 类型
   - 确认有 `NotoSerifSC` 和 `PlayfairDisplay` 字体文件
   - 状态码应为 200

2. **Elements 面板**
   - 选中文字元素
   - 查看 Computed 中的 `font-family`
   - 确认实际应用的字体

## 文件变更

| 文件 | 变更内容 |
|------|----------|
| `src/layouts/BaseLayout.astro` | 替换字体引入为国内 CDN |
| `src/styles/global.css` | 添加 SimSun 等 fallback |
| `src/components/Logo.astro` | 应用 !important 衬线字体 |
| `src/components/HeroSection.astro` | 应用 !important 衬线字体 |
| `src/components/CategoryCards.astro` | 应用 !important 衬线字体 |
| `src/components/FeaturedPosts.astro` | 应用 !important 衬线字体 |
| `src/components/FeaturedProjects.astro` | 应用 !important 衬线字体 |
| `src/components/Subscribe.astro` | 应用 !important 衬线字体 |

## 最佳实践

1. **始终使用 !important**：防止 Tailwind 或其他工具类覆盖字体设置
2. **设置完整 fallback**：确保字体加载失败时有合适的系统字体替代
3. **国内 CDN 优先**：fonts.loli.net 或 fonts.font.im 在国内访问更快
4. **验证加载**：使用 DevTools 确认字体文件实际加载成功

## 参考

- [Google Fonts 国内镜像](https://zhuanlan.zhihu.com/p/358078378)
- [思源宋体 (Noto Serif SC)](https://fonts.google.com/noto/specimen/Noto+Serif+SC)
- [CSS font-family 最佳实践](https://css-tricks.com/snippets/css/font-stacks/)

---

**创建时间**: 2026-02-17
**相关提交**: 修复中文衬线字体问题
