
import { useState, useEffect, createContext, useContext } from "react";
import { User, AuthContextType } from "./types";
import { LocalStorageKeys } from "./authUtils";
import { useSecurityFeatures } from "./useSecurityFeatures";
import { useAuthMutations } from "./useAuthMutations";

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on load
  useEffect(() => {
    const storedUser = localStorage.getItem(LocalStorageKeys.USER);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Check if the account is locked
        if (parsedUser.lockedUntil && new Date(parsedUser.lockedUntil) > new Date()) {
          console.log("Account locked until", new Date(parsedUser.lockedUntil));
          // Don't connect the user if their account is locked
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem(LocalStorageKeys.USER);
      }
    }
    setLoading(false);
  }, []);

  // Get security features
  const securityFeatures = useSecurityFeatures(user);
  
  // Get authentication mutations
  const authMutations = useAuthMutations(user, setUser);

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;
  const isLoading = loading;

  // Default implementations for required interface methods
  const checkDeviceTrusted = (userId: string) => {
    // Implementation of device trust verification
    const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
    const currentDeviceId = localStorage.getItem('current_device_id');
    return trustedDevices.includes(currentDeviceId);
  };

  const handleSecurityAlert = (type: string, details: any) => {
    // Basic implementation to log security alerts
    console.warn(`Security Alert [${type}]:`, details);
    const securityAlerts = JSON.parse(localStorage.getItem('security_alerts') || '[]');
    securityAlerts.push({
      type,
      details,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_alerts', JSON.stringify(securityAlerts));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      isLoading,
      isAuthenticated,
      isAdmin,
      ...authMutations,
      ...securityFeatures,
      checkDeviceTrusted,
      handleSecurityAlert
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
