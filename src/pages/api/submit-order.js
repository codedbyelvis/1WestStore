import fs from 'node:fs';
import path from 'node:path';
import { getTransactionID } from '../../components/counter.js';

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Extract data sent from the checkout
    const { transactionAmount, optionalCustomerName, items } = data;

    let isOversold = false;

    // Directly update stock using the exact slug passed from the cart
    if (items && Array.isArray(items)) {
      for (const cartItem of items) {
        // Use the exact immutable file slug passed from the cart (e.g. "test3")
        const productSlug = cartItem.slug;

        if (!productSlug) {
          console.warn(`Missing product slug for item: "${cartItem.title}"`);
          continue;
        }

        const productFilePath = path.resolve(`./src/content/products/${productSlug}.json`);

        if (fs.existsSync(productFilePath)) {
          const productData = JSON.parse(fs.readFileSync(productFilePath, 'utf-8'));

          // Check if ordered quantity exceeds online stock
          if (cartItem.quantity > productData.stock) {
            isOversold = true;
          }

          // Decrement stock safely (won't drop below 0)
          productData.stock = Math.max(0, productData.stock - cartItem.quantity);

          // Save the updated stock back to the file
          fs.writeFileSync(productFilePath, JSON.stringify(productData, null, 2));
        } else {
          console.warn(`Could not find product file at path: ${productFilePath}`);
        }
      }
    }

    // 1. Generate sequential transaction ID and clean timestamp using your counter
    const { transactionID, dateTime } = getTransactionID();

    // 2. Structure matching your Keystatic transactions collection schema exactly
    const transactionPayload = {
      transactionID,
      dateTime,
      transactionStatus: 'pending', // Default to pending for manual Venmo/Cash App verification
      inventoryAlert: isOversold ? 'oversold' : 'normal', // Flags in Keystatic if oversold
      transactionAmount: parseFloat(transactionAmount) || 0,
      optionalCustomerName: optionalCustomerName || 'Anonymous',
    };

    // 3. Path where Keystatic expects transaction JSON files to live
    const filePath = path.resolve(`./src/content/transactions/${transactionID}.json`);

    // 4. Write the JSON file to disk
    fs.writeFileSync(filePath, JSON.stringify(transactionPayload, null, 2));

    // 5. Return success response back to the browser
    return new Response(JSON.stringify({ 
      success: true, 
      transactionID, 
      message: 'Order placed successfully and set to pending.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error saving transaction order:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}