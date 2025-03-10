import { v4 as uuidv4 } from 'uuid';
import { SECURITY_CONSTANTS } from './constants';

// Log security event
export const logSecurityEvent = (eventType: string, userId: string | null, details: any = {}) => {
  try {
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    
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
    
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
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
  if (!localStorage.getItem('security_logs')) {
    localStorage.setItem('security_logs', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('admin_access_logs')) {
    localStorage.setItem('admin_access_logs', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('suspicious_activities')) {
    localStorage.setItem('suspicious_activities', JSON.stringify([]));
  }
  
  // Ensure CSRF token exists for this session
  if (!sessionStorage.getItem('csrf_token')) {
    sessionStorage.setItem('csrf_token', uuidv4());
  }
  
  // Set up security monitoring level if it doesn't exist
  if (!sessionStorage.getItem('security_monitoring_level')) {
    sessionStorage.setItem('security_monitoring_level', 'standard');
  }
};
