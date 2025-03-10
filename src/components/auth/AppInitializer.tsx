
import { useEffect } from 'react';
import { ensureAdminAccount } from '@/hooks/auth/adminUtils';

export const AppInitializer = () => {
  useEffect(() => {
    // S'assurer qu'un compte administrateur existe toujours
    ensureAdminAccount();
    
    // Autres initialisations potentielles
    
  }, []);
  
  return null; // Ce composant ne rend rien visuellement
};
