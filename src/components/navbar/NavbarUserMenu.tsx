
import React from "react";
import { Link } from "react-router-dom";
import { Globe, LogIn, Menu } from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarUserMenuProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const { user } = useAuth();
  const { settings } = useSiteSettings();
  
  return (
    <div className="flex items-center gap-4">
      {/* Bouton de langue */}
      <button className="hidden md:flex items-center gap-1 text-sm hover:text-sholom-primary transition-colors">
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
            className="flex items-center bg-sholom-primary text-white rounded-full px-4 py-2 gap-2 shadow-sm hover:bg-sholom-primary/90"
          >
            <LogIn className="h-4 w-4" />
            <span className="font-medium">Connexion</span>
          </motion.div>
        </Link>
      )}
    </div>
  );
};
