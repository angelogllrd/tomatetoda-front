// utils/validations.ts

// Verifica si un string tiene el formato correcto de un correo electrónico.5
export const isValidEmail = (emailStr: string): boolean => {
  return /\S+@\S+\.\S+/.test(emailStr);
};
