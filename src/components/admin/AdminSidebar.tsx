
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Briefcase,
  Users,
  CalendarClock,
  CreditCard,
  Star,
  MessageSquare,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Offres Emploi & Logement",
    url: "/admin/emplois",
    icon: Briefcase,
  },
  {
    title: "Logements",
    url: "/admin/logements",
    icon: Home,
  },
  {
    title: "Utilisateurs",
    url: "/admin/utilisateurs",
    icon: Users,
  },
  {
    title: "Réservations",
    url: "/admin/reservations",
    icon: CalendarClock,
  },
  {
    title: "Paiements",
    url: "/admin/paiements",
    icon: CreditCard,
  },
  {
    title: "Avis",
    url: "/admin/avis",
    icon: Star,
  },
  {
    title: "Support",
    url: "/admin/support",
    icon: MessageSquare,
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link 
                      to={item.url} 
                      className={`flex items-center gap-3 w-full ${
                        location.pathname === item.url 
                          ? 'text-primary font-medium' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
