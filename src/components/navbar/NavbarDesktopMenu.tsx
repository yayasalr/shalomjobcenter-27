
import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, ChevronDown, Home, HelpCircle, Info, MapPin, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavbarDesktopMenu = () => {
  return (
    <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
      <Link to="/" className="font-medium hover:text-sholom-primary transition-colors">
        <div className="flex items-center">
          <Home className="mr-1 h-4 w-4" />
          Accueil
        </div>
      </Link>
      <Link to="/emplois" className="font-medium hover:text-sholom-primary transition-colors">
        <div className="flex items-center">
          <BriefcaseBusiness className="mr-1 h-4 w-4" />
          Emplois
        </div>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="font-medium flex items-center hover:text-sholom-primary transition-colors">
            <MapPin className="mr-1 h-4 w-4" />
            Quartiers
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Populaires à Lomé</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {['Tokoin', 'Bè', 'Adidogomé', 'Agoè', 'Kodjoviakopé'].map(neighborhood => (
            <DropdownMenuItem key={neighborhood} className="touch-optimized">
              <Link to={`/?q=${neighborhood}`} className="w-full">
                {neighborhood}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="touch-optimized">
            <Link to="/" className="w-full flex items-center justify-between">
              Tous les quartiers
              <MapPin className="h-4 w-4" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="font-medium flex items-center hover:text-sholom-primary transition-colors">
            <Info className="mr-1 h-4 w-4" />
            À propos
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem className="touch-optimized">
            <Link to="/about" className="w-full flex items-center">
              <Info className="mr-2 h-4 w-4" />
              À propos de nous
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="touch-optimized">
            <Link to="/contact" className="w-full flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Nous contacter
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="touch-optimized">
            <Link to="/support" className="w-full flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
