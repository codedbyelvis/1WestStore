import fs from 'node:fs';
import path from 'node:path';

// Path to your counter.json file
const counterFilePath = path.resolve('./src/content/counter.json');

export function getTransactionID() {
  const currentYear = new Date().getFullYear();
  
  let counterData = { year: currentYear, lastId: 0 };

  // 1. Read existing counter file if it exists
  if (fs.existsSync(counterFilePath)) {
    try {
      const fileContent = fs.readFileSync(counterFilePath, 'utf-8');
      counterData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading counter file, resetting to current year defaults:', error);
    }
  }

  // 2. Check if the year has changed; if so, reset the lastId to 0
  if (counterData.year !== currentYear) {
    counterData.year = currentYear;
    counterData.lastId = 0;
  }

  // 3. Increment the ID for the new transaction
  counterData.lastId += 1;

  // 4. Save the updated counter back to the file
  try {
    fs.writeFileSync(counterFilePath, JSON.stringify(counterData, null, 2));
  } catch (error) {
    console.error('Error writing to counter file:', error);
  }

  // 5. Format the ID (e.g., 2026-001, 2026-042)
  const paddedId = String(counterData.lastId).padStart(3, '0');
  const transactionID = `${counterData.year}-${paddedId}`;

  return {
    transactionID,
    dateTime: new Date().toISOString(), // Clean timestamp for Keystatic
  };
}