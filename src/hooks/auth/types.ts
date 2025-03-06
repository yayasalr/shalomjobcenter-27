
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isAdmin?: boolean;
  created?: string;
  lastLogin?: string;
  loginCount?: number;
  securityLevel?: 'standard' | 'high' | 'restricted';
  lockedUntil?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: {
    mutateAsync: (userData: LoginCredentials) => Promise<void>;
    isPending: boolean;
  };
  register: {
    mutateAsync: (data: RegisterData) => Promise<void>;
    isPending: boolean;
  };
  logout: () => void;
  registerUser: (userData: User) => void;
  refreshSession: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  // Nouvelles fonctions de sécurité
  unlockUserAccount?: (email: string) => boolean;
  updateUserSecurityLevel?: (userId: string, level: 'standard' | 'high' | 'restricted') => boolean;
  checkAccountLocked?: (email: string) => { locked: boolean; remainingMinutes: number };
}
