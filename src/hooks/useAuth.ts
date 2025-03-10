
import { useAuth } from './auth/AuthProvider';
export { useAuth };
export type { User, LoginCredentials, RegisterData, AuthContextType } from './auth/types';

// No default export - this avoids the duplicate identifier issue
