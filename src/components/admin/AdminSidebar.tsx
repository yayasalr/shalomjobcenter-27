
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Settings, Users, Home, ShoppingBag, Star, PanelLeftClose,
  Briefcase, MessageSquare, MailOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarClose } from "@/components/ui/sidebar";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function AdminSidebar() {
  const location = useLocation();
  const { settings } = useSiteSettings();
  
  // On vérifie si le chemin actuel est celui du lien
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: "Tableau de bord", icon: <LayoutDashboard className="h-5 w-5" />, path: "/admin" },
    { name: "Logements", icon: <Home className="h-5 w-5" />, path: "/admin/logements" },
    { name: "Réservations", icon: <ShoppingBag className="h-5 w-5" />, path: "/admin/reservations" },
    { name: "Utilisateurs", icon: <Users className="h-5 w-5" />, path: "/admin/utilisateurs" },
    { name: "Avis", icon: <Star className="h-5 w-5" />, path: "/admin/avis" },
    { name: "Emplois", icon: <Briefcase className="h-5 w-5" />, path: "/admin/emplois" },
    { name: "Messages", icon: <MessageSquare className="h-5 w-5" />, path: "/admin/messages" },
    { name: "Newsletters", icon: <MailOpen className="h-5 w-5" />, path: "/admin/newsletters" },
    { name: "Paramètres", icon: <Settings className="h-5 w-5" />, path: "/admin/parametres" },
  ];

  return (
    <>
      <Sidebar className="border-r bg-white w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <img src={settings.logo} alt={settings.siteName} className="h-6 w-auto site-logo" />
              <span className="site-name">{settings.siteName}</span>
            </div>
            <SidebarClose className="ml-auto">
              <PanelLeftClose className="h-5 w-5" />
            </SidebarClose>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                    isActive(item.path) ? "bg-gray-100 text-gray-900 font-medium" : ""
                  } mb-1 mx-2`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto p-4 border-t">
            <Button asChild variant="outline" className="w-full justify-start" size="sm">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Retour au site
              </Link>
            </Button>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
