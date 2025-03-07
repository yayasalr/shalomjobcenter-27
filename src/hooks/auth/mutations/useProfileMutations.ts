
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "../types";
import { LocalStorageKeys } from "../authUtils";

export const useProfileMutations = (
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const navigate = useNavigate();

  // Enhanced logout function with security logging
  const logout = () => {
    try {
      // Log the logout
      if (user) {
        const logoutLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
        logoutLogs.push({
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
          device: navigator.userAgent,
          action: 'logout'
        });
        localStorage.setItem('login_logs', JSON.stringify(logoutLogs));
      }
      
      // Remove user from state
      setUser(null);
      
      // Remove data from localStorage
      localStorage.removeItem(LocalStorageKeys.USER);
      
      // Notify user of success
      toast.success("Déconnexion réussie");
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // Update user avatar
  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(updatedUser));
    }
  };

  return {
    logout,
    updateUserAvatar
  };
};
