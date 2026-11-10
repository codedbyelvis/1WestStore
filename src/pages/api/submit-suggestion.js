import fs from 'node:fs';
import path from 'node:path';

// Helper to handle suggestion counting separately so it doesn't conflict with transaction IDs
function getNextSuggestionID() {
  const currentYear = new Date().getFullYear();
  const counterFilePath = path.resolve('./src/content/suggestion-counter.json');
  
  let counterData = { year: currentYear, lastId: 0 };

  if (fs.existsSync(counterFilePath)) {
    try {
      counterData = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    } catch (error) {
      console.error('Error reading suggestion counter:', error);
    }
  }

  if (counterData.year !== currentYear) {
    counterData.year = currentYear;
    counterData.lastId = 0;
  }

  counterData.lastId += 1;
  fs.writeFileSync(counterFilePath, JSON.stringify(counterData, null, 2));

  const paddedId = String(counterData.lastId).padStart(3, '0');
  return `SUG-${counterData.year}-${paddedId}`;
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { suggestionText, suggestionURL, optionalCustomerName } = data;

    const timestamp = new Date();
    const dateStr = timestamp.toISOString().split('T')[0]; 
    const suggestionID = getNextSuggestionID();

    const suggestionPayload = {
      suggestionID,
      date: dateStr,
      suggestionText,
      suggestionURL: suggestionURL || '',
      optionalImage: null,
      optionalCustomerName: optionalCustomerName || 'Anonymous',
    };

    const filePath = path.resolve(`./src/content/suggestions/${suggestionID}.json`);
    fs.writeFileSync(filePath, JSON.stringify(suggestionPayload, null, 2));

    return new Response(JSON.stringify({ success: true, suggestionID }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving suggestion:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}