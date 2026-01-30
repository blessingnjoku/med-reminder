export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateMedicationName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= 100;
};

export const validateDosage = (dosage: string): boolean => {
  return dosage.trim().length > 0 && dosage.length <= 50;
};

export const validateTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};
