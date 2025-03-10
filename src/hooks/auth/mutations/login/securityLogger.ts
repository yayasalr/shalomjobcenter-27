
import { User } from "../../types";

/**
 * Log login security events
 */
export const logLoginActivity = (user: User, success: boolean, isAdmin: boolean = false): void => {
  try {
    const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
    loginLogs.push({
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
      device: navigator.userAgent,
      success,
      isAdmin
    });
    localStorage.setItem('login_logs', JSON.stringify(loginLogs));
  } catch (error) {
    console.error("Error logging login activity:", error);
  }
};

export const logSecurityEvent = (eventType: string, details: any = {}): void => {
  try {
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: eventType,
      timestamp: new Date().toISOString(),
      ipAddress: 'client-side',
      userAgent: navigator.userAgent,
      ...details
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
  } catch (error) {
    console.error("Error logging security event:", error);
  }
};
