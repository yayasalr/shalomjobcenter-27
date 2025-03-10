
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
