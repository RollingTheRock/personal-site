# 替换中文字体为 ZCOOL XiaoWei（站酷小薇体）计划

## 日期
2026-02-17

## 背景
将现有的得意黑 (Smiley Sans) 替换为 ZCOOL XiaoWei（站酷小薇体），这是一款具有几何设计感和独特笔画切割风格的中文字体。

## 目标
1. 下载站酷小薇体字体文件
2. 替换 @font-face 规则（保留 Playfair Display）
3. 更新字体变量
4. 验证字体正确显示

## 站酷小薇体字体特性

- **设计风格**: 几何感、现代、独特的笔画切割
- **字形特点**: 笔画带有切割风格，设计感强
- **适用场景**: 标题、品牌展示
- **官方来源**: Google Fonts
- **GitHub**: https://github.com/googlefonts/zcool-xiaowei

## 实施方案

### Step 1: 下载字体文件

尝试方案 A（GitHub Raw）：
```bash
curl -L -o public/fonts/ZCOOLXiaoWei-Regular.ttf "https://raw.githubusercontent.com/googlefonts/zcool-xiaowei/main/fonts/ttf/ZCOOLXiaoWei-Regular.ttf"
```

方案 B（jsDelivr CDN，备选）：
```bash
curl -L -o public/fonts/ZCOOLXiaoWei-Regular.ttf "https://cdn.jsdelivr.net/gh/googlefonts/zcool-xiaowei/fonts/ttf/ZCOOLXiaoWei-Regular.ttf"
```

### Step 2: 更新 @font-face

删除 Smiley Sans 的 @font-face，替换为：

```css
@font-face {
  font-family: 'ZCOOL XiaoWei';
  src: url('/fonts/ZCOOLXiaoWei-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

保留 Playfair Display 的 @font-face 不变。

### Step 3: 更新字体变量

```css
--font-display: 'Playfair Display', 'ZCOOL XiaoWei', Georgia, serif;
--font-body: system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### Step 4: 清理旧字体文件

删除不再使用的得意黑字体文件：
- `public/fonts/SmileySans-Oblique.ttf`
- `public/fonts/SmileySans-Oblique.woff2`

### Step 5: 验证字体应用

使用 `font-family: var(--font-display) !important` 的元素：
1. **Logo** - "RollingTheRock"（英文 → Playfair Display）
2. **Hero 主标题** - "一名热爱技术的开发者"（中文 → 站酷小薇体）
3. **区域标题** - "精选博客"、"精选项目"、"订阅更新"（中文 → 站酷小薇体）
4. **卡片标题** - "Blog"、"Projects"、"Videos"（英文 → Playfair Display）

## 文件变更清单

1. `public/fonts/` - 新增站酷小薇体字体文件，删除得意黑字体
2. `src/styles/global.css` - 更新 @font-face 和字体变量

## 验证标准

- [ ] 站酷小薇体字体文件下载成功（文件大小 3-15MB）
- [ ] @font-face 规则正确设置
- [ ] 构建成功无错误
- [ ] "精选博客" 等中文字符显示为站酷小薇体（几何切割风格）
- [ ] 英文 Logo 仍使用 Playfair Display
- [ ] Network 面板显示字体文件请求状态 200

## 预期视觉效果

站酷小薇体的视觉特征：
- 文字有明显的几何设计感
- 笔画带有独特的切割风格
- 现代、简洁但有个性
- 中文如"精选博客"会呈现与得意黑不同的设计感

## 执行命令

```bash
# 开发服务器
npm run dev

# 构建验证
npm run build
```
