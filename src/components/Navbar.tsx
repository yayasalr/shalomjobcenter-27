
import { Globe, Menu, Search, User, Briefcase, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img src="/lovable-uploads/56b4c90c-8c1e-4d6f-9603-f4efa6a25652.png" alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 ${
                location.pathname === '/' ? 'text-black' : 'text-gray-500'
              } hover:text-black transition-colors`}
            >
              <Home className="h-5 w-5" />
              <span>Logements</span>
            </Link>
            <Link 
              to="/emplois" 
              className={`flex items-center space-x-2 ${
                location.pathname.includes('/emploi') ? 'text-black' : 'text-gray-500'
              } hover:text-black transition-colors`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Emplois</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:block flex-1 max-w-2xl mx-8">
            <div
              className={`flex items-center rounded-full border ${
                searchFocused ? "shadow-lg" : "shadow-sm"
              } transition-shadow duration-200`}
            >
              <Input
                type="text"
                placeholder="Rechercher..."
                className="border-0 focus:ring-0 rounded-l-full"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <Button
                type="button"
                className="rounded-r-full bg-primary hover:bg-primary/90 text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="hidden md:flex items-center space-x-2 hover:text-primary transition-colors"
            >
              <span>Administration</span>
            </Link>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-gray-100 p-2"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full border-gray-300"
            >
              <Menu className="h-5 w-5" />
              <User className="h-7 w-7 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
