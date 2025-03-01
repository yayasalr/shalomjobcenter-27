
import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const NavbarSearchBar = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="hidden md:flex lg:flex items-center h-12 lg:h-14 rounded-full border border-gray-200 px-5 py-2 bg-white/95 shadow-md transition-all border-gray-300 hover:shadow-lg">
      <span className="border-r border-gray-300 pr-4 lg:pr-5 font-medium text-base lg:text-lg">
        Partout
      </span>
      <span className="border-r border-gray-300 px-4 lg:px-5 font-medium text-base lg:text-lg">
        Semaine
      </span>
      <span className="pl-4 lg:pl-5 pr-3 text-gray-600 text-base lg:text-lg">Qui?</span>
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="ml-3 h-10 w-10 lg:h-11 lg:w-11 flex items-center justify-center rounded-full text-white cursor-pointer shadow-sm"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <Search className="h-5 w-5" />
      </motion.div>
    </div>
  );
};
