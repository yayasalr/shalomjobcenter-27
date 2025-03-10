
import { toast } from "sonner";
import { User, RegisterData } from "../../types";
import { LocalStorageKeys } from "../../constants";

/**
 * Create a new user and add it to localStorage
 */
export const createUser = (data: RegisterData): User => {
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name || data.email.split('@')[0],
    role: 'user',
    isAdmin: false,
    created: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1,
    securityLevel: 'standard'
  };
  
  // Add the user to the list of users
  const existingUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
  existingUsers.push(newUser);
  localStorage.setItem('all_users', JSON.stringify(existingUsers));
  
  // Log the account creation
  logAccountCreation(newUser);
  
  return newUser;
};

/**
 * Store registered user in local storage and display success message
 */
export const completeRegistration = (user: User, setUser: React.Dispatch<React.SetStateAction<User | null>>): void => {
  setUser(user);
  localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user));
  toast.success("Inscription réussie!");
};

/**
 * Log the user creation to security logs
 */
const logAccountCreation = (user: User): void => {
  const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
  securityLogs.push({
    type: 'account_created',
    userId: user.id,
    email: user.email,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
  localStorage.setItem('security_logs', JSON.stringify(securityLogs));
};
