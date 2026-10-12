import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  // Use the glob loader pointing to your Keystatic products directory
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    price: z.number(),
    stock: z.number().default(0),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.object({
      file: z.string().nullable().optional(), // Keystatic saves the image path/string here
      alt: z.string(),
    }),
  }),
});

export const collections = { products };