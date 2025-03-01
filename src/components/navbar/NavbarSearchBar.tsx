
import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const NavbarSearchBar = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="hidden lg:flex items-center h-12 rounded-full border border-gray-200 px-4 bg-white/90 shadow-sm transition-all border-gray-300">
      <span className="border-r border-gray-300 pr-4 font-medium">
        Partout
      </span>
      <span className="border-r border-gray-300 px-4 font-medium">
        Semaine
      </span>
      <span className="pl-4 pr-2 text-gray-400">Qui?</span>
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="ml-2 h-9 w-9 flex items-center justify-center rounded-full text-white cursor-pointer"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <Search className="h-4 w-4" />
      </motion.div>
    </div>
  );
};
