// ============================================
Return a JSON array (and ONLY the JSON array, no markdown wrapping) in this format:
[
  {
    "name": "Dish Name",
    "description": "Brief description if available",
    "ingredients": ["ingredient1", "ingredient2"],
    "price": "price if visible or null"
  }
]
Be thorough — include all dishes you can read. For ingredients, infer likely ingredients from the dish name and description if not explicitly listed.`;

  try {
    const response = await fetch(GEMINI_VISION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
          ]
        }]
      })
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini Vision.');

    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('OCR Extraction failed:', err);
    // Return mock data for development/demo
    return getMockMenuData();
  }
}

/**
 * Mock menu data for development and demo purposes.
 * Used when Gemini API is unavailable or key isn't set.
 */
export function getMockMenuData() {
  return [
    {
      name: 'Grilled Salmon',
      description: 'Wild-caught salmon with asparagus and lemon butter sauce',
      ingredients: ['salmon', 'asparagus', 'butter', 'lemon', 'herbs'],
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
