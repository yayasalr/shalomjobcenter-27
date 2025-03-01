
import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Home, LogIn, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarMobileMenuProps {
  isOpen: boolean;
}

export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({ isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 px-4 z-50 animate-fade-in-down">
      <div className="space-y-4">
        <Link to="/" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
          <div className="flex items-center">
            <Home className="mr-2 h-5 w-5 text-sholom-primary" />
            Accueil
          </div>
        </Link>
        <Link to="/emplois" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
          <div className="flex items-center">
            <BriefcaseBusiness className="mr-2 h-5 w-5 text-sholom-primary" />
            Emplois
          </div>
        </Link>
        <div className="px-4 py-2">
          <div className="font-medium mb-2">Quartiers populaires</div>
          <div className="grid grid-cols-2 gap-2">
            {['Tokoin', 'Bè', 'Adidogomé', 'Agoè'].map(neighborhood => (
              <Link 
                key={neighborhood}
                to={`/?q=${neighborhood}`}
                className="text-sm px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {neighborhood}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <Link to="/login" className="block w-full">
              <Button className="w-full bg-sholom-primary hover:bg-sholom-primary/90">
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
