# 字体问题修复计划

## 日期
2026-02-17

## 背景
当前网站字体配置存在问题，需要统一和规范字体使用，确保 Playfair Display 和 Noto Serif SC 正确加载和应用。

## 目标
修复字体配置，确保：
1. Google Fonts 正确引入（包含正确的字重）
2. 字体变量统一定义
3. 指定元素正确应用衬线字体
4. 验证字体实际加载

## 当前状态分析

### 已配置（global.css）
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:wght@400;600;700;900&display=swap');

--font-serif: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
--font-sans: 'Inter', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### 需要修改的地方

#### 1. 更新 Google Fonts 引入
当前引入的 Noto Serif SC 只有 400, 600, 700 字重，需要添加 900 字重。
需要添加 preconnect 优化加载。

#### 2. 添加新的字体变量
```css
--font-display: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
```

#### 3. 应用字体的元素
| 元素 | 当前字体 | 目标字体 |
|------|---------|---------|
| Logo "RollingTheRock" | 未知 | var(--font-display) |
| "一名热爱技术的开发者" | 内联样式 | var(--font-display) |
| "精选博客" 标题 | Playfair Display | var(--font-display) |
| "精选项目" 标题 | 无 | var(--font-display) |
| "订阅更新" 标题 | font-serif | var(--font-display) |
| 卡片 "Blog/Projects/Videos" | 无 | var(--font-display) |

## 执行步骤

### Step 1: 更新 BaseLayout.astro
- 添加 Google Fonts preconnect 链接
- 确保字体加载优化

### Step 2: 更新 global.css
- 更新 Google Fonts URL（添加 Noto Serif SC 900 字重）
- 添加 --font-display 和 --font-body 变量
- 添加 .font-display 工具类

### Step 3: 更新各组件
1. **Logo.astro** - 应用 font-display
2. **HeroSection.astro** - 主标题应用 font-display
3. **FeaturedPosts.astro** - 标题已应用，检查确认
4. **FeaturedProjects.astro** - 标题应用 font-display
5. **Subscribe.astro** - 标题应用 font-display
6. **CategoryCards.astro** - 卡片标题应用 font-display

### Step 4: 验证
- 构建项目
- 启动开发服务器
- 使用 DevTools 检查 Logo 元素的 computed font-family
- 确认显示为 Playfair Display 而非 fallback

## 文件变更清单

1. `src/layouts/BaseLayout.astro` - 添加 preconnect
2. `src/styles/global.css` - 更新字体引入和变量
3. `src/components/Logo.astro` - 应用字体
4. `src/components/HeroSection.astro` - 应用字体
5. `src/components/FeaturedProjects.astro` - 应用字体
6. `src/components/Subscribe.astro` - 应用字体
7. `src/components/CategoryCards.astro` - 应用字体

## 验证标准
- [ ] Logo 元素 computed font-family 显示 "Playfair Display"
- [ ] 主标题 "一名热爱技术的开发者" 使用衬线字体
- [ ] 所有 section 标题使用衬线字体
- [ ] 分类卡片标题使用衬线字体
- [ ] 无字体加载失败警告
