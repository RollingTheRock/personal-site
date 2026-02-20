// Notion API client using native fetch
// Avoids bundling issues with @notionhq/client in Astro static builds

export const NOTION_TOKEN = import.meta.env?.NOTION_TOKEN || process.env?.NOTION_TOKEN || '';
export const NOTION_DATABASE_ID = import.meta.env?.NOTION_DATABASE_ID || process.env?.NOTION_DATABASE_ID || '';
const NOTION_API = 'https://api.notion.com/v1';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

export function isNotionConfigured(): boolean {
  return !!NOTION_TOKEN && !!NOTION_DATABASE_ID && NOTION_TOKEN !== 'dummy-token-for-build';
}

/**
 * Query Notion database
 */
export async function queryDatabase(filter?: any, sorts?: any[]): Promise<any> {
  const url = `${NOTION_API}/databases/${NOTION_DATABASE_ID}/query`;

  const body: any = {};
  if (filter) body.filter = filter;
  if (sorts) body.sorts = sorts;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Notion API error ${res.status}: ${error}`);
  }

  return res.json();
}

/**
 * Get page blocks with pagination support
 */
export async function getPageBlocks(pageId: string): Promise<any[]> {
  const allBlocks: any[] = [];
  let cursor: string | undefined;

  do {
    const url = `${NOTION_API}/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;

    const res = await fetch(url, { headers });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Notion API error ${res.status}: ${error}`);
    }

    const data = await res.json();
    allBlocks.push(...data.results);

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return allBlocks;
}

/**
 * Get a single page by ID
 */
export async function getPage(pageId: string): Promise<any> {
  const url = `${NOTION_API}/pages/${pageId}`;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Notion API error ${res.status}: ${error}`);
  }

  return res.json();
}
