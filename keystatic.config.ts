import { config, fields, collection } from '@keystatic/core';

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
        title: fields.slug({ name: { label: 'Product Name' } }),
        price: fields.number({ label: 'Price ($)' }),
        stock: fields.number({ label: 'Stock Quantity', defaultValue: 0 }),
        description: fields.text({ label: 'Description', multiline: true }),
        // Add tags field: allows multiple tags per product (e.g., "caffeinated")
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            description: 'Add tags like caffeinated, non-caffeinated, etc.',
            itemLabel: (props) => props.value,
          }
        ),
        image: fields.object(
        {
            file: fields.image({
            label: 'Upload Image',
            directory: 'src/assets/images/products',
            publicPath: '../../assets/images/products/',
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
});
