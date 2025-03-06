
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAdmin = false 
}) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Si on est en train de charger l'utilisateur, on affiche un écran de chargement
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
    </div>;
  }

  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si la route nécessite un rôle admin et que l'utilisateur n'est pas admin
  if (requireAdmin && !isAdmin) {
    toast.error("Vous n'avez pas les droits pour accéder à cette page");
    return <Navigate to="/" replace />;
  }

  // Si tout est bon, on affiche le contenu protégé
  return <>{children}</>;
};
