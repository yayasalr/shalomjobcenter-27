
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'host' | 'admin';
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

// Simulation de stockage local des utilisateurs
const MOCK_USERS = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    password: "password123",
    role: "host" as const,
  },
];

const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        return JSON.parse(savedUser) as User;
      }
      return null;
    },
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const users = JSON.parse(localStorage.getItem("users") || JSON.stringify(MOCK_USERS));
      const user = users.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      );
      if (!user) {
        throw new Error("Identifiants invalides");
      }
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-user"], user);
      toast.success("Connexion réussie");
    },
    onError: () => {
      toast.error("Échec de la connexion");
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const users = JSON.parse(localStorage.getItem("users") || JSON.stringify(MOCK_USERS));
      const existingUser = users.find((u: any) => u.email === data.email);
      if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
      }
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        role: "user" as const,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    },
    onSuccess: () => {
      toast.success("Inscription réussie");
    },
    onError: () => {
      toast.error("Échec de l'inscription");
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("currentUser");
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      toast.success("Déconnexion réussie");
    },
  });

  return {
    user: currentUser,
    isLoading,
    login,
    register,
    logout,
  };
};

export default useAuth;
