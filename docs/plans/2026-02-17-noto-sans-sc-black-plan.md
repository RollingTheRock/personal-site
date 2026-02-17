# 替换中文字体为思源黑体超粗体（Noto Sans SC Black）计划

## 日期
2026-02-17

## 背景
将现有的站酷小薇体 (ZCOOL XiaoWei) 替换为思源黑体超粗体（Noto Sans SC Black），打造更有力量感、更现代大气的视觉效果。

## 目标
1. 下载思源黑体 Black (900) 和 Bold (700) 字重
2. 替换 @font-face 规则（保留 Playfair Display）
3. 更新字体变量，将 Noto Sans SC 应用到 display 和 body
4. 配置不同字重和 letter-spacing
5. 验证字体正确显示

## 思源黑体特性

- **设计风格**: 现代无衬线、几何规整、力量感强
- **字形特点**: 笔画横平竖直，没有任何花哨装饰
- **超粗字重**: Black (900) 极具冲击力，适合大标题
- **适用场景**: 现代网站、科技产品、品牌展示
- **官方来源**: Google Noto CJK 项目
- **GitHub**: https://github.com/googlefonts/noto-cjk

## 实施方案

### Step 1: 下载字体文件

下载 Black (900) 和 Bold (700) 两个子集：

```bash
# Black 字重（最粗，用于主标题）
curl -L -o public/fonts/NotoSansSC-Black.otf "https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/SubsetOTF/SC/NotoSansSC-Black.otf"

# Bold 字重（用于副标题和卡片）
curl -L -o public/fonts/NotoSansSC-Bold.otf "https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/SubsetOTF/SC/NotoSansSC-Bold.otf"
```

备选 CDN：
```bash
curl -L -o public/fonts/NotoSansSC-Black.otf "https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk/Sans/SubsetOTF/SC/NotoSansSC-Black.otf"
```

### Step 2: 更新 @font-face

删除之前所有中文字体的 @font-face，替换为：

```css
/* 思源黑体 Black (900) */
@font-face {
  font-family: 'Noto Sans SC';
  src: url('/fonts/NotoSansSC-Black.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* 思源黑体 Bold (700) */
@font-face {
  font-family: 'Noto Sans SC';
  src: url('/fonts/NotoSansSC-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

保留 Playfair Display 的 @font-face 不变。

### Step 3: 更新字体变量

```css
--font-display: 'Playfair Display', 'Noto Sans SC', sans-serif;
--font-body: 'Noto Sans SC', system-ui, -apple-system, sans-serif;
```

### Step 4: 配置字重和样式

```css
/* Logo - 英文走 Playfair Display */
.logo {
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
}

/* 主标题 - 用 900 超粗 */
.hero-title {
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em;
}

/* 区域标题 - 用 900 超粗 */
.section-header h2 {
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em;
}

/* 卡片标题 - 用 700 粗体 */
.card-title {
  font-family: var(--font-display) !important;
  font-weight: 700 !important;
}

/* 文章标题 - 用 700 */
.post-card h3 {
  font-family: var(--font-display) !important;
  font-weight: 700 !important;
}

/* 正文 - 用 body 字体 */
body {
  font-family: var(--font-body);
  font-weight: 400;
}
```

**关键点：**
- `letter-spacing: 0.05em` 让中文超粗体更大气
- 不同元素使用不同字重（900 vs 700）形成层次

### Step 5: 清理旧字体文件

删除不再使用的字体文件：
- `public/fonts/ZCOOLXiaoWei-Regular.woff2`
- `public/fonts/ZCOOLXiaoWei-Latin.woff2`

## 文件变更清单

1. `public/fonts/` - 新增思源黑体字体文件，删除站酷小薇体
2. `src/styles/global.css` - 更新 @font-face、字体变量和样式

## 验证标准

- [ ] 思源黑体字体文件下载成功（每个 3-10MB）
- [ ] @font-face 规则正确设置（Black 900 + Bold 700）
- [ ] 构建成功无错误
- [ ] "精选博客" 等中文字符非常粗、有力量感
- [ ] 笔画规整，横平竖直，无花哨感
- [ ] 与 Playfair Display 形成中西对比但都很气势
- [ ] letter-spacing 让字体更大气
- [ ] Network 面板显示字体文件请求状态 200

## 预期视觉效果

思源黑体超粗体的视觉特征：
- 文字非常粗、非常有力量感
- 笔画规整，横平竖直
- 没有任何手写或花哨感
- 现代、大气、专业
- 与 Playfair Display 搭配形成中西对比

## 与其他字体的对比

| 特性 | 思源黑体 Black | 站酷小薇体 | 得意黑 |
|------|---------------|-----------|--------|
| 风格 | 现代无衬线、力量感 | 手写艺术、温度感 | 几何、动感 |
| 字形 | 规整、横平竖直 | 流畅、手写感 | 窄字宽、斜切 |
| 适用 | 科技、现代、专业 | 艺术、创意、个人 | 科技、年轻化 |
| 字重 | Black (900) 极具冲击力 | Regular 单一 | Regular 单一 |

## 执行命令

```bash
# 开发服务器
npm run dev

# 构建验证
npm run build
```
