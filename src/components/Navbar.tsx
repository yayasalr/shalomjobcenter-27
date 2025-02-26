
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, User, Globe } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { user } = useAuth();

  // Vérifiez si nous sommes sur la page d'accueil
  const isHomePage = location.pathname === "/" || location.pathname === "/index";

  // Appliquer les paramètres du site au chargement
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
  }, [settings.primaryColor, settings.secondaryColor]);

  return (
    <div
      className={`w-full border-b border-gray-200 ${
        isHomePage ? "sticky top-0 z-50 bg-white" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo et Nom du site */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={settings.logo} 
            alt={settings.siteName}
            className="h-8 w-auto site-logo" 
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <span 
            className="text-xl font-bold site-name hidden md:block" 
            style={{ color: settings.primaryColor }}
          >
            {settings.siteName}
          </span>
        </Link>

        {/* Barre de recherche */}
        <div className="hidden md:flex items-center h-12 rounded-full border border-gray-200 px-4 hover:shadow-md">
          <span className="border-r border-gray-300 pr-4 font-medium">
            Partout
          </span>
          <span className="border-r border-gray-300 px-4 font-medium">
            Semaine
          </span>
          <span className="pl-4 pr-2 text-gray-400">Qui?</span>
          <div className="ml-2 h-8 w-8 flex items-center justify-center rounded-full bg-airbnb-red text-white cursor-pointer" style={{ backgroundColor: settings.primaryColor }}>
            <Search className="h-4 w-4" />
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center gap-4">
          {/* Bouton de langue */}
          <button className="hidden md:flex items-center gap-1 text-sm">
            <Globe className="h-4 w-4" />
            <span>{settings.language === 'fr' ? 'FR' : 'EN'}</span>
          </button>

          {/* Menu utilisateur */}
          <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 gap-2 hover:shadow-md cursor-pointer">
            <Menu className="h-4 w-4" />
            <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-500 text-white">
              {user ? (
                <img 
                  src={user.avatar || "/placeholder.svg"} 
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover" 
                />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            {/* Afficher notification si l'utilisateur est connecté */}
            {user && (
              <span className="h-2 w-2 rounded-full bg-red-500 absolute top-3 right-3"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
