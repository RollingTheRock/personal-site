/**
 * Notion Blocks to HTML/Markdown renderer
 * Handles common blog block types
 */

interface RichText {
  type: string;
  text?: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  plain_text?: string;
  href?: string | null;
}

/**
 * Render rich text array to HTML
 */
function renderRichText(richText: RichText[]): string {
  if (!richText || richText.length === 0) return '';

  return richText.map((rt) => {
    let content = rt.plain_text || rt.text?.content || '';

    // Escape HTML
    content = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const annotations = rt.annotations || {};

    // Apply annotations
    if (annotations.code) content = `<code>${content}</code>`;
    if (annotations.bold) content = `<strong>${content}</strong>`;
    if (annotations.italic) content = `<em>${content}</em>`;
    if (annotations.strikethrough) content = `<del>${content}</del>`;
    if (annotations.underline) content = `<u>${content}</u>`;

    // Handle links
    if (rt.href) {
      content = `<a href="${rt.href}" class="text-link">${content}</a>`;
    } else if (rt.text?.link?.url) {
      content = `<a href="${rt.text.link.url}" class="text-link">${content}</a>`;
    }

    // Handle color (skip default)
    if (annotations.color && annotations.color !== 'default') {
      const colorClass = annotations.color.replace('_', '-');
      content = `<span class="text-${colorClass}">${content}</span>`;
    }

    return content;
  }).join('');
}

/**
 * Render a single block to HTML
 */
function renderBlock(block: any, level: number = 0): string {
  if (!block) return '';

  const type = block.type;
  const content = block[type];

  if (!content) return '';

  const indent = '  '.repeat(level);

  switch (type) {
    case 'paragraph':
      const text = renderRichText(content.rich_text || []);
      return text ? `${indent}<p>${text}</p>\n` : `${indent}<p></p>\n`;

    case 'heading_1':
      return `${indent}<h1>${renderRichText(content.rich_text || [])}</h1>\n`;

    case 'heading_2':
      return `${indent}<h2>${renderRichText(content.rich_text || [])}</h2>\n`;

    case 'heading_3':
      return `${indent}<h3>${renderRichText(content.rich_text || [])}</h3>\n`;

    case 'bulleted_list_item': {
      const itemText = renderRichText(content.rich_text || []);
      const children = block.children ? renderBlocks(block.children, level + 1) : '';
      return `${indent}<li>${itemText}${children}</li>\n`;
    }

    case 'numbered_list_item': {
      const numText = renderRichText(content.rich_text || []);
      const children = block.children ? renderBlocks(block.children, level + 1) : '';
      return `${indent}<li>${numText}${children}</li>\n`;
    }

    case 'code': {
      const code = content.rich_text?.map((rt: RichText) => rt.plain_text || rt.text?.content || '').join('') || '';
      const language = content.language || 'text';
      // Escape HTML in code
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `${indent}<pre><code class="language-${language}">${escapedCode}</code></pre>\n`;
    }

    case 'image': {
      let url = '';
      let caption = '';

      if (content.type === 'external') {
        url = content.external?.url || '';
      } else if (content.type === 'file') {
        url = content.file?.url || '';
      }

      caption = content.caption?.map((rt: RichText) => rt.plain_text || rt.text?.content || '').join('') || '';

      if (!url) return '';

      const captionHtml = caption ? `\n${indent}  <figcaption>${caption}</figcaption>` : '';
      return `${indent}<figure>\n${indent}  <img src="${url}" alt="${caption}" loading="lazy" />${captionHtml}\n${indent}</figure>\n`;
    }

    case 'quote':
      return `${indent}<blockquote>\n${indent}  <p>${renderRichText(content.rich_text || [])}</p>\n${indent}</blockquote>\n`;

    case 'callout': {
      const calloutText = renderRichText(content.rich_text || []);
      const icon = content.icon?.emoji || '💡';
      const color = content.color || 'gray_background';
      return `${indent}<div class="callout callout-${color}">\n${indent}  <span class="callout-icon">${icon}</span>\n${indent}  <div class="callout-content">${calloutText}</div>\n${indent}</div>\n`;
    }

    case 'divider':
      return `${indent}<hr />\n`;

    case 'to_do': {
      const checked = content.checked ? 'checked' : '';
      const todoText = renderRichText(content.rich_text || []);
      return `${indent}<div class="todo-item">\n${indent}  <input type="checkbox" ${checked} disabled />\n${indent}  <span class="todo-text ${checked ? 'todo-done' : ''}">${todoText}</span>\n${indent}</div>\n`;
    }

    case 'toggle': {
      const toggleText = renderRichText(content.rich_text || []);
      const toggleChildren = block.children ? renderBlocks(block.children, level + 1) : '';
      return `${indent}<details class="toggle-block">\n${indent}  <summary>${toggleText}</summary>\n${indent}  <div class="toggle-content">\n${toggleChildren}${indent}  </div>\n${indent}</details>\n`;
    }

    case 'bookmark': {
      const bookmarkUrl = content.url || '';
      return `${indent}<div class="bookmark">\n${indent}  <a href="${bookmarkUrl}" target="_blank" rel="noopener noreferrer">\n${indent}    <div class="bookmark-url">${bookmarkUrl}</div>\n${indent}  </a>\n${indent}</div>\n`;
    }

    case 'embed': {
      const embedUrl = content.url || '';
      // Simple embed - just link for now, can be enhanced for specific platforms
      return `${indent}<div class="embed">\n${indent}  <a href="${embedUrl}" target="_blank" rel="noopener noreferrer">${embedUrl}</a>\n${indent}</div>\n`;
    }

    case 'video': {
      let videoUrl = '';
      if (content.type === 'external') {
        videoUrl = content.external?.url || '';
      } else if (content.type === 'file') {
        videoUrl = content.file?.url || '';
      }
      if (!videoUrl) return '';
      return `${indent}<div class="video-embed">\n${indent}  <a href="${videoUrl}" target="_blank" rel="noopener noreferrer">Video: ${videoUrl}</a>\n${indent}</div>\n`;
    }

    case 'file': {
      let fileUrl = '';
      let fileName = '';
      if (content.type === 'external') {
        fileUrl = content.external?.url || '';
      } else if (content.type === 'file') {
        fileUrl = content.file?.url || '';
      }
      fileName = content.name || 'File';
      if (!fileUrl) return '';
      return `${indent}<div class="file-attachment">\n${indent}  <a href="${fileUrl}" target="_blank" rel="noopener noreferrer">📎 ${fileName}</a>\n${indent}</div>\n`;
    }

    case 'link_to_page': {
      const pageId = content.page_id || '';
      return `${indent}<div class="link-to-page">\n${indent}  <a href="/blog/${pageId}">→ Link to page</a>\n${indent}</div>\n`;
    }

    case 'equation':
      // LaTeX equation - will be handled by KaTeX
      return `${indent}<div class="equation">\\[${content.expression}\\]</div>\n`;

    case 'table': {
      const tableChildren = block.children || [];
      const rows = tableChildren.map((row: any) => {
        const cells = row.table_row?.cells || [];
        const cellHtml = cells.map((cell: RichText[]) => `<td>${renderRichText(cell)}</td>`).join('');
        return `${indent}  <tr>${cellHtml}</tr>`;
      }).join('\n');
      return `${indent}<table class="notion-table">\n${indent}  <tbody>\n${rows}\n${indent}  </tbody>\n${indent}</table>\n`;
    }

    case 'table_of_contents':
      // Skip - we'll generate TOC separately if needed
      return '';

    case 'breadcrumb':
      // Skip
      return '';

    case 'unsupported':
      console.warn(`Unsupported block type: ${type}`);
      return `${indent}<!-- Unsupported block: ${type} -->\n`;

    default:
      console.warn(`Unknown block type: ${type}`);
      // Try to render any rich text as paragraph
      if (content.rich_text) {
        return `${indent}<p>${renderRichText(content.rich_text)}</p>\n`;
      }
      return `${indent}<!-- Unknown block: ${type} -->\n`;
  }
}

