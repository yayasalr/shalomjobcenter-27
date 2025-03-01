
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Building,
  Users,
  Star,
  Calendar,
  CreditCard,
  MessagesSquare,
  HelpCircle,
  Settings,
  LogOut,
  Clock,
  Briefcase
} from "lucide-react";
import { useSidebar } from '@/components/ui/sidebar';

export const AdminSidebar = () => {
  const { settings } = useSiteSettings();
  const location = useLocation();
  const { expanded } = useSidebar();

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`border-r bg-gray-100/40 lg:block ${expanded ? "block" : "hidden"}`}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link 
            to="/admin" 
            className="flex items-center gap-2 font-semibold"
          >
            <motion.img 
              src={settings.logo || "/placeholder.svg"} 
              className="h-6 w-auto" 
              alt={settings.siteName}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <span style={{ color: settings.primaryColor }}>Admin</span>
          </Link>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary ml-auto">
            Voir le site
          </Link>
        </div>
        <ScrollArea className="flex-1 overflow-auto">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/admin"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <BarChart3 className="h-4 w-4" />
              Tableau de bord
            </Link>
            <Link
              to="/admin/logements"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/logements') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <Building className="h-4 w-4" />
              Logements
            </Link>
            <Link
              to="/admin/emplois"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/emplois') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <Briefcase className="h-4 w-4" />
              Emplois
            </Link>
            <Link
              to="/admin/utilisateurs"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/utilisateurs') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <Users className="h-4 w-4" />
              Utilisateurs
            </Link>
            <Link
              to="/admin/avis"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/avis') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <Star className="h-4 w-4" />
              Avis
            </Link>
            <Link
              to="/admin/reservations"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/reservations') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <Calendar className="h-4 w-4" />
              Réservations
            </Link>
            <Link
              to="/admin/paiements"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/paiements') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <CreditCard className="h-4 w-4" />
              Paiements
            </Link>
            <Link
              to="/admin/messages"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/messages') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <MessagesSquare className="h-4 w-4" />
              Messages
              <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">Nouveau</span>
            </Link>
            <Link
              to="/admin/support"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/support') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <HelpCircle className="h-4 w-4" />
              Support
            </Link>
            <Link
              to="/admin/parametres"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isCurrentPath('/admin/parametres') 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              } transition-all`}
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
            <Separator className="my-2" />
            <Link
              to="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Link>
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4">
          <div className="flex items-center gap-3">
            <img
              alt="Avatar"
              className="rounded-full overflow-hidden object-cover object-center"
              height="32"
              src="/placeholder.svg"
              style={{ aspectRatio: "32/32" }}
              width="32"
            />
            <div className="grid gap-0.5 text-xs">
              <div className="font-medium">Admin System</div>
              <div className="text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>En ligne</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
