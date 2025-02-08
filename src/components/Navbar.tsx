
import { Globe, Menu, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/lovable-uploads/56b4c90c-8c1e-4d6f-9603-f4efa6a25652.png" alt="Airbnb" className="h-8 w-auto" />
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
                placeholder="Rechercher une destination"
                className="border-0 focus:ring-0 rounded-l-full"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <Button
                type="button"
                className="rounded-r-full bg-airbnb-red hover:bg-airbnb-red/90 text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="hidden md:flex items-center space-x-2 hover:bg-gray-100 rounded-full"
            >
              <span>Mettre mon logement sur Airbnb</span>
            </Button>
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
