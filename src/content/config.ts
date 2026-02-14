import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    tech: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    date: z.date(),
  }),
});

const videosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    platform: z.enum(['bilibili', 'youtube']),
    videoId: z.string(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
  videos: videosCollection,
};
