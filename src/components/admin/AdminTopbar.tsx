
import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminTopbar() {
  return (
    <div className="w-full border-b bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Barre de recherche */}
        <div className="flex w-full max-w-lg items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Actions à droite */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </Button>

          {/* Profil admin */}
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <span>Admin</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
