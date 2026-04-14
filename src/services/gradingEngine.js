// ============================================
// GRADING ENGINE — The Clinical Intelligence Core
// Determines whether a dish is Optimal, Modified, or a Risk
// ============================================

/**
 * CONDITION → DIETARY RULES MAPPING
 * Maps a known medical condition to ingredients/nutrients to watch.
 */
const CONDITION_RULES = {
  'Hypertension': {
    avoid: ['sodium', 'salt', 'soy sauce', 'brine', 'pickle', 'cured', 'processed', 'msg'],
    prefer: ['fiber', 'potassium', 'magnesium', 'oats', 'leafy greens'],
    message: 'High sodium — increases blood pressure.'
  },
  'Type 2 Diabetes': {
    avoid: ['sugar', 'syrup', 'honey', 'white rice', 'refined flour', 'white bread', 'soda', 'fries'],
    prefer: ['fiber', 'whole grain', 'leafy greens', 'protein'],
    message: 'High glycemic index — spikes blood sugar.'
  },
  'Celiac': {
    avoid: ['gluten', 'wheat', 'barley', 'rye', 'bread', 'pasta', 'flour', 'malt'],
    prefer: ['rice', 'quinoa', 'potato', 'corn'],
    message: 'Contains gluten — not safe for Celiac disease.'
  },
  'High Cholesterol': {
    avoid: ['saturated fat', 'trans fat', 'butter', 'cream', 'cheese', 'fried', 'bacon'],
    prefer: ['omega-3', 'fiber', 'oats', 'avocado', 'olive oil'],
    message: 'High in saturated fat — raises LDL cholesterol.'
  }
};

/**
 * MEDICATION → NUTRIENT INTERACTION MAPPING
 * Maps common medications to ingredients that conflict.
 */
const MED_INTERACTIONS = {
  'Lisinopril': {
    avoid: ['potassium', 'salt substitute', 'banana', 'grapefruit', 'orange juice'],
    message: 'High potassium — can cause dangerous levels when on Lisinopril (ACE inhibitor).'
  },
  'Warfarin': {
    avoid: ['spinach', 'kale', 'broccoli', 'vitamin k', 'leafy greens', 'grapefruit'],
    message: 'High Vitamin K — interferes with Warfarin blood-thinning.'
  },
  'Metformin': {
    avoid: ['alcohol', 'sugar', 'refined carbohydrate'],
    message: 'High sugar/carbs — reduces Metformin effectiveness for blood sugar control.'
  },
  'Simvastatin': {
    avoid: ['grapefruit', 'grapefruit juice'],
    message: 'Grapefruit blocks Simvastatin metabolism — dangerous drug buildup risk.'
  }
};

/**
 * ALLERGEN MAPPING
 * Common food allergen keywords.
 */
const ALLERGEN_MAP = {
  'Nuts':       ['nut', 'almond', 'cashew', 'walnut', 'peanut', 'hazelnut', 'pistachio'],
  'Dairy':      ['milk', 'cream', 'butter', 'cheese', 'lactose', 'whey', 'yogurt'],
  'Shellfish':  ['shrimp', 'prawn', 'crab', 'lobster', 'clam', 'oyster', 'shellfish'],
  'Soy':        ['soy', 'tofu', 'edamame', 'soya', 'soy sauce', 'miso'],
  'Gluten':     ['wheat', 'barley', 'rye', 'gluten', 'bread', 'pasta', 'flour'],
  'Eggs':       ['egg', 'albumin', 'mayo', 'mayonnaise'],
  'Fish':       ['fish', 'salmon', 'tuna', 'cod', 'halibut', 'anchovy'],
};

/**
 * Main grading function.
 * @param {Object} dish - { name, description, ingredients: [] }
 * @param {Object} profile - { conditions: [], medications: [], allergens: [] }
 * @returns {Object} - { grade: 'optimal'|'modified'|'risk', reasons: [], instruction: '' }
 */
export function gradeDish(dish, profile) {
  const dishText = `${dish.name} ${dish.description || ''} ${(dish.ingredients || []).join(' ')}`.toLowerCase();
  const risks = [];
  const warnings = [];

  // 1. ALLERGEN CHECK (Highest Priority)
  for (const allergen of (profile.allergens || [])) {
    const keywords = ALLERGEN_MAP[allergen] || [];
    const found = keywords.find(kw => dishText.includes(kw));
    if (found) {
      risks.push(`⚠️ Allergen Alert: Contains ${found} (${allergen} allergy).`);
    }
  }

  // 2. MEDICATION INTERACTION CHECK
  for (const med of (profile.medications || [])) {
    const rule = MED_INTERACTIONS[med];
    if (rule) {
      const found = rule.avoid.find(kw => dishText.includes(kw));
      if (found) {
        risks.push(`💊 Med Interaction: ${rule.message}`);
      }
    }
  }

  // 3. CONDITION-BASED CHECK
  for (const condition of (profile.conditions || [])) {
    const rule = CONDITION_RULES[condition];
    if (rule) {
      const found = rule.avoid.find(kw => dishText.includes(kw));
      if (found) {
        warnings.push(`🩺 ${condition}: ${rule.message}`);
      }
    }
  }

  // 4. DETERMINE GRADE
  if (risks.length > 0) {
    return { grade: 'risk', reasons: [...risks, ...warnings], instruction: 'Avoid this dish.' };
  }
  if (warnings.length > 0) {
    return {
      grade: 'modified',
      reasons: warnings,
      instruction: 'Ask the chef to modify this dish (e.g., no salt, dressing on side).'
    };
  }
  return { grade: 'optimal', reasons: ['✅ No conflicts found with your profile.'], instruction: '' };
}

/**
 * Grade an entire list of dishes.
 * @param {Array} dishes - Array of dish objects.
 * @param {Object} profile - User clinical profile.
 * @returns {Array} - Dishes with grade property added.
 */
export function gradeMenu(dishes, profile) {
  return dishes.map(dish => ({ ...dish, ...gradeDish(dish, profile) }));
}
