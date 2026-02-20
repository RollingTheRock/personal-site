import { queryDatabase, getPageBlocks, isNotionConfigured, NOTION_DATABASE_ID } from './notion';
import { blocksToHtml } from './notion-renderer';

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
 * Get all published posts
 */
export async function getAllPublishedPosts(): Promise<Post[]> {
  if (!isNotionConfigured()) {
    console.warn('Notion not configured, returning empty array');
    return [];
  }

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

    return response.results.map(pageToPost);
  } catch (error) {
    console.error('Error fetching posts from Notion:', error);
    return [];
  }
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isNotionConfigured()) {
    console.warn('Notion not configured, returning null');
    return null;
  }

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

    if (response.results.length === 0) {
      return null;
    }

    return pageToPost(response.results[0]);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Get post content as HTML
 */
export async function getPostContent(pageId: string): Promise<string> {
  if (!isNotionConfigured()) {
    console.warn('Notion not configured, returning empty content');
    return '';
  }

  try {
    const blocks = await getPageBlocks(pageId);
    return blocksToHtml(blocks);
  } catch (error) {
    console.error('Error fetching post content:', error);
    return '';
  }
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(): Promise<Post[]> {
  if (!isNotionConfigured()) {
    console.warn('Notion not configured, returning empty array');
    return [];
  }

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

    return response.results.map(pageToPost);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

/**
 * Get posts by type
 */
export async function getPostsByType(type: '博客' | '项目' | '视频'): Promise<Post[]> {
  if (!isNotionConfigured()) {
    console.warn('Notion not configured, returning empty array');
    return [];
  }

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

    return response.results.map(pageToPost);
  } catch (error) {
    console.error('Error fetching posts by type:', error);
    return [];
  }
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
  if (!isNotionConfigured()) {
    console.warn('Notion not configured, returning empty array');
    return [];
  }

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

    return response.results.map(pageToPost);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
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
