import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  // Use the glob loader pointing to your Keystatic products directory
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    price: z.number().default(0),
    stock: z.number().default(0),
    description: z.string(),
    presetTags: z.array(z.string()).optional().default([]),
    customTags: z.array(z.string()).optional().default([]),
    image: z.object({
      file: z.string().nullable().optional(), // Keystatic saves the image path/string here
      alt: z.string(),
    }),
  }),
});

const storeSettings = defineCollection({
  loader: glob({ base: './src/content/storeSettings', pattern: '*.{json,yaml}' }),
  schema: z.object({
    categoryOrder: z.array(z.string()),
  }),
});

export const collections = { products, storeSettings };