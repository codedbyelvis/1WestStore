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
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Product Name',
          description: 'Please name the Slug the same as this title.'
         } }),
        price: fields.number({ label: 'Price ($)' }),
        stock: fields.number({ label: 'Stock Quantity', defaultValue: 0 }),
        description: fields.text({ label: 'Description', multiline: true }),
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

    // --- Customer Suggestions Collection ---
    suggestions: collection({
      label: 'Customer Suggestions',
      slugField: 'suggestionID',
      path: 'src/content/suggestions/*',
      format: { data: 'json' },
      schema: {
        suggestionID: fields.slug({
          name: {
            label: 'Suggestion ID',
            description: 'Unique ID for this suggestion (e.g., SUG-2026-001)',
          },
        }),
        date: fields.text({
          label: 'Date',
          description: 'Date the suggestion was submitted',
        }),
        suggestionText: fields.text({
          label: 'Suggestion Text',
          multiline: true,
          description: 'What the customer suggested',
        }),
        suggestionURL: fields.url({
          label: 'Suggestion URL',
          description: 'Optional reference link provided by customer',
        }),
        optionalImage: fields.image({
          label: 'Optional Image',
          directory: 'public/images/suggestions',
          publicPath: '/images/suggestions/',
        }),
        optionalCustomerName: fields.text({
          label: 'Customer Name',
          description: 'Name of customer if provided',
        }),
      },
    }),

    // --- Transactions Collection ---
    transactions: collection({
      label: 'Transactions',
      slugField: 'transactionID',
      path: 'src/content/transactions/*',
      format: { data: 'json' },
      
      //Columns configuration to make scanning status and totals seamless in the Keystatic dashboard
      columns: ['transactionStatus', 'transactionAmount', 'optionalCustomerName', 'inventoryAlert'],

      schema: {
        transactionID: fields.slug({
          name: {
            label: 'Transaction ID',
            description: 'Generated transaction reference number',
          },
        }),
        dateTime: fields.text({
          label: 'Date and Time',
          description: 'Timestamp when the order was placed',
        }),
        transactionStatus: fields.select({
          label: 'Transaction Status',
          description: 'Isolated tag system for payment processing',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Paid', value: 'paid' },
            { label: 'Not Paid', value: 'not_paid' },
          ],
        }),
        
        // --- Oversold / Stock Warning Tag ---
        inventoryAlert: fields.select({
          label: 'Inventory Alert',
          description: 'Automatically flagged if ordered quantity exceeded online stock.',
          defaultValue: 'normal',
          options: [
            { label: 'Normal Order', value: 'normal' },
            { label: '⚠️ Oversold (Check In-Person Stock)', value: 'oversold' },
          ],
        }),
        transactionAmount: fields.number({
          label: 'Transaction Amount ($)',
        }),
        optionalCustomerName: fields.text({
          label: 'Customer Name',
          description: 'Name of customer (or saved local storage name)',
        }),
      },
    }),
  }, // <--- Collections object closes correctly here now

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