/**
 * Markdown → Notion 迁移脚本
 *
 * 将本地 Markdown 文件迁移到 Notion 数据库
 * 运行: npx tsx scripts/migrate-to-notion.ts
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// 从 .env 文件加载环境变量
import { config } from 'dotenv';
config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_API = 'https://api.notion.com/v1';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

// 延迟函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 验证环境变量
function validateEnv() {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    console.error('错误: 请确保 .env 文件中设置了 NOTION_TOKEN 和 NOTION_DATABASE_ID');
    process.exit(1);
  }
}

/**
 * 创建数据库页面（文章元数据）
 */
async function createDatabaseEntry(properties: any) {
  const url = `${NOTION_API}/pages`;

  const body = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`创建页面失败: ${res.status} - ${error}`);
  }

  return res.json();
}

/**
 * 追加 blocks 到页面
 */
async function appendBlocks(pageId: string, blocks: any[]) {
  const url = `${NOTION_API}/blocks/${pageId}/children`;

  // Notion API 限制：每次最多 100 个 blocks
  const batchSize = 100;
  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ children: batch }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`追加 blocks 失败: ${res.status} - ${error}`);
    }

    // 速率限制：每批后等待 350ms
    if (i + batchSize < blocks.length) {
      await sleep(350);
    }
  }
}

/**
 * 解析 rich text（支持 **bold**, *italic*, `code`, [link](url)）
 */
