/**
 * Design Tokens - Semantic Color System
 * 
 * A centralized, scalable color system designed for accessibility
 * and medical app context. Uses semantic naming to ensure consistency
 * across all components and screens.
 */

export const colors = {
  // Primary Actions
  primary: '#2F80ED',
  primaryLight: '#7CB3F5',
  primaryDark: '#1F5FC9',

  // Background & Surfaces
  background: '#F5F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFBFC',

  // Text
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  // Status & Semantic
  accentSuccess: '#6FCF97',
  accentWarning: '#F2A1B3',
  accentDanger: '#EB5757',

  // Utility
  border: '#E0E0E0',
  divider: '#F0F0F0',
  disabled: '#CCCCCC',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Semantic Aliases (for common use cases)
  error: '#EB5757',
  success: '#6FCF97',
  warning: '#F2A1B3',
  info: '#2F80ED',
};

/**
 * Type definition for the colors object.
 * Allows TypeScript to provide autocomplete when using colors.
 */
export type ColorTokens = typeof colors;

/**
 * Helper type for picking colors from the palette
 * Usage: type MyColors = ColorPicker<'primary' | 'textPrimary'>;
 */
export type ColorPicker<T extends keyof ColorTokens> = ColorTokens[T];
