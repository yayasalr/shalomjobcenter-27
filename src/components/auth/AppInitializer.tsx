
import { useEffect } from 'react';
import { ensureAdminAccount, resetAdminCredentials } from '@/hooks/auth/adminUtils';

const AppInitializer = () => {
  useEffect(() => {
    // Initialiser les données nécessaires pour la démo
    ensureAdminAccount();
    
    // Pour les besoins de la démo, réinitialiser les identifiants admin
    // afin de garantir que le mot de passe correct est utilisé
    resetAdminCredentials();
    
    // Initialiser d'autres données si nécessaire
    if (!localStorage.getItem('all_users')) {
      localStorage.setItem('all_users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('login_logs')) {
      localStorage.setItem('login_logs', JSON.stringify([]));
    }
    
  }, []);

  return null;
};

export default AppInitializer;
