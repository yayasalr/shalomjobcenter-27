
import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, AuthContextType } from "./types";
import { LocalStorageKeys } from "./authUtils";

// Création du contexte d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté au chargement
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

  // Fonction de connexion
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(userData));
    toast.success("Connexion réussie!");
    navigate(userData.isAdmin ? "/admin/dashboard" : "/");
  };

  // Fonction de déconnexion améliorée
  const logout = () => {
    try {
      // Supprimer l'utilisateur de l'état
      setUser(null);
      
      // Supprimer les données du localStorage
      localStorage.removeItem(LocalStorageKeys.USER);
      
      // Notifier l'utilisateur du succès
      toast.success("Déconnexion réussie");
      
      // Rediriger vers la page d'accueil
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
