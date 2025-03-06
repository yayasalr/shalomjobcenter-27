
import React, { useState } from "react";
import { NavbarDesktopMenu } from "./NavbarDesktopMenu";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import useAuth from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <NavbarLogo />
        
        {/* Mobile menu toggle button */}
        <div className="md:hidden flex flex-1 justify-end">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        
        {/* Pass isOpen prop to NavbarMobileMenu */}
        <NavbarMobileMenu isOpen={isMenuOpen} />
        
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <NavbarDesktopMenu />
          {/* User menu added directly in the navbar component */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{user.name}</span>
                {/* Add any user-specific UI elements here */}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a href="/login" className="text-sm font-medium">Connexion</a>
                <a href="/register" className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium">S'inscrire</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
