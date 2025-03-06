import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

export interface NavbarMobileMenuProps {
  isOpen: boolean;
}

export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({ isOpen }) => {
  const { user, logout } = useAuth();
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden">
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-end mb-8">
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <nav className="flex flex-col items-center space-y-6 text-lg font-medium">
          <Link to="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link to="/emplois" className="hover:text-primary transition-colors">
            Emplois
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors">
            À propos
          </Link>
          <Link to="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
          
          {user ? (
            <>
              <Link to="/profile" className="hover:text-primary transition-colors">
                Mon profil
              </Link>
              <Link to="/favorites" className="hover:text-primary transition-colors">
                Mes favoris
              </Link>
              <Link to="/reservations" className="hover:text-primary transition-colors">
                Mes réservations
              </Link>
              <Link to="/messages" className="hover:text-primary transition-colors">
                Messages
              </Link>
              <Link to="/notifications" className="hover:text-primary transition-colors">
                Notifications
              </Link>
              <Button 
                onClick={logout} 
                variant="outline" 
                className="border-primary text-primary"
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-primary font-semibold transition-colors">
                Connexion
              </Link>
              <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-full transition-colors">
                S'inscrire
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