/**
 * Group consecutive list items into proper list structure
 */
function groupListItems(blocks: any[]): any[] {
  const result: any[] = [];
  let currentList: { type: string; items: any[] } | null = null;

  for (const block of blocks) {
    const type = block.type;

    if (type === 'bulleted_list_item') {
      if (!currentList || currentList.type !== 'ul') {
        // Start new bulleted list
        if (currentList) {
          result.push({ type: currentList.type, items: currentList.items });
        }
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(block);
    } else if (type === 'numbered_list_item') {
      if (!currentList || currentList.type !== 'ol') {
        // Start new numbered list
        if (currentList) {
          result.push({ type: currentList.type, items: currentList.items });
        }
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(block);
    } else {
      // Not a list item - flush current list if any
      if (currentList) {
        result.push({ type: currentList.type, items: currentList.items });
        currentList = null;
      }
      result.push(block);
    }
  }

  // Don't forget the last list
  if (currentList) {
    result.push({ type: currentList.type, items: currentList.items });
  }

  return result;
}

/**
 * Render grouped list structure
 */
function renderGroupedBlock(block: any, level: number = 0): string {
  if (block.type === 'ul' || block.type === 'ol') {
    const tag = block.type === 'ul' ? 'ul' : 'ol';
    const items = block.items.map((item: any) => renderBlock(item, level + 1)).join('');
    const indent = '  '.repeat(level);
    return `${indent}<${tag}>\n${items}${indent}</${tag}>\n`;
  }
  return renderBlock(block, level);
}

/**
 * Render blocks to HTML string
 */
export function renderBlocks(blocks: any[], level: number = 0): string {
  if (!blocks || blocks.length === 0) return '';

  // Group consecutive list items
  const grouped = groupListItems(blocks);

  return grouped.map(block => renderGroupedBlock(block, level)).join('');
}

/**
 * Convert Notion blocks to HTML string (main entry point)
 */
export function blocksToHtml(blocks: any[]): string {
  return renderBlocks(blocks);
}
