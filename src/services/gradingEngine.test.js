import { describe, it, expect } from 'vitest';
import { gradeMenu } from './gradingEngine';

describe('Clinical Grading Engine', () => {
  const mockMenu = [
    { name: 'Peanut Butter Toast', ingredients: ['bread', 'peanuts', 'butter'] },
    { name: 'Grilled Salmon', ingredients: ['salmon', 'lemon', 'olive oil'] },
    { name: 'Grapefruit Juice', ingredients: ['grapefruit', 'water', 'sugar'] },
    { name: 'Salty Fries', ingredients: ['potato', 'salt', 'oil'], nutrition: { sodium: 900 } }
  ];

  it('marks safe food as optimal if no conflicts exist', () => {
    const profile = { vitals: {}, conditions: [], medications: [], allergens: [] };
    const result = gradeMenu([mockMenu[1]], profile);
    
    expect(result[0].grade).toBe('optimal');
    expect(result[0].reasons.length).toBe(1); // '✅ No conflicts found with your profile.'
    expect(result[0].reasons[0]).toContain('No conflicts found');
  });

  it('flags fatal allergen conflicts as risk', () => {
    const profile = { vitals: {}, conditions: [], medications: [], allergens: ['Nuts'] };
    // Peanuts trigger Nuts allergen
    const result = gradeMenu([mockMenu[0]], profile);
    
    expect(result[0].grade).toBe('risk');
    expect(result[0].reasons.some(r => r.includes('Allergen Alert'))).toBe(true);
  });

  it('flags medication interactions as risk', () => {
    // Lisinopril + Grapefruit is historically a known interaction config in the engine
    const profile = { vitals: {}, conditions: [], medications: ['Lisinopril'], allergens: [] };
    const result = gradeMenu([mockMenu[2], mockMenu[1]], profile);
    
    expect(result[0].grade).toBe('risk');
    expect(result[0].reasons.some(r => r.includes('Med Interaction'))).toBe(true);
    expect(result[1].grade).toBe('optimal'); // Salmon is safe
  });

  it('modifies grades based on health conditions', () => {
    const profile = { vitals: {}, conditions: ['Hypertension'], medications: [], allergens: [] };
    const result = gradeMenu([mockMenu[3]], profile);
    
    // Hypertension + High sodium = modification or risk depending on severity.
    // The engine limits sodium. 900mg usually triggers a modified or risk state for hypertension.
    expect(result[0].grade).not.toBe('optimal');
  });
});
