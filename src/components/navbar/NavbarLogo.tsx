
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const NavbarLogo = () => {
  const { settings } = useSiteSettings();
  
  return (
    <Link to="/" className="flex items-center gap-4">
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <div className="h-10 sm:h-12 w-auto flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-2 shadow-md">
          <span className="text-white font-bold text-xl">SJC</span>
        </div>
      </motion.div>
      <motion.span 
        className="text-xl sm:text-2xl font-bold site-name hidden xs:block font-serif tracking-wide" 
        style={{ color: "var(--navbar-text-color)" }}
        whileHover={{ scale: 1.05 }}
      >
        {settings.siteName}
      </motion.span>
    </Link>
  );
};
