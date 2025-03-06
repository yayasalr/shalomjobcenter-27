
import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, AuthContextType, RegisterData } from "./types";
import { LocalStorageKeys } from "./authUtils";

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on load
  useEffect(() => {
    const storedUser = localStorage.getItem(LocalStorageKeys.USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem(LocalStorageKeys.USER);
      }
    }
    setLoading(false);
  }, []);

  // Enhanced login function with mutateAsync
  const login = {
    mutateAsync: async (userData: any): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: userData.email,
            name: userData.email.split('@')[0],
            role: userData.email.includes('admin') ? 'admin' : 'user',
            isAdmin: userData.email.includes('admin')
          };
          
          setUser(newUser);
          localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(newUser));
          toast.success("Connexion réussie!");
          navigate(newUser.isAdmin ? "/admin" : "/");
          resolve();
        }, 500);
      });
    },
    isPending: false
  };

  // Mock register function with Promise for mutateAsync
  const register = {
    mutateAsync: async (data: RegisterData): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: data.email,
            name: data.name,
            role: 'user'
          };
          
          registerUser(newUser);
          resolve();
        }, 500);
      });
    },
    isPending: false
  };

  // Enhanced logout function
  const logout = () => {
    try {
      // Remove user from state
      setUser(null);
      
      // Remove data from localStorage
      localStorage.removeItem(LocalStorageKeys.USER);
      
      // Notify user of success
      toast.success("Déconnexion réussie");
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const registerUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(userData));
    toast.success("Inscription réussie!");
    navigate("/");
  };

  // Update user avatar
  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(updatedUser));
    }
  };

  // Mock session refresh
  const refreshSession = () => {
    console.log("Refreshing user session");
    // In a real app, this would validate and refresh tokens
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;
  const isLoading = loading;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      isLoading,
      isAuthenticated,
      isAdmin,
      login, 
      logout, 
      registerUser,
      register,
      refreshSession,
      updateUserAvatar
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
