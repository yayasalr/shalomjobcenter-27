
import React from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  CalendarDays,
  CreditCard,
  MessageSquare,
  LifeBuoy,
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
    icon: CalendarDays,
  },
  {
    title: "Paiements",
    url: "/admin/paiements",
    icon: CreditCard,
  },
  {
    title: "Avis & Commentaires",
    url: "/admin/avis",
    icon: MessageSquare,
  },
  {
    title: "Support & Assistance",
    url: "/admin/support",
    icon: LifeBuoy,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
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
