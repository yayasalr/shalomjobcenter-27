
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, LoginCredentials, RegisterData } from "./types";
import { MOCK_USERS, createWelcomeMessages } from "./authUtils";
import { useUserAvatar } from "./useUserAvatar";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const queryClient = useQueryClient();
  const { updateUserAvatar: avatarUpdater } = useUserAvatar();
  const navigate = useNavigate();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser) as User;
          console.log("Utilisateur chargé depuis localStorage:", user);
          
          // Vérifier si la session est encore valide
          const sessionExpiry = localStorage.getItem("session_expiry");
          if (sessionExpiry && new Date().getTime() > parseInt(sessionExpiry)) {
            console.log("Session expirée, déconnexion automatique");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("session_expiry");
            return null;
          }
          
          return user;
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("currentUser");
          return null;
        }
      }
      return null;
    },
    staleTime: Infinity, // Keep the data fresh and avoid unnecessary refetches
    gcTime: Infinity, // Keep data in cache indefinitely (renamed from cacheTime)
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Charge les utilisateurs du localStorage ou utilise les données par défaut
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
      
      // Si c'est la première fois qu'on utilise les utilisateurs par défaut, les enregistrer
      if (!storedUsers) {
        localStorage.setItem("users", JSON.stringify(MOCK_USERS));
      }
      
      const user = users.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error("Identifiants invalides");
      }
      
      // Journalisation des connexions
      const loginHistory = JSON.parse(localStorage.getItem("login_history") || "[]");
      loginHistory.push({
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
        success: true
      });
      localStorage.setItem("login_history", JSON.stringify(loginHistory));
      
      // Définir une expiration de session (24 heures)
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem("session_expiry", expiryTime.toString());
      
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      console.log("Utilisateur connecté:", userWithoutPassword);
      return userWithoutPassword;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-user"], user);
      toast.success("Connexion réussie");
      
      // Rediriger vers la page d'accueil par défaut
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      // Journalisation des échecs de connexion
      const loginHistory = JSON.parse(localStorage.getItem("login_history") || "[]");
      loginHistory.push({
        email: (error as any).email || "unknown",
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      });
      localStorage.setItem("login_history", JSON.stringify(loginHistory));
      
      toast.error("Échec de la connexion");
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Charge les utilisateurs du localStorage ou utilise les données par défaut
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
      
      // Si c'est la première fois qu'on utilise les utilisateurs par défaut, les enregistrer
      if (!storedUsers) {
        localStorage.setItem("users", JSON.stringify(MOCK_USERS));
      }
      
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
      
      console.log("Nouvel utilisateur enregistré:", userWithoutPassword);
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
      localStorage.removeItem("session_expiry");
      console.log("Utilisateur déconnecté");
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      toast.success("Déconnexion réussie");
      navigate("/login");
    },
  });

  // Wrapper function that uses the avatar updater
  const updateUserAvatar = (avatarUrl: string) => {
    if (currentUser) {
      return avatarUpdater(currentUser, avatarUrl);
    }
  };

  // Vérifier si l'utilisateur a le rôle admin
  const isAdmin = currentUser?.role === "admin";

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!currentUser;

  return {
    user: currentUser,
    isLoading,
    login,
    register,
    logout,
    updateUserAvatar,
    isAdmin,
    isAuthenticated
  };
};

export default useAuth;
