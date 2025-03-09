
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, LoginCredentials, RegisterData } from "./types";
import { LocalStorageKeys, hashPassword, logSecurityEvent, generateTrustedDeviceToken, verifySecurityInitialization } from "./authUtils";
import { useLoginMutation } from "./mutations/useLoginMutation";
import useLocalStorage from "@/hooks/useLocalStorage";

export const useAuthMutations = (
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const { login } = useLoginMutation(user, setUser);
  const navigate = useNavigate();
  const [registerLoading, setRegisterLoading] = useState(false);
  const { getItem, setItem, removeItem } = useLocalStorage();

  const register = async (userData: RegisterData): Promise<User | void> => {
    setRegisterLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const salt = Math.random().toString(36).substring(2);
      const hashedPassword = hashPassword(userData.password, salt);
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        role: userData.email.includes('admin') ? 'admin' : 'user',
        isAdmin: userData.email.includes('admin'),
        lastLogin: new Date().toISOString(),
        loginCount: 1,
        securityLevel: 'standard',
        // Use avatar if provided, otherwise generate initials
        avatar: userData.avatar || null
      };
      
      // Store the user in localStorage
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(newUser));
      
      // Store credentials (for demo purposes only - don't do this in production!)
      localStorage.setItem(`user_credentials_${newUser.id}`, JSON.stringify({
        email: userData.email,
        passwordHash: hashedPassword,
        salt
      }));
      
      // Generate a trusted device token
      generateTrustedDeviceToken(newUser.id);
      
      // Log the registration
      logSecurityEvent('user_registered', newUser.id, {
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
      
      // Update state
      setUser(newUser);
      
      // Save user preferences with defaults
      setItem('user_accent_color', 'purple');
      setItem('user_layout', 'default');
      setItem('user_notification_preferences', {
        email: true,
        push: true, 
        reservation: true,
        promotional: false
      });
      
      // Save avatar if provided
      if (userData.avatar) {
        localStorage.setItem('userAvatar', userData.avatar);
      }
      
      toast.success("Compte créé avec succès!");
      
      // Redirect to home or admin based on role
      navigate(newUser.isAdmin ? "/admin" : "/");
      
      return newUser;
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Erreur lors de la création du compte");
      return;
    } finally {
      setRegisterLoading(false);
    }
  };

  const logout = () => {
    try {
      if (user) {
        // Log the logout event
        logSecurityEvent('user_logout', user.id, {
          email: user.email,
          isAdmin: user.isAdmin
        });
      }
      
      // Remove user data from localStorage but preserve preferences
      localStorage.removeItem(LocalStorageKeys.USER);
      
      // Clear auth tokens
      localStorage.removeItem(LocalStorageKeys.AUTH_TOKEN);
      localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
      
      // Update state
      setUser(null);
      
      toast.success("Déconnexion réussie!");
      
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };
  
  // Update user profile
  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour mettre à jour votre profil");
      return;
    }
    
    try {
      // Update user object
      const updatedUser = { ...user, ...updatedData };
      
      // Update localStorage
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      toast.success("Profil mis à jour avec succès");
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };
  
  // Method to update user avatar specifically
  const updateUserAvatar = (avatarUrl: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour modifier votre avatar");
      return;
    }
    
    try {
      // Also store the avatar separately to ensure it's preserved on refresh
      localStorage.setItem('userAvatar', avatarUrl);
      
      return updateUserProfile({ avatar: avatarUrl });
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Erreur lors de la mise à jour de l'avatar");
    }
  };

  return {
    login,
    register,
    logout,
    updateUserProfile,
    updateUserAvatar,
    registerLoading,
  };
};
