
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'host' | 'admin';
  isAdmin?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Added for ProtectedRoute
  isAuthenticated: boolean; // Added for Login and ProtectedRoute
  isAdmin: boolean; // Added for Login and ProtectedRoute
  refreshSession: () => void; // Added for ProtectedRoute
  updateUserAvatar: (avatarUrl: string) => void; // Added for Profile
  login: (userData: User) => void;
  register: { // Added for Register
    mutateAsync: (data: RegisterData) => Promise<void>;
    isPending: boolean;
  };
  logout: () => void;
  registerUser: (userData: User) => void;
}
