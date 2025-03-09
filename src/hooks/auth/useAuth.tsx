
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./mutations/useLoginMutation";
import { useRegisterMutation } from "./mutations/useRegisterMutation";
import { useLogoutMutation } from "./mutations/useLogoutMutation";
import { AuthContextType, User, LoginCredentials, RegisterData } from "./types";
import { LocalStorageKeys } from "./authUtils";
import { useSecurityFeatures } from "./useSecurityFeatures";

const initialContext: AuthContextType = {
  user: null,
  login: {
    mutateAsync: async () => {},
    isPending: false,
  },
  register: {
    mutateAsync: async () => {},
    isPending: false,
  },
  logout: () => {},
  isLoading: true,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  updateUserProfile: () => undefined,
  updateUserAvatar: () => undefined,
  registerLoading: false,
  refreshSession: () => {},
  checkAccountLocked: () => ({ locked: false, remainingMinutes: 0 }),
  updateLoginAttempts: () => ({ count: 0, timestamp: 0 }),
  checkDeviceTrusted: () => false,
  handleSecurityAlert: () => {}
};

const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { 
    refreshSession: refreshSecuritySession,
    unlockUserAccount, 
    updateUserSecurityLevel, 
    checkAccountLocked, 
    getLoginAttempts, 
    updateLoginAttempts 
  } = useSecurityFeatures(user);

  // Define missing security functions
  const checkDeviceTrusted = (userId: string) => {
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
    const storedFingerprint = localStorage.getItem(`fingerprint_${userId}`);
    return storedFingerprint === fingerprint;
  };
  
  const handleSecurityAlert = (type: string, details: any) => {
    console.warn(`Security alert: ${type}`, details);
    // Record this in security logs
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: 'security_alert',
      alertType: type,
      details,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
  };

  // Create a logout function
  const { logout } = useLogoutMutation(setUser);

  const { login } = useLoginMutation(user, setUser);
  const { register, registerUser } = useRegisterMutation(setUser);

  // Update User Profile function
  const updateUserProfile = (updatedData: Partial<User>): User | undefined => {
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Update User Avatar function
  const updateUserAvatar = (avatarUrl: string): User | undefined => {
    return updateUserProfile({ avatar: avatarUrl });
  };

  // Refresh session function
  const refreshSession = () => {
    try {
      const storedUser = localStorage.getItem(LocalStorageKeys.USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      // Also refresh security session
      refreshSecuritySession();
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(LocalStorageKeys.USER);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    loading: isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    updateUserProfile,
    updateUserAvatar,
    registerLoading: register.isPending,
    refreshSession,
    checkAccountLocked,
    updateLoginAttempts,
    checkDeviceTrusted,
    handleSecurityAlert
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
