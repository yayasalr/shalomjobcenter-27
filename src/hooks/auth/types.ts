
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'host' | 'admin';
  isAdmin?: boolean; // Adding isAdmin property
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
  login: (userData: User) => void;
  logout: () => void;
  registerUser: (userData: User) => void;
}