function parseRichText(text: string): any[] {
  const richText: any[] = [];
  let remaining = text;

  // 正则匹配顺序很重要：先匹配链接，再匹配代码，然后是粗体/斜体
  const patterns = [
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' },      // [text](url)
    { regex: /`([^`]+)`/g, type: 'code' },                    // `code`
    { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },             // **bold**
    { regex: /__([^_]+)__/g, type: 'bold' },                 // __bold__
    { regex: /\*([^*]+)\*/g, type: 'italic' },              // *italic*
    { regex: /_([^_]+)_/g, type: 'italic' },                // _italic_
    { regex: /~~([^~]+)~~/g, type: 'strikethrough' },      // ~~strikethrough~~
  ];

  // 简单处理：如果没有特殊格式，直接返回纯文本
  const hasSpecialFormat = patterns.some(p => p.regex.test(text));
  if (!hasSpecialFormat) {
    return [{ type: 'text', text: { content: text } }];
  }

  // 重置正则
  patterns.forEach(p => p.regex.lastIndex = 0);

  // 分段处理
  const segments: Array<{ content: string; annotations?: any; link?: string }> = [];
  let lastIndex = 0;

  // 找到所有匹配位置
  const matches: Array<{ start: number; end: number; content: string; type: string; url?: string }> = [];

  // 链接
  let match;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = linkRegex.exec(text)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, content: match[1], type: 'link', url: match[2] });
  }

  // 代码
  const codeRegex = /`([^`]+)`/g;
  while ((match = codeRegex.exec(text)) !== null) {
    if (!matches.some(m => m.start <= match!.index && m.end >= match!.index + match![0].length)) {
      matches.push({ start: match.index, end: match.index + match[0].length, content: match[1], type: 'code' });
    }
  }

  // 粗体
  const boldRegex = /\*\*([^*]+)\*\*/g;
  while ((match = boldRegex.exec(text)) !== null) {
    if (!matches.some(m => m.start < match!.index + match![0].length && m.end > match!.index)) {
      matches.push({ start: match.index, end: match.index + match[0].length, content: match[1], type: 'bold' });
    }
  }

  // 斜体
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g;
  while ((match = italicRegex.exec(text)) !== null) {
    if (!matches.some(m => m.start < match!.index + match![0].length && m.end > match!.index)) {
      matches.push({ start: match.index, end: match.index + match[0].length, content: match[1], type: 'italic' });
    }
  }

  // 按位置排序
  matches.sort((a, b) => a.start - b.start);

  // 合并重叠的匹配
  const mergedMatches: typeof matches = [];
  for (const m of matches) {
    const last = mergedMatches[mergedMatches.length - 1];
    if (last && m.start < last.end) {
      // 重叠，跳过
      continue;
    }
    mergedMatches.push(m);
  }

  // 构建 segments
  lastIndex = 0;
  for (const m of mergedMatches) {
    if (m.start > lastIndex) {
      segments.push({ content: text.slice(lastIndex, m.start) });
    }

    const annotations: any = {};
    if (m.type === 'bold') annotations.bold = true;
    if (m.type === 'italic') annotations.italic = true;
    if (m.type === 'code') annotations.code = true;
    if (m.type === 'strikethrough') annotations.strikethrough = true;

    segments.push({
      content: m.content,
      annotations: Object.keys(annotations).length > 0 ? annotations : undefined,
      link: m.url,
    });

    lastIndex = m.end;
  }

  if (lastIndex < text.length) {
    segments.push({ content: text.slice(lastIndex) });
  }

  // 转换为 Notion rich text 格式
  return segments.map(seg => {
    const result: any = {
      type: 'text',
      text: {
        content: seg.content,
      },
    };

    if (seg.link) {
      result.text.link = { url: seg.link };
    }

    if (seg.annotations) {
      result.annotations = seg.annotations;
    }

    return result;
  });
}

/**
 * Markdown → Notion Blocks 转换
 */
function markdownToBlocks(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 空行跳过
    if (!trimmed) {
      i++;
      continue;
    }

    // 代码块
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      // 语言名称映射
      const langMap: Record<string, string> = {
        'cpp': 'c++',
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'rb': 'ruby',
        'sh': 'shell',
        'yml': 'yaml',
        'md': 'markdown',
        'txt': 'plain text',
      };
      const notionLang = langMap[lang] || lang || 'plain text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: codeLines.join('\n') } }],
          language: notionLang,
        },
      });
      i++;
      continue;
    }

    // 标题
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const type = `heading_${level}` as const;
      blocks.push({
        object: 'block',
        type,
        [type]: {
          rich_text: parseRichText(text),
        },
      });
      i++;
      continue;
    }

    // 无序列表
    if (trimmed.match(/^[-*+]\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*+]\s/)) {
        listItems.push(lines[i].trim().replace(/^[-*+]\s/, ''));
        i++;
      }
      for (const item of listItems) {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: parseRichText(item),
          },
        });
      }
      continue;
    }

    // 有序列表
    if (trimmed.match(/^\d+\.\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      for (const item of listItems) {
        blocks.push({
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: parseRichText(item),
          },
        });
      }
      continue;
    }

    // 引用
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: parseRichText(quoteLines.join('\n')),
        },
      });
      continue;
    }

    // 分割线
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {},
      });
      i++;
      continue;
    }

    // 图片 ![alt](url) - 跳过本地路径
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      const [, alt, url] = imageMatch;
      // 跳过本地图片路径（以 /assets/images/ 开头但不以 http 开头）
      if (!url.startsWith('http') && (url.startsWith('/assets/') || url.startsWith('./') || url.startsWith('../'))) {
        console.log(`  跳过本地图片: ${url}`);
        i++;
        continue;
      }
      blocks.push({
        object: 'block',
        type: 'image',
        image: {
          type: 'external',
          external: { url },
          caption: alt ? [{ type: 'text', text: { content: alt } }] : [],
        },
      });
      i++;
      continue;
    }

    // 段落（默认）
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: parseRichText(trimmed),
      },
    });
    i++;
  }

  return blocks;
}

/**
 * 迁移单个文件
 */
