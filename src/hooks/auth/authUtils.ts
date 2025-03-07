// Define the keys used in localStorage
export enum LocalStorageKeys {
  USER = 'user_data',
  AUTH_TOKEN = 'auth_token',
  REFRESH_TOKEN = 'refresh_token',
  SECURITY_LOGS = 'security_logs',
  LOGIN_ATTEMPTS = 'login_attempts',
  ADMIN_ACCESS_LOGS = 'admin_access_logs',
  SUSPICIOUS_ACTIVITIES = 'suspicious_activities'
}

// Security constants
export const SECURITY_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 60 * 60 * 1000, // 1 hour in milliseconds
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  PASSWORD_MIN_LENGTH: 8,
  REQUIRE_MIXED_CASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SYMBOLS: true,
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000 // 5 minutes in milliseconds
};

import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// Ensure an admin account exists for demo purposes
export const ensureAdminAccount = () => {
  const existingUser = localStorage.getItem(LocalStorageKeys.USER);
  if (!existingUser) {
    // Create a default admin account if none exists
    const defaultAdmin = {
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isAdmin: true,
      securityLevel: 'high',
      created: new Date().toISOString(),
      lastLogin: null,
      passwordLastChanged: new Date().toISOString(),
      requiresPasswordChange: false,
      loginCount: 0
    };
    
    // Generate a browser fingerprint for the admin account
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
    localStorage.setItem(`fingerprint_admin-1`, fingerprint);
    
    // Note: In a real app, you would never store credentials in localStorage like this
    // This is only for demo purposes
    const adminPasswordSalt = uuidv4();
    const hashedPassword = CryptoJS.SHA256(`admin123${adminPasswordSalt}`).toString();
    
    localStorage.setItem('admin_credentials', JSON.stringify({
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      salt: adminPasswordSalt
    }));
    
    // Initialize security logs
    initializeSecurityLogs();
  }
};

// Initialize security logs structure
const initializeSecurityLogs = () => {
  if (!localStorage.getItem(LocalStorageKeys.SECURITY_LOGS)) {
    localStorage.setItem(LocalStorageKeys.SECURITY_LOGS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(LocalStorageKeys.ADMIN_ACCESS_LOGS)) {
    localStorage.setItem(LocalStorageKeys.ADMIN_ACCESS_LOGS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(LocalStorageKeys.SUSPICIOUS_ACTIVITIES)) {
    localStorage.setItem(LocalStorageKeys.SUSPICIOUS_ACTIVITIES, JSON.stringify([]));
  }
};

// Log security event
export const logSecurityEvent = (eventType: string, userId: string | null, details: any = {}) => {
  try {
    const securityLogs = JSON.parse(localStorage.getItem(LocalStorageKeys.SECURITY_LOGS) || '[]');
    
    // Limit log size to prevent storage attacks
    if (securityLogs.length > 1000) {
      securityLogs.splice(0, securityLogs.length - 900);
    }
    
    securityLogs.push({
      id: uuidv4(),
      type: eventType,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipAddress: 'client-side', // In a real app this would come from the server
      ...details
    });
    
    localStorage.setItem(LocalStorageKeys.SECURITY_LOGS, JSON.stringify(securityLogs));
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

// Generate secure tokens
export const generateSecureToken = () => {
  const tokenBytes = new Uint8Array(32);
  window.crypto.getRandomValues(tokenBytes);
  return Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Hash password with salt
export const hashPassword = (password: string, salt: string) => {
  return CryptoJS.SHA256(`${password}${salt}`).toString();
};

// Enhanced login attempt tracking
export const updateLoginAttempts = (email: string, increment = true, reset = false) => {
  try {
    const storageKey = `login_attempts_${email}`;
    const now = Date.now();
    
    if (reset) {
      localStorage.removeItem(storageKey);
      return { count: 0, timestamp: now };
    }
    
    const attempts = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify({ count: 0, timestamp: now }));
    
    // If lockout period has passed, reset counter
    if (attempts.lockUntil && attempts.lockUntil < now) {
      const newData = { count: increment ? 1 : 0, timestamp: now };
      localStorage.setItem(storageKey, JSON.stringify(newData));
      return newData;
    }
    
    // Otherwise update counter
    const newCount = increment ? (attempts.count || 0) + 1 : 0;
    const newData = {
      count: newCount,
      timestamp: now,
      lastAttempt: now,
      // Lock account if too many attempts
      lockUntil: newCount >= SECURITY_CONSTANTS.MAX_LOGIN_ATTEMPTS ? 
        now + SECURITY_CONSTANTS.LOCKOUT_DURATION : 
        attempts.lockUntil
    };
    
    localStorage.setItem(storageKey, JSON.stringify(newData));
    
    // If this is a new lockout, log it
    if (newCount >= SECURITY_CONSTANTS.MAX_LOGIN_ATTEMPTS && 
        (!attempts.lockUntil || attempts.lockUntil < now)) {
      logSecurityEvent('account_locked', null, {
        email,
        reason: 'too_many_failed_attempts',
        attemptCount: newCount,
        lockDuration: SECURITY_CONSTANTS.LOCKOUT_DURATION / (60 * 1000) + ' minutes'
      });
    }
    
    return newData;
  } catch (error) {
    console.error('Error updating login attempts:', error);
    return { count: 0, timestamp: Date.now() };
  }
};

// Verify that the security features are initialized
export const verifySecurityInitialization = () => {
  initializeSecurityLogs();
  
  // Ensure CSRF token exists for this session
  if (!sessionStorage.getItem('csrf_token')) {
    sessionStorage.setItem('csrf_token', uuidv4());
  }
  
  // Set up security monitoring level if it doesn't exist
  if (!sessionStorage.getItem('security_monitoring_level')) {
    sessionStorage.setItem('security_monitoring_level', 'standard');
  }
};

// Generate a trusted device token
export const generateTrustedDeviceToken = (userId: string) => {
  const token = uuidv4();
  const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
  const deviceData = {
    token,
    fingerprint,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  };
  
  const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
  trustedDevices.push(deviceData);
  
  // Limit number of trusted devices
  if (trustedDevices.length > 5) {
    trustedDevices.shift();
  }
  
  localStorage.setItem(`trusted_devices_${userId}`, JSON.stringify(trustedDevices));
  
  // Set in current device's local storage
  localStorage.setItem(`device_token_${userId}`, token);
  
  return token;
};

// Check if current device is trusted
export const isCurrentDeviceTrusted = (userId: string) => {
  const currentToken = localStorage.getItem(`device_token_${userId}`);
  if (!currentToken) return false;
  
  const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
  return trustedDevices.some((device: any) => device.token === currentToken);
};

// Update trusted device last used timestamp
export const updateTrustedDevice = (userId: string) => {
  const currentToken = localStorage.getItem(`device_token_${userId}`);
  if (!currentToken) return false;
  
  const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
  const updatedDevices = trustedDevices.map((device: any) => {
    if (device.token === currentToken) {
      return {
        ...device,
        lastUsed: new Date().toISOString()
      };
    }
    return device;
  });
  
  localStorage.setItem(`trusted_devices_${userId}`, JSON.stringify(updatedDevices));
  return true;
};
