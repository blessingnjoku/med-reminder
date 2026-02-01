/**
 * Maps medication forms to appropriate icons
 * This centralizes icon selection logic for consistency across the app
 */

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
      return { name: 'pill-multiple', iconLibrary: 'MaterialCommunityIcons' };
    case 'liquid':
      return { name: 'cup', iconLibrary: 'MaterialCommunityIcons' };
    case 'injection':
      return { name: 'needle', iconLibrary: 'MaterialCommunityIcons' };
    case 'drops':
      return { name: 'water', iconLibrary: 'MaterialCommunityIcons' };
    default:
      return { name: 'pill', iconLibrary: 'MaterialCommunityIcons' };
  }
};

/**
 * Get a descriptive label for medication form
 */
export const getMedicationFormLabel = (medicationForm: string): string => {
  if (!medicationForm) return 'Pills'; // Default fallback
  return medicationForm.charAt(0).toUpperCase() + medicationForm.slice(1);
};
