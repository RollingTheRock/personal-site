import { queryDatabase, getPageBlocks, isNotionConfigured, NOTION_DATABASE_ID } from './notion';
import { blocksToHtml } from './notion-renderer';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  image: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  type: '博客' | '项目' | '视频';
}

// ============================================================================
// 本地 Markdown 数据源（回退机制）
// ============================================================================

/**
 * 从本地 Markdown 获取博客文章
 */
async function getLocalBlogPosts(): Promise<Post[]> {
  try {
    const entries = await getCollection('blog', (entry: CollectionEntry<'blog'>) => !entry.data.draft);
    return entries.map((entry: CollectionEntry<'blog'>) => ({
      id: entry.id,
      title: entry.data.title,
      slug: entry.slug,
      description: entry.data.description,
      date: entry.data.date.toISOString().split('T')[0],
      image: entry.data.image || '',
      categories: entry.data.categories,
      tags: entry.data.tags,
      featured: entry.data.featured,
      type: '博客' as const,
    }));
  } catch (error) {
    console.warn('读取本地博客文章失败:', error);
    return [];
  }
}

/**
 * 从本地 Markdown 获取项目
 */
async function getLocalProjects(): Promise<Post[]> {
  try {
    const entries = await getCollection('projects');
    return entries.map((entry: CollectionEntry<'projects'>) => ({
      id: entry.id,
      title: entry.data.title,
      slug: entry.slug,
      description: entry.data.description,
      date: entry.data.date.toISOString().split('T')[0],
      image: entry.data.image || '',
      categories: entry.data.tech,
      tags: entry.data.tech,
      featured: entry.data.featured,
      type: '项目' as const,
    }));
  } catch (error) {
    console.warn('读取本地项目失败:', error);
    return [];
  }
}

/**
 * 合并 Notion 和本地数据源
 * Notion 内容优先，本地内容作为补充
 */
function mergePosts(notionPosts: Post[], localPosts: Post[]): Post[] {
  const notionSlugs = new Set(notionPosts.map(p => p.slug));
  const uniqueLocalPosts = localPosts.filter(p => !notionSlugs.has(p.slug));
  return [...notionPosts, ...uniqueLocalPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Extract property value from Notion page properties
 */
function getPropertyValue(property: any): any {
  if (!property) return '';

  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'select':
      return property.select?.name || '';
    case 'multi_select':
      return property.multi_select?.map((item: any) => item.name) || [];
    case 'date':
      return property.date?.start || '';
    case 'checkbox':
      return property.checkbox;
    case 'files':
      const file = property.files?.[0];
      if (file) {
        if (file.type === 'external') {
          return file.external?.url || '';
        } else if (file.type === 'file') {
          return file.file?.url || '';
        }
      }
      return '';
    default:
      return '';
  }
}

/**
 * Convert Notion page to Post object
 */
function pageToPost(page: any): Post {
  const properties = page.properties;

  return {
    id: page.id,
    title: getPropertyValue(properties['标题']),
    slug: getPropertyValue(properties['Slug']),
    description: getPropertyValue(properties['摘要']),
    date: getPropertyValue(properties['发布日期']),
    image: getPropertyValue(properties['封面图']),
    categories: getPropertyValue(properties['分类']) as string[],
    tags: getPropertyValue(properties['标签']) as string[],
    featured: getPropertyValue(properties['置顶']) as boolean,
    type: getPropertyValue(properties['类型']) as '博客' | '项目' | '视频',
  };
}

/**
 * Get all published posts (Notion + 本地回退)
 */
export async function getAllPublishedPosts(): Promise<Post[]> {
  let notionPosts: Post[] = [];

  // 1. 尝试从 Notion 获取
  if (isNotionConfigured()) {
    try {
      const response = await queryDatabase(
        {
          property: '状态',
          status: {
            equals: '✅ 已发布',
          },
        },
        [
          {
            property: '发布日期',
            direction: 'descending',
          },
        ]
      );
      notionPosts = response.results.map(pageToPost);
    } catch (error) {
      console.warn('Notion API 获取失败，使用本地回退:', error);
    }
  }

  // 2. 读取本地 Markdown 作为回退
  const [localBlogs, localProjects] = await Promise.all([
    getLocalBlogPosts(),
    getLocalProjects(),
  ]);
  const localPosts = [...localBlogs, ...localProjects];

  // 3. 合并：Notion 优先，本地补充
  return mergePosts(notionPosts, localPosts);
}

/**
 * Get post by slug (Notion + 本地回退)
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // 1. 先尝试从 Notion 获取
  if (isNotionConfigured()) {
    try {
      const response = await queryDatabase(
        {
          and: [
            {
              property: '状态',
              status: {
                equals: '✅ 已发布',
              },
            },
            {
              property: 'Slug',
              rich_text: {
                equals: slug,
              },
            },
          ],
        }
      );

      if (response.results.length > 0) {
        return pageToPost(response.results[0]);
      }
    } catch (error) {
      console.warn('Notion API 获取失败，尝试本地回退:', error);
    }
  }

  // 2. 回退到本地 Markdown
  const [localBlogs, localProjects] = await Promise.all([
    getLocalBlogPosts(),
    getLocalProjects(),
  ]);
  const localPost = [...localBlogs, ...localProjects].find(p => p.slug === slug);

  return localPost || null;
}

/**
 * Get local blog post content by slug
 */
async function getLocalBlogContent(slug: string): Promise<string | null> {
  try {
    const entry = await getEntry('blog', slug);
    if (!entry) return null;
    return entry.body || '';
  } catch (error) {
    console.warn('读取本地博客内容失败:', error);
    return null;
  }
}

/**
 * Get local project content by slug
 */
async function getLocalProjectContent(slug: string): Promise<string | null> {
  try {
    const entry = await getEntry('projects', slug);
    if (!entry) return null;
    return entry.body || '';
  } catch (error) {
    console.warn('读取本地项目内容失败:', error);
    return null;
  }
}

/**
 * Check if ID looks like a valid Notion page ID (UUID format)
 * Notion IDs can be with or without dashes: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or 32 hex chars
 */
function isValidNotionPageId(id: string): boolean {
  if (!id) return false;
  // Check for standard UUID format with dashes (36 chars)
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) {
    return true;
  }
  // Check for 32 hex characters without dashes
  if (/^[a-f0-9]{32}$/i.test(id)) {
    return true;
  }
  return false;
}

