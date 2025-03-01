
import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const NavbarSearchBar = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="hidden md:flex lg:flex items-center h-10 lg:h-12 rounded-full border border-gray-200 px-4 bg-white/90 shadow-sm transition-all border-gray-300">
      <span className="border-r border-gray-300 pr-3 lg:pr-4 font-medium text-sm lg:text-base">
        Partout
      </span>
      <span className="border-r border-gray-300 px-3 lg:px-4 font-medium text-sm lg:text-base">
        Semaine
      </span>
      <span className="pl-3 lg:pl-4 pr-2 text-gray-400 text-sm lg:text-base">Qui?</span>
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="ml-2 h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center rounded-full text-white cursor-pointer"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <Search className="h-4 w-4" />
      </motion.div>
    </div>
  );
};
