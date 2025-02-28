
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, User, Globe, BriefcaseBusiness, MapPin, LogIn, ChevronDown, Bell, Home } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Vérifiez si nous sommes sur la page d'accueil
  const isHomePage = location.pathname === "/" || location.pathname === "/index";

  // Détection du scroll pour modifier l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Appliquer les paramètres du site au chargement
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
    
    // Mettre à jour le titre de la page
    document.title = settings.siteName;
    
    // Appliquer le favicon
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.href = settings.logo; // On utilise le logo comme favicon par défaut
  }, [settings.primaryColor, settings.secondaryColor, settings.siteName, settings.logo]);

  return (
    <div
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 shadow-md bg-white/95 backdrop-blur-sm" : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo et Nom du site */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <img 
              src={settings.logo} 
              alt={settings.siteName}
              className="h-10 w-auto site-logo bg-white rounded-md p-1 shadow-sm" 
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </motion.div>
          <motion.span 
            className="text-xl font-bold site-name hidden md:block font-serif" 
            style={{ color: scrolled ? settings.primaryColor : "#111827" }}
            whileHover={{ scale: 1.05 }}
          >
            {settings.siteName}
          </motion.span>
        </Link>

        {/* Navigation principale - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            <div className="flex items-center">
              <Home className="mr-1 h-4 w-4" />
              Accueil
            </div>
          </Link>
          <Link to="/emplois" className="font-medium hover:text-primary transition-colors">
            <div className="flex items-center">
              <BriefcaseBusiness className="mr-1 h-4 w-4" />
              Emplois
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="font-medium flex items-center hover:text-primary transition-colors">
                <MapPin className="mr-1 h-4 w-4" />
                Quartiers
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Populaires à Lomé</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Tokoin', 'Bè', 'Adidogomé', 'Agoè', 'Kodjoviakopé'].map(neighborhood => (
                <DropdownMenuItem key={neighborhood}>
                  <Link to={`/?q=${neighborhood}`} className="w-full">
                    {neighborhood}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/" className="w-full flex items-center justify-between">
                  Tous les quartiers
                  <MapPin className="h-4 w-4" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Barre de recherche */}
        <div className={`hidden lg:flex items-center h-12 rounded-full border border-gray-200 px-4 bg-white/90 shadow-sm transition-all ${
          scrolled ? "border-gray-300" : ""
        }`}>
          <span className="border-r border-gray-300 pr-4 font-medium">
            Partout
          </span>
          <span className="border-r border-gray-300 px-4 font-medium">
            Semaine
          </span>
          <span className="pl-4 pr-2 text-gray-400">Qui?</span>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 h-9 w-9 flex items-center justify-center rounded-full text-white cursor-pointer"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Search className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center gap-4">
          {/* Bouton de langue */}
          <button className="hidden md:flex items-center gap-1 text-sm hover:text-primary transition-colors">
            <Globe className="h-4 w-4" />
            <span>{settings.language === 'fr' ? 'FR' : 'EN'}</span>
          </button>

          {/* Menu utilisateur */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center border border-gray-200 rounded-full px-3 py-1.5 gap-2 bg-white hover:shadow-md cursor-pointer relative"
                >
                  <Menu className="h-4 w-4" />
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-500 overflow-hidden">
                    <img 
                      src={user.avatar || "/placeholder.svg"} 
                      alt={user.name}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="h-2 w-2 absolute top-1 right-2 rounded-full bg-red-500"></div>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/favorites" className="w-full">Favoris</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/reservations" className="w-full">Réservations</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/messages" className="w-full">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/notifications" className="w-full">Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/logout" className="w-full text-red-500">Se déconnecter</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-primary text-white rounded-full px-4 py-2 gap-2 shadow-sm hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4" />
                <span className="font-medium">Connexion</span>
              </motion.div>
            </Link>
          )}

          {/* Bouton pour ouvrir le menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 px-4 z-50 animate-fade-in-down">
          <div className="space-y-4">
            <Link to="/" className="block px-4 py-2 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5 text-primary" />
                Accueil
              </div>
            </Link>
            <Link to="/emplois" className="block px-4 py-2 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center">
                <BriefcaseBusiness className="mr-2 h-5 w-5 text-primary" />
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
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {neighborhood}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <Link to="/login" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