/**
 * Convert Notion page ID to API format (no dashes)
 */
function toNotionApiId(id: string): string {
  return id.replace(/-/g, '');
}

/**
 * Get post content as HTML (Notion + 本地回退)
 */
export async function getPostContent(pageId: string, slug?: string, type?: string): Promise<string> {
  // 1. 尝试从 Notion 获取（仅在ID是有效的Notion UUID时）
  if (isNotionConfigured() && isValidNotionPageId(pageId)) {
    try {
      // Notion API requires ID without dashes
      const apiPageId = toNotionApiId(pageId);
      const blocks = await getPageBlocks(apiPageId);
      return blocksToHtml(blocks);
    } catch (error) {
      console.warn('Notion 内容获取失败，尝试本地回退:', error);
    }
  }

  // 2. 回退到本地 Markdown
  if (slug) {
    const localContent = type === '项目'
      ? await getLocalProjectContent(slug)
      : await getLocalBlogContent(slug);

    if (localContent) {
      return localContent;
    }
  }

  return '';
}

/**
 * Get featured posts (Notion + 本地回退)
 */
export async function getFeaturedPosts(): Promise<Post[]> {
  let notionPosts: Post[] = [];

  // 1. 尝试从 Notion 获取
  if (isNotionConfigured()) {
    try {
      const response = await queryDatabase(
        {
          and: [
            {
              property: '状态',
              status: {
                equals: '✅ 已发布',
              },
            },
            {
              property: '置顶',
              checkbox: {
                equals: true,
              },
            },
          ],
        },
        [
          {
            property: '发布日期',
            direction: 'descending',
          },
        ]
      );
      notionPosts = response.results.map(pageToPost);
    } catch (error) {
      console.warn('Notion API 获取失败，使用本地回退:', error);
    }
  }

  // 2. 读取本地 Markdown 作为回退
  const [localBlogs, localProjects] = await Promise.all([
    getLocalBlogPosts(),
    getLocalProjects(),
  ]);
  const localFeatured = [...localBlogs, ...localProjects].filter(p => p.featured);

  // 3. 合并：Notion 优先，本地补充
  return mergePosts(notionPosts, localFeatured);
}

/**
 * Get posts by type (Notion + 本地回退)
 */
export async function getPostsByType(type: '博客' | '项目' | '视频'): Promise<Post[]> {
  let notionPosts: Post[] = [];

  // 1. 尝试从 Notion 获取
  if (isNotionConfigured()) {
    try {
      const response = await queryDatabase(
        {
          and: [
            {
              property: '状态',
              status: {
                equals: '✅ 已发布',
              },
            },
            {
              property: '类型',
              select: {
                equals: type,
              },
            },
          ],
        },
        [
          {
            property: '发布日期',
            direction: 'descending',
          },
        ]
      );
      notionPosts = response.results.map(pageToPost);
    } catch (error) {
      console.warn('Notion API 获取失败，使用本地回退:', error);
    }
  }

  // 2. 读取本地 Markdown 作为回退
  let localPosts: Post[] = [];
  if (type === '博客') {
    localPosts = await getLocalBlogPosts();
  } else if (type === '项目') {
    localPosts = await getLocalProjects();
  }

  // 3. 合并：Notion 优先，本地补充
  return mergePosts(notionPosts, localPosts);
}

/**
 * Get posts by category (Notion + 本地回退)
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
  let notionPosts: Post[] = [];

  // 1. 尝试从 Notion 获取
  if (isNotionConfigured()) {
    try {
      const response = await queryDatabase(
        {
          and: [
            {
              property: '状态',
              status: {
                equals: '✅ 已发布',
              },
            },
            {
              property: '分类',
              multi_select: {
                contains: category,
              },
            },
          ],
        },
        [
          {
            property: '发布日期',
            direction: 'descending',
          },
        ]
      );
      notionPosts = response.results.map(pageToPost);
    } catch (error) {
      console.warn('Notion API 获取失败，使用本地回退:', error);
    }
  }

  // 2. 读取本地 Markdown 作为回退
  const [localBlogs, localProjects] = await Promise.all([
    getLocalBlogPosts(),
    getLocalProjects(),
  ]);
  const localPosts = [...localBlogs, ...localProjects].filter(p =>
    p.categories.includes(category)
  );

  // 3. 合并：Notion 优先，本地补充
  return mergePosts(notionPosts, localPosts);
}

/**
 * Get related posts (same category or tags)
 */
export async function getRelatedPosts(currentSlug: string, categories: string[], tags: string[], limit: number = 3): Promise<Post[]> {
  if (!isNotionConfigured()) {
    return [];
  }

  try {
    const allPosts = await getAllPublishedPosts();
    const otherPosts = allPosts.filter(p => p.slug !== currentSlug);

    // Score posts based on matching categories and tags
    const scored = otherPosts.map(post => {
      let score = 0;
      score += post.categories.filter(c => categories.includes(c)).length * 2;
      score += post.tags.filter(t => tags.includes(t)).length;
      return { post, score };
    });

    // Sort by score and return top N
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.post);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
