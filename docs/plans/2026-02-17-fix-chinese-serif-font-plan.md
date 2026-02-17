# 修复中文衬线字体问题

## 日期
2026-02-17

## 背景
当前网站使用 Google Fonts 引入 Playfair Display 和 Noto Serif SC 字体，但在国内网络环境下可能加载缓慢或失败。需要切换到国内 CDN 镜像，并确保中文衬线字体正确应用。

## 目标
1. 替换 Google Fonts 为国内 CDN 镜像 (fonts.loli.net)
2. 设置正确的 CSS 字体变量和 fallback
3. 将衬线字体应用到指定元素
4. 验证字体正确加载

## 技术方案

### Step 1: 替换字体引入
删除现有的所有 Google Fonts 相关 `<link>` 标签，替换为：
```html
<link href="https://fonts.loli.net/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Noto+Serif+SC:wght@600;700;900&display=swap" rel="stylesheet">
```

备选 CDN：
```html
<link href="https://fonts.font.im/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Noto+Serif+SC:wght@600;700;900&display=swap" rel="stylesheet">
```

### Step 2: 设置 CSS 字体变量
在 `global.css` 的 `:root` 中设置：
```css
--font-display: 'Playfair Display', 'Noto Serif SC', Georgia, 'SimSun', serif;
--font-body: 'Inter', system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### Step 3: 应用衬线字体
使用 `font-family: var(--font-display) !important` 应用到：
1. Logo "RollingTheRock"
2. "一名热爱技术的开发者"（hero 主标题）
3. "精选博客" 标题（h2）
4. "精选项目" 标题（h2）
5. "订阅更新" 标题
6. 卡片上的 "Blog" "Projects" "Videos"

### Step 4: 验证
- Network 面板确认字体文件请求（NotoSerifSC, PlayfairDisplay）
- 状态码 200 表示成功
- Computed font-family 显示正确值

## 文件变更清单

1. `src/layouts/BaseLayout.astro` - 替换字体引入链接
2. `src/styles/global.css` - 设置 CSS 字体变量
3. `src/components/Logo.astro` - 应用衬线字体
4. `src/components/HeroSection.astro` - 应用衬线字体到标题
5. `src/components/CategoryCards.astro` - 应用衬线字体到卡片文字
6. `src/components/FeaturedPosts.astro` - 应用衬线字体到标题
7. `src/components/FeaturedProjects.astro` - 应用衬线字体到标题
8. `src/components/Subscribe.astro` - 应用衬线字体到标题

## 验收标准

- [ ] fonts.loli.net 字体链接成功加载
- [ ] Network 面板显示 NotoSerifSC 和 PlayfairDisplay 字体文件请求
- [ ] Logo "RollingTheRock" 显示为衬线字体
- [ ] "精选博客" 等标题显示为 Noto Serif SC
- [ ] 卡片上的 "Blog" "Projects" "Videos" 显示为衬线字体
- [ ] 有合适的 fallback 字体（SimSun 等）

## 执行命令

```bash
# 开发服务器
npm run dev

# 构建验证
npm run build
```
