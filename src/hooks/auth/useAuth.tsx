
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./mutations/useLoginMutation";
import { useRegisterMutation } from "./mutations/useRegisterMutation";
import { useLogoutMutation } from "./mutations/useLogoutMutation";
import { AuthContextType, User, LoginCredentials, RegisterData } from "./types";
import { LocalStorageKeys } from "./authUtils";

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
};

const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { login } = useLoginMutation(setUser);
  const { register } = useRegisterMutation(setUser);
  const { logout } = useLogoutMutation(setUser);

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

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
