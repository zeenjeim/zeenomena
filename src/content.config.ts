import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    priceTier: z.enum(['free', 'paid', 'semi-paid']),
    status: z.enum(['draft', 'live', 'archived']),
    thumbnail: z.string().optional(),
    tools: z.array(z.string()).optional(),
    videoUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    publishedAt: z.coerce.date().optional(),
  }),
});

export const collections = { projects };
