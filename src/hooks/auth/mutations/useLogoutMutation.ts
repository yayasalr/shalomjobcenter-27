
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import { LocalStorageKeys, logSecurityEvent } from "../authUtils";
import { toast } from "sonner";

export const useLogoutMutation = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const navigate = useNavigate();

  const logout = () => {
    try {
      // Get user info before logging out to record in logs
      const userData = localStorage.getItem(LocalStorageKeys.USER);
      let userId = null;
      
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id;
        
        // Log the logout event
        logSecurityEvent('user_logout', userId, {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
      }
      
      // Remove user data
      localStorage.removeItem(LocalStorageKeys.USER);
      
      // Clear other auth-related items
      localStorage.removeItem(LocalStorageKeys.AUTH_TOKEN);
      localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
      
      // Update state
      setUser(null);
      
      // Show toast message
      toast.success("Vous avez été déconnecté avec succès");
      
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Une erreur s'est produite lors de la déconnexion");
    }
  };

  return { logout };
};
