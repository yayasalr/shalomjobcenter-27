
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, Briefcase, Home } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-airbnb-red font-bold text-2xl">
            Location+
          </Link>

          {/* Navigation principale - Seulement Emplois et Logements */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/emplois" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <span>Offres d'emploi</span>
            </Link>
            <Link to="/" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
              <Home className="h-5 w-5" />
              <span>Logements</span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Rechercher un logement..."
                className="w-full pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Navigation utilisateur */}
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Bonjour, {user.name}
                </span>
                <Button
                  variant="ghost"
                  className="text-gray-700"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" className="text-gray-700">
                      Administration
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-airbnb-red hover:bg-airbnb-red/90 text-white">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
