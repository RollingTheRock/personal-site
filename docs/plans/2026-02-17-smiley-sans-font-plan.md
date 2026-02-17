# 替换中文字体为得意黑 (Smiley Sans) 计划

## 日期
2026-02-17

## 背景
将现有的 Noto Serif SC（思源宋体）替换为得意黑 (Smiley Sans)，这是一款几何、斜切风格的现代中文字体，具有独特的视觉识别度。

## 目标
1. 下载得意黑字体文件
2. 替换 @font-face 规则（保留 Playfair Display）
3. 更新字体变量
4. 应用到指定元素
5. 验证字体正确显示

## 得意黑字体特性

- **设计风格**: 几何感、微倾斜（Oblique）、现代简洁
- **字形特点**: 大弧度、窄字宽、斜切造型
- **适用场景**: 标题、品牌展示
- **官方仓库**: https://github.com/atelier-anchor/smiley-sans

## 实施方案

### Step 1: 下载得意黑字体

尝试方案 A（GitHub Releases）：
```bash
curl -L -o /tmp/smiley-sans.zip "https://github.com/atelier-anchor/smiley-sans/releases/download/v2.0.1/smiley-sans-v2.0.1.zip"
unzip /tmp/smiley-sans.zip -d /tmp/smiley-sans
cp /tmp/smiley-sans/SmileySans-Oblique.ttf public/fonts/
```

方案 B（jsDelivr CDN，备选）：
```bash
curl -L -o public/fonts/SmileySans-Oblique.ttf "https://cdn.jsdelivr.net/gh/atelier-anchor/smiley-sans@main/dist/SmileySans-Oblique.ttf"
```

### Step 2: 更新 @font-face

删除 Noto Serif SC 的 @font-face，替换为：

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

保留 Playfair Display 的 @font-face 不变。

### Step 3: 更新字体变量

```css
--font-display: 'Playfair Display', 'Smiley Sans', Georgia, serif;
--font-body: system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### Step 4: 应用字体

使用 `font-family: var(--font-display) !important` 应用到：

1. **Logo** - "RollingTheRock"（英文 → Playfair Display）
2. **Hero 主标题** - "一名热爱技术的开发者"（中文 → 得意黑）
3. **区域标题** - "精选博客"、"精选项目"、"订阅更新"（中文 → 得意黑）
4. **卡片标题** - "Blog"、"Projects"、"Videos"（英文 → Playfair Display）

### Step 5: 清理旧字体文件

删除不再使用的 Noto Serif SC 字体文件：
- `public/fonts/NotoSerifSC-Bold.otf`

## 文件变更清单

1. `public/fonts/` - 新增得意黑字体文件，删除 Noto Serif SC
2. `src/styles/global.css` - 更新 @font-face 和字体变量
3. 组件文件（可能无需修改，因为样式类已使用 font-display）

## 验证标准

- [ ] 得意黑字体文件下载成功（文件大小 3-10MB）
- [ ] @font-face 规则正确设置
- [ ] 构建成功无错误
- [ ] "精选博客" 等中文字符显示为得意黑（几何斜切风格）
- [ ] 英文 Logo 仍使用 Playfair Display
- [ ] Network 面板显示字体文件请求状态 200

## 预期视觉效果

得意黑的视觉特征：
- 文字有明显的几何感
- 笔画粗细对比明显
- 微倾斜（Oblique）设计，不需要额外设置 italic
- 中文如"精选博客"会呈现现代、动感的视觉效果

## 执行命令

```bash
# 开发服务器
npm run dev

# 构建验证
npm run build
```
