import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const searchIndex = posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    content: post.body.slice(0, 5000), // 限制内容长度避免索引过大
    categories: post.data.categories,
    tags: post.data.tags,
    date: post.data.date.toISOString(),
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
