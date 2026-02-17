---
title: "AI 日报邮件系统"
description: "自动收集 AI 领域最新论文、博客和新闻，每日发送摘要邮件"
date: 2026-02-01
image: "/assets/images/project-ai-daily.jpg"
github: "https://github.com/RollingTheRock/ai-daily-digest"
demo: "https://github.com/RollingTheRock/ai-daily-digest"
tech: ["Python", "GitHub Actions", "SMTP"]
featured: true
---

AI 日报邮件系统是一个自动化工具，用于收集 AI 领域的最新动态并发送摘要邮件。

## 功能特性

- **多数据源**：arXiv、HackerNews、Reddit r/MachineLearning
- **智能摘要**：使用 DeepSeek API 生成中文摘要
- **定时发送**：GitHub Actions 每日自动运行
- **可定制**：支持自定义 RSS 源和邮件模板

## 技术实现

项目使用 Python 开发，通过 GitHub Actions 实现定时任务，支持多种 LLM 提供商。
