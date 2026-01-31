/**
 * Maps medication forms to appropriate icons
 * This centralizes icon selection logic for consistency across the app
 */

export type MedicationFormType = 'Pills' | 'Capsules' | 'Liquid' | 'Injection' | 'Drops';

export interface MedicationIconConfig {
  name: string;
  iconLibrary: 'MaterialCommunityIcons' | 'MaterialIcons';
}

export const getMedicationIcon = (medicationForm: string): MedicationIconConfig => {
  if (!medicationForm) {
    return { name: 'pill', iconLibrary: 'MaterialCommunityIcons' };
  }
  
  const formLower = medicationForm.toLowerCase();
  
  switch (formLower) {
    case 'pills':
      return { name: 'pill', iconLibrary: 'MaterialCommunityIcons' };
    case 'capsules':
      return { name: 'medication', iconLibrary: 'MaterialCommunityIcons' };
    case 'liquid':
      return { name: 'local-drink', iconLibrary: 'MaterialIcons' };
    case 'injection':
      return { name: 'syringe', iconLibrary: 'MaterialCommunityIcons' };
    case 'drops':
      return { name: 'water-drop', iconLibrary: 'MaterialIcons' };
    default:
      return { name: 'pill', iconLibrary: 'MaterialCommunityIcons' };
  }
};

/**
 * Get a descriptive label for medication form
 */
export const getMedicationFormLabel = (medicationForm: string): string => {
  return medicationForm.charAt(0).toUpperCase() + medicationForm.slice(1);
};
