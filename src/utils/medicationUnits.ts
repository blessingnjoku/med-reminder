/**
 * Maps medication forms to their appropriate dosage units
 */

export type MedicationType = 'Pills' | 'Capsules' | 'Liquid' | 'Injection' | 'Drops';

export const medicationUnitMap: Record<MedicationType, string[]> = {
  'Pills': ['tablets', 'mg'],
  'Capsules': ['tablets', 'mg'],
  'Liquid': ['ml', 'l'],
  'Injection': ['ml', 'units'],
  'Drops': ['drops', 'ml'],
};

/**
 * Get default dosage unit for a medication type
 */
export const getDefaultUnitForType = (medicationType: string): string => {
  const type = medicationType as MedicationType;
  const units = medicationUnitMap[type];
  return units ? units[0] : 'mg';
};

/**
 * Get available units for a medication type
 */
export const getUnitsForType = (medicationType: string): string[] => {
  const type = medicationType as MedicationType;
  return medicationUnitMap[type] || ['mg', 'ml'];
};
