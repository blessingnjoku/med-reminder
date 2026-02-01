/**
 * Maps medication forms to appropriate icons
 * This centralizes icon selection logic for consistency across the app
 */

export interface MedicationIconConfig {
  name: string;
  iconLibrary: 'MaterialCommunityIcons' | 'MaterialIcons';
  color: string;
}

export const getMedicationIcon = (medicationForm: string): MedicationIconConfig => {
  if (!medicationForm) {
    return { name: 'pill', iconLibrary: 'MaterialCommunityIcons', color: '#2F80ED' };
  }
  
  const formLower = medicationForm.toLowerCase();
  
  switch (formLower) {
    case 'pills':
      return { name: 'pill', iconLibrary: 'MaterialCommunityIcons', color: '#2F80ED' }; // Blue
    case 'capsules':
      return { name: 'pill-multiple', iconLibrary: 'MaterialCommunityIcons', color: '#9B59B6' }; // Purple
    case 'liquid':
      return { name: 'cup', iconLibrary: 'MaterialCommunityIcons', color: '#3498DB' }; // Light Blue
    case 'injection':
      return { name: 'needle', iconLibrary: 'MaterialCommunityIcons', color: '#F39C12' }; // Orange
    case 'drops':
      return { name: 'water', iconLibrary: 'MaterialCommunityIcons', color: '#1ABC9C' }; // Teal
    default:
      return { name: 'pill', iconLibrary: 'MaterialCommunityIcons', color: '#2F80ED' }; // Blue
  }
};

/**
 * Get a descriptive label for medication form
 */
export const getMedicationFormLabel = (medicationForm: string): string => {
  if (!medicationForm) return 'Pills'; // Default fallback
  return medicationForm.charAt(0).toUpperCase() + medicationForm.slice(1);
};
