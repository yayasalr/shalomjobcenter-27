
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, LayoutDashboard, Briefcase, Star, CalendarCheck, CreditCard, 
  Users, LifeBuoy, Settings, LogOut, ChevronRight, ChevronLeft
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const AdminSidebar = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  // Déterminer la vue mobile en fonction de la largeur de l'écran
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    handleResize(); // Initialiser
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      path: "/admin/logements", 
      name: "Logements", 
      icon: <Home className="h-5 w-5" />,
      badgeCount: 12
    },
    { 
      path: "/admin/emplois", 
      name: "Offres d'emploi", 
      icon: <Briefcase className="h-5 w-5" />,
      badgeCount: 5
    },
    { 
      path: "/admin/avis", 
      name: "Avis", 
      icon: <Star className="h-5 w-5" />,
      badgeCount: 8
    },
    { 
      path: "/admin/reservations", 
      name: "Réservations", 
      icon: <CalendarCheck className="h-5 w-5" />,
      badgeCount: 3
    },
    { 
      path: "/admin/paiements", 
      name: "Paiements", 
      icon: <CreditCard className="h-5 w-5" />
    },
    { 
      path: "/admin/utilisateurs", 
      name: "Utilisateurs", 
      icon: <Users className="h-5 w-5" />
    },
    { 
      path: "/admin/support", 
      name: "Support", 
      icon: <LifeBuoy className="h-5 w-5" />
    },
    { 
      path: "/admin/parametres", 
      name: "Paramètres", 
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <Sidebar 
      className={`h-screen bg-white border-r border-gray-200 transition-all ${
        collapsed ? 'w-[70px]' : 'w-64'
      }`}
      collapsed={collapsed}
    >
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <img 
                src={settings.logo || "/placeholder.svg"} 
                alt={settings.siteName} 
                className="h-8 w-8 object-contain mr-2"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <span className="font-semibold text-gray-900">{settings.siteName}</span>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar} 
            className={`p-1 h-7 w-7 ${collapsed ? 'ml-auto' : ''}`}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <Link to="/admin" className="block">
            <div 
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin") 
                  ? 'bg-sholom-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Tableau de bord</span>}
            </div>
          </Link>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          {!collapsed && <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase">Gestion</SidebarGroupLabel>}
          <SidebarGroupContent className="mt-2 space-y-1">
            {navItems.map((item, index) => (
              <TooltipProvider key={index} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.path} className="block">
                      <div 
                        className={`flex items-center p-2 rounded-lg ${
                          isActive(item.path) 
                            ? 'bg-sholom-primary text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        } ${collapsed ? 'justify-center' : ''}`}
                      >
                        {item.icon}
                        {!collapsed && (
                          <>
                            <span className="ml-3 flex-1">{item.name}</span>
                            {item.badgeCount && (
                              <Badge variant="secondary" className="ml-auto">
                                {item.badgeCount}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t border-gray-200 mt-auto">
        <div 
          className={`flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
