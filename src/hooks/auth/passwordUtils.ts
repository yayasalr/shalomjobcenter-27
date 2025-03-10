
import CryptoJS from 'crypto-js';
import { SECURITY_CONSTANTS } from './constants';

// Advanced password validator
export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < SECURITY_CONSTANTS.PASSWORD_MIN_LENGTH) {
    errors.push(`Le mot de passe doit contenir au moins ${SECURITY_CONSTANTS.PASSWORD_MIN_LENGTH} caractères`);
  }
  
  if (SECURITY_CONSTANTS.REQUIRE_MIXED_CASE && !/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre majuscule et une lettre minuscule");
  }
  
  if (SECURITY_CONSTANTS.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }
  
  if (SECURITY_CONSTANTS.REQUIRE_SYMBOLS && !/[^A-Za-z0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Hash password with salt
export const hashPassword = (password: string, salt: string) => {
  return CryptoJS.SHA256(`${password}${salt}`).toString();
};

// Check if email is already registered
export const isEmailRegistered = (email: string): boolean => {
  const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
  return allUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
};

// Check if username is already registered
export const isUsernameRegistered = (username: string): boolean => {
  const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
  return allUsers.some((user: any) => 
    user.name && user.name.toLowerCase() === username.toLowerCase()
  );
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
