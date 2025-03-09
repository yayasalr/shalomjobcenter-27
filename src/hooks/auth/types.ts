
// User Type
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  isAdmin: boolean;
  lastLogin: string;
  loginCount: number;
  securityLevel: 'low' | 'standard' | 'high';
  avatar?: string | null;
  lockedUntil?: string | null;
  requiresPasswordChange?: boolean;
  twoFactorEnabled?: boolean;
  verifiedEmail?: boolean;
  created?: string;
  company?: string;
  phone?: string;
  notifications?: NotificationPreferences;
}

// Login Credentials Type
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration Data Type
export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  acceptTerms: boolean;
  avatar?: string;
}

// Reset Password Data Type
export interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  
  // Mutations
  login: {
    mutateAsync: (userData: LoginCredentials) => Promise<User | void>;
    isPending: boolean;
  };
  register: (userData: RegisterData) => Promise<User | void>;
  logout: () => void;
  updateUserProfile: (updatedData: Partial<User>) => User | undefined;
  updateUserAvatar: (avatarUrl: string) => User | undefined;
  registerLoading: boolean;
  
  // Security features
  checkAccountLocked: (email: string) => { locked: boolean; remainingMinutes: number };
  updateLoginAttempts: (email: string, increment?: boolean) => { count: number; timestamp: number };
  checkDeviceTrusted: (userId: string) => boolean;
  handleSecurityAlert: (type: string, details: any) => void;
}

// Notification Preferences Type
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  reservation: boolean;
  promotional: boolean;
}