async function migrateFile(filePath: string, type: '博客' | '项目') {
  const fileName = path.basename(filePath, '.md');
  const content = await fs.readFile(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  console.log(`\n迁移: ${fileName} (${type})`);
  console.log(`  标题: ${frontmatter.title}`);

  // 构建属性
  const properties: any = {
    '标题': {
      title: [{ text: { content: frontmatter.title } }],
    },
    'Slug': {
      rich_text: [{ text: { content: fileName } }],
    },
    '摘要': {
      rich_text: [{ text: { content: frontmatter.description || '' } }],
    },
    '发布日期': {
      date: { start: frontmatter.date.toISOString().split('T')[0] },
    },
    '类型': {
      select: { name: type },
    },
    '状态': {
      status: { name: '✅ 已发布' },
    },
  };

  // 可选属性
  const categories = frontmatter.categories || frontmatter.tech;
  if (categories?.length) {
    properties['分类'] = {
      multi_select: categories.map((c: string) => ({ name: c })),
    };
  }

  const tags = frontmatter.tags || frontmatter.tech;
  if (tags?.length) {
    properties['标签'] = {
      multi_select: tags.map((t: string) => ({ name: t })),
    };
  }

  if (frontmatter.featured !== undefined) {
    properties['置顶'] = {
      checkbox: frontmatter.featured,
    };
  }

  if (frontmatter.image) {
    properties['封面图'] = {
      files: [{ type: 'external', name: 'cover', external: { url: frontmatter.image } }],
    };
  }

  // 创建页面
  const page = await createDatabaseEntry(properties);
  console.log(`  ✓ 创建页面: ${page.id}`);

  // 等待一下避免速率限制
  await sleep(350);

  // 转换并追加内容
  if (body.trim()) {
    const blocks = markdownToBlocks(body);
    console.log(`  追加 ${blocks.length} 个 blocks...`);
    await appendBlocks(page.id, blocks);
    console.log(`  ✓ 内容已追加`);
  }

  return page.id;
}

/**
 * 主函数
 */
async function main() {
  validateEnv();

  console.log('🚀 开始迁移 Markdown → Notion');
  console.log(`数据库 ID: ${NOTION_DATABASE_ID?.slice(0, 8)}...`);

  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const projectsDir = path.join(process.cwd(), 'src', 'content', 'projects');

  const results = {
    blogs: [] as string[],
    projects: [] as string[],
    errors: [] as string[],
  };

  // 迁移博客
  try {
    const blogFiles = await fs.readdir(blogDir);
    const mdFiles = blogFiles.filter(f => f.endsWith('.md'));

    console.log(`\n📄 发现 ${mdFiles.length} 篇博客文章`);

    for (const file of mdFiles) {
      try {
        const filePath = path.join(blogDir, file);
        const pageId = await migrateFile(filePath, '博客');
        results.blogs.push(pageId);
        await sleep(350); // 速率限制
      } catch (error) {
        console.error(`  ✗ 失败: ${error}`);
        results.errors.push(`${file}: ${error}`);
      }
    }
  } catch (error) {
    console.error('读取博客目录失败:', error);
  }

  // 迁移项目
  try {
    const projectFiles = await fs.readdir(projectsDir);
    const mdFiles = projectFiles.filter(f => f.endsWith('.md'));

    console.log(`\n📄 发现 ${mdFiles.length} 个项目`);

    for (const file of mdFiles) {
      try {
        const filePath = path.join(projectsDir, file);
        const pageId = await migrateFile(filePath, '项目');
        results.projects.push(pageId);
        await sleep(350); // 速率限制
      } catch (error) {
        console.error(`  ✗ 失败: ${error}`);
        results.errors.push(`${file}: ${error}`);
      }
    }
  } catch (error) {
    console.error('读取项目目录失败:', error);
  }

  // 汇总
  console.log('\n' + '='.repeat(50));
  console.log('✅ 迁移完成！');
  console.log(`博客: ${results.blogs.length} 篇`);
  console.log(`项目: ${results.projects.length} 个`);
  if (results.errors.length) {
    console.log(`错误: ${results.errors.length} 个`);
    results.errors.forEach(e => console.log(`  - ${e}`));
  }
  console.log('='.repeat(50));
}

main().catch(console.error);
