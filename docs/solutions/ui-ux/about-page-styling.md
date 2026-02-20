# 关于页样式改造方案

## 改造概述
轻量改造，仅 4 处样式调整，使用品牌紫色 `#A855F7` 对齐全站视觉。

## 改造内容

### 1. 时间线圆点颜色
```astro
<!-- 改为紫色 -->
<div class="... bg-[#A855F7] ...">
```

### 2. 社交按钮 hover 效果
```astro
<!-- 添加 social-btn 类 -->
<a class="social-btn ...">GitHub</a>
<a class="social-btn ...">Twitter</a>
<a class="social-btn ...">Email</a>
```

```css
.social-btn:hover {
  border-color: #A855F7;
  color: #A855F7;
  background: rgba(168, 85, 247, 0.1);
}
```

### 3. 联系按钮 hover 效果
```astro
<!-- 添加 contact-btn 类 -->
<a class="contact-btn ...">发送邮件</a>
<a class="contact-btn ...">订阅 RSS</a>
```

```css
.contact-btn:hover {
  border-color: #A855F7;
  color: #A855F7;
  background: rgba(168, 85, 247, 0.1);
}
```

### 4. 正文链接 hover
```astro
<a href="/rss.xml" class="... hover:text-[#A855F7] ...">RSS</a>
```

## 保持不变的
- 页眉布局（居中头像+姓名）
- 技术标签样式（胶囊分组）
- 区块标题（中文）
- 页面布局结构
- 所有文字内容

## 全站品牌色总结

| 页面 | 品牌色 |
|------|--------|
| 博客 | `#A855F7` (紫色) |
| 项目 | `#06B6D4` (青色) |
| 视频 | `#F97316` (橙色) |
| 关于 | `#A855F7` (紫色，默认) |
