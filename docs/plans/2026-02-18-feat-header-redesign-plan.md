# 导航栏 Header 改造计划

## 概述

改造全局导航栏组件，使其风格与首页的复古杂志感统一，同时去掉主题切换功能。

---

## 当前状态分析

### 涉及文件

1. `src/components/Header.astro` - 导航栏主组件
2. `src/components/MobileMenu.astro` - 移动端汉堡菜单（如有）
3. `src/layouts/BaseLayout.astro` - 基础布局（可能有主题切换逻辑）
4. `src/styles/global.css` - 全局样式（可能有主题相关代码）

### 当前导航栏结构

- Logo: "RollingTheRock"（普通无衬线字体）
- 导航链接: 首页/博客/项目/视频/关于
- 搜索框: 输入框 + 快捷键提示
- 主题切换: 太阳☀️/月亮🌙/显示器🖥️ 图标

---

## 改动详述

### 改动 1：Logo 字体改造

**当前:** 普通无衬线字体的 "RollingTheRock"

**改为:**
- 字体: Playfair Display，italic
- 字号: 22px（精致感）
- 字重: 700 (bold)
- 颜色: 纯白 #ffffff
- hover: opacity 0.8 → 1

```css
.nav-logo {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 700;
  font-size: 22px;
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.3s ease;
}
.nav-logo:hover {
  opacity: 0.8;
}
```

### 改动 2：去掉主题切换

- 移除导航栏中的主题切换图标/按钮
- 移除相关的主题切换 JS 逻辑
- 将主题锁定为深色模式
- 清理 `BaseLayout.astro` 中的主题切换代码:
  - 移除 localStorage 读取/写入主题的逻辑
  - 移除 `<html>` 标签上动态添加 class 的逻辑
  - 确保 `<html>` 标签始终有 `class="dark"`

### 改动 3：导航链接样式微调

```css
.nav-link {
  font-size: 14px;
  color: #9CA3AF;
  text-decoration: none;
  transition: color 0.3s ease;
}
.nav-link:hover {
  color: #ffffff;
}
.nav-link.active {
  color: #ffffff;
}
```

- 灰色默认 → 白色 hover/active
- 无品牌色、无下划线、无背景色

### 改动 4：搜索图标简化

- 只保留搜索图标（🔍 或 SVG 放大镜）
- 移除输入框和快捷键文字提示
- 图标颜色: #9CA3AF，hover 变白色

### 改动 5：保留毛玻璃效果

保留现有的:
- position: sticky
- backdrop-filter: blur(...)
- 背景色带透明度

### 改动 6：移动端菜单同步

- Logo 字体同步改为 Playfair Display italic
- 去掉主题切换选项

---

## 文件清单

| 序号 | 文件路径 | 修改类型 |
|-----|---------|---------|
| 1 | `src/components/Header.astro` | 修改：Logo、导航链接、搜索、去掉主题切换 |
| 2 | `src/components/MobileMenu.astro` | 修改：Logo、去掉主题切换 |
| 3 | `src/layouts/BaseLayout.astro` | 修改：去掉主题切换 JS 逻辑，锁定 dark 模式 |

---

## 验收标准

1. [x] Logo "RollingTheRock" 使用 Playfair Display italic，22px，白色
2. [x] 主题切换图标/按钮已移除，页面锁定深色模式
3. [x] 不存在主题切换相关的 JS 逻辑残留
4. [x] 导航链接：灰色默认 → 白色 hover/active，14px
5. [x] 搜索区域简洁，只保留图标
6. [x] 滚动时 sticky + 毛玻璃效果正常工作
7. [x] 移动端汉堡菜单同步更新
8. [x] 所有过渡动画 transition: 0.3s ease

---

## 实施步骤

1. 修改 `Header.astro` - Logo、导航链接、搜索、去掉主题切换
2. 修改 `MobileMenu.astro` - Logo、去掉主题切换
3. 修改 `BaseLayout.astro` - 清理主题切换逻辑，锁定 dark 模式
4. 测试验证所有功能
