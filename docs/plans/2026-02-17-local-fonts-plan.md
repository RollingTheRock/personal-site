# 本地字体方案实施计划

## 日期
2026-02-17

## 背景
CDN 字体（fonts.loli.net）加载失败，需要改用本地字体方案，将字体文件托管在项目中。

## 目标
1. 下载字体文件到本地 assets/fonts/ 目录
2. 删除所有外部 CDN 字体链接
3. 使用 @font-face 加载本地字体
4. 更新字体变量和应用样式
5. 验证字体正确加载

## 实施方案

### Step 1: 下载字体文件

创建目录并尝试下载字体：

```bash
mkdir -p public/fonts
```

**方案 A: 直接下载（优先尝试）**
- Playfair Display: Google Fonts 官方仓库
- Noto Serif SC: Google Fonts Noto CJK 仓库

**方案 B: npm 安装（备用）**
```bash
npm install @fontsource/playfair-display @fontsource/noto-serif-sc
```

**方案 C: 霞鹜文楷（最终备选）**
- LXGW WenKai: 更小的中文字体，容易获取

### Step 2: 删除外部 CDN 链接

在 `BaseLayout.astro` 中删除：
```html
<link href="https://fonts.loli.net/...">
```

### Step 3: 添加 @font-face

在 `global.css` 最顶部添加：

```css
/* 英文衬线体 */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 中文衬线体 */
@font-face {
  font-family: 'Noto Serif SC';
  src: url('/fonts/NotoSerifSC-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Step 4: 更新字体变量

```css
--font-display: 'Playfair Display', 'Noto Serif SC', Georgia, 'SimSun', serif;
--font-body: system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### Step 5: 应用字体

确保所有目标元素使用 `!important`：
- Logo "RollingTheRock"
- Hero 主标题
- "精选博客"、"精选项目"、"订阅更新" 标题
- 分类卡片标题

## 文件变更清单

1. `public/fonts/` - 新增字体文件目录
2. `src/layouts/BaseLayout.astro` - 删除外部字体链接
3. `src/styles/global.css` - 添加 @font-face 和更新变量
4. `src/components/Logo.astro` - 应用字体（可能无需修改）
5. `src/components/HeroSection.astro` - 应用字体（可能无需修改）
6. `src/components/CategoryCards.astro` - 应用字体（可能无需修改）
7. `src/components/FeaturedPosts.astro` - 应用字体（可能无需修改）
8. `src/components/FeaturedProjects.astro` - 应用字体（可能无需修改）
9. `src/components/Subscribe.astro` - 应用字体（可能无需修改）

## 验证标准

- [ ] 字体文件成功下载到 public/fonts/ 目录
- [ ] 文件大小正常（woff2 通常几百KB到几MB）
- [ ] 构建成功无错误
- [ ] Network 面板显示本地字体文件请求（状态 200）
- [ ] "精选博客" 等文字正确显示为衬线字体

## 风险与应对

| 风险 | 应对策略 |
|------|----------|
| 字体下载失败 | 尝试 npm 方案或霞鹜文楷 |
| 字体文件太大 | 仅下载 Bold 字重，不下载完整家族 |
| 构建后路径错误 | 使用绝对路径 `/fonts/xxx.woff2` |
| 浏览器缓存 | 使用 font-display: swap |

## 执行命令

```bash
# 开发服务器
npm run dev

# 构建验证
npm run build
```
