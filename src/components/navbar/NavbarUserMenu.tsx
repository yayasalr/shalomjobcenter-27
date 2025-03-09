
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  User,
  Settings,
  LogOut,
  Heart,
  CalendarDays,
  MessageSquare,
  Bell,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface NavbarUserMenuProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const NavbarUserMenu = ({ mobileMenuOpen, setMobileMenuOpen }: NavbarUserMenuProps) => {
  const { user, logout } = useAuth();
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(user?.avatar);
  const [avatarKey, setAvatarKey] = useState(Date.now());

  useEffect(() => {
    // Check for avatar in localStorage first (for immediate updates)
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setAvatarSrc(storedAvatar);
      setAvatarKey(Date.now());
    } else if (user?.avatar) {
      setAvatarSrc(user.avatar);
      setAvatarKey(Date.now());
    }

    // Set up listener for avatar changes
    const checkForAvatarUpdates = () => {
      const currentStoredAvatar = localStorage.getItem('userAvatar');
      if (currentStoredAvatar && currentStoredAvatar !== avatarSrc) {
        setAvatarSrc(currentStoredAvatar);
        setAvatarKey(Date.now());
      }
    };

    const intervalId = setInterval(checkForAvatarUpdates, 2000);
    return () => clearInterval(intervalId);
  }, [user?.avatar]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="outline" size="sm">
            Connexion
          </Button>
        </Link>
        <Link to="/register">
          <Button size="sm">Inscription</Button>
        </Link>
      </div>
    );
  }

  const initials = user?.name
    ? `${user.name.charAt(0)}${user.name.split(" ")[1]?.charAt(0) || ""}`
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-14 w-14 rounded-full border-2 border-blue-200 shadow-sm hover:border-primary hover:border-opacity-80 focus:ring-2 focus:ring-primary focus:ring-offset-2 p-0 overflow-hidden"
          aria-label="Menu utilisateur"
        >
          <div className="h-full w-full rounded-full overflow-hidden">
            {avatarSrc ? (
              <img 
                key={avatarKey}
                src={avatarSrc} 
                alt={user.name || "Utilisateur"}
                className="user-avatar-display"
              />
            ) : (
              <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl font-bold">{initials}</span>
              </div>
            )}
          </div>
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
        {user.isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Espace Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mon Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/favorites" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Favoris</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/reservations" className="cursor-pointer">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Réservations</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/messages" className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
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
  );
};

export default NavbarUserMenu;
export { NavbarUserMenu };
