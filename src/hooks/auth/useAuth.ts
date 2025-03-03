
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, LoginCredentials, RegisterData } from "./types";
import { MOCK_USERS, createWelcomeMessages } from "./authUtils";
import { useUserAvatar } from "./useUserAvatar";

const useAuth = () => {
  const queryClient = useQueryClient();
  const { updateUserAvatar: avatarUpdater } = useUserAvatar();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          return JSON.parse(savedUser) as User;
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("currentUser");
          return null;
        }
      }
      return null;
    },
    staleTime: Infinity, // Keep the data fresh and avoid unnecessary refetches
    cacheTime: Infinity, // Keep data in cache indefinitely
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

      // Créer la conversation de bienvenue
      createWelcomeMessages(userWithoutPassword);
      
      return userWithoutPassword;
    },
    onSuccess: (user) => {
      toast.success("Inscription réussie");
      // Connexion automatique après inscription
      localStorage.setItem("currentUser", JSON.stringify(user));
      queryClient.setQueryData(["auth-user"], user);
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

  // Wrapper function that uses the avatar updater
  const updateUserAvatar = (avatarUrl: string) => {
    if (currentUser) {
      return avatarUpdater(currentUser, avatarUrl);
    }
  };

  return {
    user: currentUser,
    isLoading,
    login,
    register,
    logout,
    updateUserAvatar,
  };
};

export default useAuth;
