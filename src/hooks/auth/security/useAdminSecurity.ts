
import { toast } from "sonner";
import { User } from "../types";

export const useAdminSecurity = (user: User | null) => {
  // Admin functions for security management
  const unlockUserAccount = (email: string) => {
    if (!user?.isAdmin) {
      toast.error("Seul un administrateur peut effectuer cette action");
      return false;
    }
    
    localStorage.removeItem(`login_attempts_${email}`);
    
    // Log the account unlocking
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: 'account_unlocked',
      adminId: user.id,
      targetEmail: email,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    
    toast.success(`Compte ${email} déverrouillé avec succès`);
    return true;
  };

  const updateUserSecurityLevel = (userId: string, level: 'standard' | 'high' | 'restricted') => {
    if (!user?.isAdmin) {
      toast.error("Seul un administrateur peut effectuer cette action");
      return false;
    }
    
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => {
      if (u.id === userId) {
        return { ...u, securityLevel: level };
      }
      return u;
    });
    
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));
    
    // Log the security level change
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: 'security_level_changed',
      adminId: user.id,
      targetUserId: userId,
      newLevel: level,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    
    toast.success(`Niveau de sécurité mis à jour pour l'utilisateur`);
    return true;
  };

  return {
    unlockUserAccount,
    updateUserSecurityLevel
  };
};
