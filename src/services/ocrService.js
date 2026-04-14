// ============================================
// OCR SERVICE — Gemini Vision AI Pipeline
// Extracts menu items, ingredients, and prices from images.
// ============================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function processMenuImage(base64Image) {
  // Extract just the base64 payload if it includes data URI schema
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_api_key')) {
    console.warn('[Swastya+] Missing VITE_GEMINI_API_KEY in .env. Falling back to mock data.');
    return getMockMenuData();
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Extract the menu items from this image. Return ONLY a valid JSON array. Each object should have: 'name' (string), 'description' (string, or empty if none), 'price' (string, or empty), and 'ingredients' (array of strings, guess based on the dish name if not explicitly stated)." },
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const json = await response.json();
    let rawText = json.candidates[0].content.parts[0].text;
    
    // Clean up markdown serialization
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(rawText);
  } catch (error) {
    console.error('OCR Processing failed:', error);
    return getMockMenuData();
  }
}

/**
 * Mock menu data for development and demo purposes.
 * Used when Gemini API is unavailable or an error occurs.
 */
export function getMockMenuData() {
  return [
    {
      name: 'Grilled Salmon',
      description: 'Wild-caught salmon with asparagus and lemon butter sauce',
      ingredients: ['salmon', 'lemon', 'olive oil'],
      price: '₹420'
    },
    {
      name: 'Cobb Salad',
      description: 'Fresh greens, avocado, eggs, bacon, and blue cheese dressing',
      ingredients: ['lettuce', 'avocado', 'egg', 'bacon', 'cheese', 'dressing'],
      price: '₹280'
    },
    {
      name: 'Soy Glazed Pork',
      description: 'Slow-braised pork belly with soy glaze and pickled ginger',
      ingredients: ['pork', 'soy sauce', 'ginger', 'potassium', 'sodium'],
      price: '₹380'
    },
    {
      name: 'Quinoa Buddha Bowl',
      description: 'Quinoa, roasted vegetables, chickpeas and tahini dressing',
      ingredients: ['quinoa', 'chickpeas', 'broccoli', 'carrot', 'tahini', 'olive oil'],
      price: '₹320'
    },
    {
      name: 'Creamy Pasta Alfredo',
      description: 'Fettuccine pasta in a rich cream and parmesan sauce',
      ingredients: ['pasta', 'wheat', 'cream', 'butter', 'parmesan', 'cheese'],
      price: '₹260'
    },
    {
      name: 'Lentil Soup',
      description: 'Hearty red lentil soup with cumin and fresh cilantro',
      ingredients: ['lentils', 'cumin', 'tomato', 'cilantro', 'olive oil'],
      price: '₹180'
    }
  ];
}
