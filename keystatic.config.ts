import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  // Use 'local' when developing on your machine, 'github' in production
  storage: {
    kind: process.env.NODE_ENV === 'production' ? 'github' : 'local',
    repo: 'codedbyelvis/1WestStore',
  },
  collections: {
    products: collection({
      label: 'Products',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { data: 'json' }, // or 'yaml' for structured product data
      schema: {
        title: fields.slug({ name: { label: 'Product Name',
          description: 'Please name the Slug the same as this title.'
         } }),
        price: fields.number({ label: 'Price ($)' }),
        stock: fields.number({ label: 'Stock Quantity', defaultValue: 0 }),
        description: fields.text({ label: 'Description', multiline: true }),
        // Add tags field: allows multiple tags per product (e.g., "caffeinated")
        presetTags: fields.multiselect({
          label: 'Existing Tags',
          description: 'Select from existing categories.',
          options: [
            { label: 'Test', value: 'Test' },
            { label: 'Caffeinated', value: 'caffeinated' },
            { label: 'Uncaffeinated', value: 'uncaffeinated' },
          ],
          defaultValue: [],
        }),

        customTags: fields.array(
          fields.text({ label: 'Custom Tag' }),
          {
            label: 'Additional / Custom Tags',
            description: 'Type any extra tags or unique keywords for this product.',
            itemLabel: (props) => props.value,
          }
        ),
        image: fields.object(
        {
            file: fields.image({
            label: 'Upload Image',
            directory: 'public/images/products',
            publicPath: '/images/products/',
            }),
            alt: fields.text({
            label: 'Image Alt Text',
            description: 'Describe the product for screen readers / accessibility.',
            defaultValue: 'A delicious caffeinated beverage in this flavor.',
            }),
        },
        {
            label: 'Product Image',
        }
        ),
      },
    }),
  },

  // Add this singleton for store settings
  singletons: {
    storeSettings: singleton({
      label: 'Store Settings',
      path: 'src/content/storeSettings/index',
      schema: {
        categoryOrder: fields.array(
          fields.text({ label: 'Category Name' }),
          {
            label: 'Store Categories & Order',
            description: 'Add categories in the exact order you want them to appear on your store page.',
            itemLabel: (props) => props.value,
          }
        ),
      },
    }),
  },
});
