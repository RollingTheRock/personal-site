# 导航栏 Header 改造

## 背景

将全局导航栏改造为复古杂志风格，与首页设计统一，同时移除主题切换功能。

## 核心改动

### 1. Logo 字体改造

**之前:**
```astro
<a href="/" class="text-xl font-semibold font-serif tracking-tight">
  {SITE_TITLE}
</a>
```

**之后:**
```css
.nav-logo {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 700;
  font-size: 22px;
  color: #ffffff;
}
.nav-logo:hover {
  opacity: 0.8;
}
```

### 2. 移除主题切换

**清理的文件:**
- `Header.astro`: 移除 `ThemeToggle` 导入和使用
- `MobileMenu.astro`: 移除主题切换按钮和 JS 逻辑
- `BaseLayout.astro`: 移除主题切换脚本

**锁定深色模式:**
```astro
<html lang="zh-CN" class="dark" data-theme="dark">
```

### 3. 导航链接样式

**之前:**
- 当前页面: 背景色高亮 + 文字颜色变化
- hover: 背景色变化

**之后:**
```css
.nav-link {
  font-size: 14px;
  color: #9CA3AF;  /* 灰色 */
  transition: color 0.3s ease;
}
.nav-link:hover {
  color: #ffffff;  /* 白色 */
}
.nav-link.active {
  color: #ffffff;  /* 白色 */
}
```

### 4. 搜索图标简化

**之前:** 图标 + "搜索..." 文字 + ⌘K 快捷键

**之后:** 纯图标
```astro
<button class="p-2 text-[var(--text-muted)] hover:text-white">
  <svg>...搜索图标...</svg>
</button>
```

### 5. 移动端菜单同步

- 移除主题切换按钮
- hover 颜色统一为白色

## 保留的特性

- 滚动时 sticky + 毛玻璃效果 (`backdrop-blur-md`)
- 深色主题样式
- ESC 键关闭移动端菜单

## 经验总结

1. **彻底清理**: 主题切换涉及多个文件，需要全面检查
2. **颜色统一**: 使用 CSS 变量而非硬编码，便于维护
3. **简洁设计**: 导航栏保持克制，只用灰白两色
4. **字体选择**: Playfair Display italic 增加复古杂志感

## 相关文件

- `src/components/Header.astro` - 导航栏主组件
- `src/components/MobileMenu.astro` - 移动端菜单
- `src/components/SearchModal.astro` - 搜索弹窗
- `src/layouts/BaseLayout.astro` - 基础布局
