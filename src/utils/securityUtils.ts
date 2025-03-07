
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';

// Function to log security events
export const logSecurityEvent = (
  eventType: string,
  userId: string | null | undefined,
  details: Record<string, any>
): void => {
  try {
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    
    // Limit the size of the logs to prevent storage attacks
    if (securityLogs.length > 1000) {
      securityLogs.splice(0, securityLogs.length - 1000);
    }
    
    securityLogs.push({
      id: uuidv4(),
      type: eventType,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...details
    });
    
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

// Generate a browser fingerprint
export const generateBrowserFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.availWidth,
    screen.availHeight,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    !!window.indexedDB
  ];
  
  // Create a hash of the fingerprint components
  return CryptoJS.SHA256(components.join('###')).toString();
};

// Verify CSRF token
export const verifyCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken;
};

// Generate a new CSRF token
export const generateCSRFToken = (): string => {
  const token = uuidv4();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push("Mot de passe trop court (minimum 8 caractères)");
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Ajoutez une lettre majuscule");
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Ajoutez une lettre minuscule");
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Ajoutez un chiffre");
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push("Ajoutez un caractère spécial");
  
  // Check for common patterns
  if (/12345|qwerty|azerty|password|motdepasse/i.test(password)) {
    score -= 1;
    feedback.push("Évitez les motifs courants");
  }
  
  return {
    isValid: score >= 3,
    score,
    feedback: feedback.join('. ')
  };
};

// Handle suspicious activity
export const handleSuspiciousActivity = (
  activityType: string,
  userId: string | null | undefined,
  details: Record<string, any>
): void => {
  // Log the suspicious activity
  logSecurityEvent(`suspicious_${activityType}`, userId, details);
  
  // Determine severity level
  const severityMap: Record<string, number> = {
    'login_attempt': 1,
    'password_change': 2,
    'admin_access': 3,
    'data_export': 3,
    'api_abuse': 3,
    'multiple_failed_logins': 2
  };
  
  const severity = severityMap[activityType] || 1;
  
  // Take appropriate action based on severity
  if (severity >= 3) {
    toast.error("Activité suspecte détectée. L'administrateur a été notifié.");
    
    // In a real app, we would send a notification to admins
    const adminAlerts = JSON.parse(localStorage.getItem('admin_security_alerts') || '[]');
    adminAlerts.push({
      id: uuidv4(),
      type: activityType,
      severity: 'high',
      userId,
      timestamp: new Date().toISOString(),
      details
    });
    localStorage.setItem('admin_security_alerts', JSON.stringify(adminAlerts));
  } else if (severity === 2) {
    // Mid-level threat, increase monitoring
    sessionStorage.setItem('security_monitoring_level', 'enhanced');
  }
  
  // Add a security challenge for high-severity events
  if (severity >= 2) {
    sessionStorage.setItem('require_security_verification', 'true');
  }
};

// Check for brute force attempts
export const checkBruteForceAttempts = (identifier: string): boolean => {
  const key = `brute_force_${identifier}`;
  let attempts = JSON.parse(localStorage.getItem(key) || '{"count": 0, "timestamp": 0}');
  
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  // Reset if it's been more than an hour
  if (now - attempts.timestamp > oneHour) {
    attempts = { count: 0, timestamp: now };
  }
  
  // Increment the counter
  attempts.count += 1;
  attempts.timestamp = now;
  
  localStorage.setItem(key, JSON.stringify(attempts));
  
  // Check if we've exceeded the threshold
  return attempts.count > 10;
};

// Generate a random secure token
export const generateSecureToken = (length = 32): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
