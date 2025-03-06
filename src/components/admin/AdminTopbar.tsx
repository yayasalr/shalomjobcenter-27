import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

interface AdminTopbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminTopbar = ({ isSidebarOpen, toggleSidebar }: AdminTopbarProps) => {
  const { user, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  if (!user) return null;

  const initials = user?.name
    ? `${user.name.charAt(0)}${user.name.split(" ")[1]?.charAt(0) || ""}`
    : "A";

  return (
    <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="hidden md:flex md:w-80">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full bg-background pl-8 md:w-[320px] lg:w-[440px]"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
              aria-label="Menu administration"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name || "Admin"} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/user/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminTopbar;
