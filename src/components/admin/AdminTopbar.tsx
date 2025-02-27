
import React from "react";
import { Link } from "react-router-dom";
import { 
  Bell, Search, User, Settings, Sun, Moon, 
  MessageSquare, Menu, ChevronDown, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const AdminTopbar = () => {
  const { settings } = useSiteSettings();

  return (
    <header className="h-16 flex items-center border-b bg-white px-4 sticky top-0 z-30">
      <div className="flex items-center w-full">
        <div className="flex items-center md:hidden">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
        </div>
        
        <div className="flex items-center mr-4">
          <Link to="/" className="text-sholom-primary hover:text-sholom-primary/80 mr-3">
            <Home className="h-5 w-5" />
          </Link>
          <div className="hidden sm:flex items-center text-sm">
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <ChevronDown className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">
              {window.location.pathname.includes('emplois') 
                ? 'Offres d\'emploi' 
                : window.location.pathname.includes('logements')
                  ? 'Logements'
                  : window.location.pathname.includes('reservations')
                    ? 'Réservations'
                    : 'Administration'}
            </span>
          </div>
        </div>
        
        <div className="hidden lg:flex relative flex-1 mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-9 max-w-sm"
          />
        </div>
        
        <div className="flex items-center ml-auto space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-600 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-600 relative">
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-sholom-primary text-white text-xs">3</Badge>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-0 h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Sun className="mr-2 h-4 w-4" />
                <span>Thème clair</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
