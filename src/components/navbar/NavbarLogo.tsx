
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const NavbarLogo = () => {
  const { settings } = useSiteSettings();
  
  return (
    <Link to="/" className="flex items-center gap-3">
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <img 
          src={settings.logo} 
          alt={settings.siteName}
          className="h-9 sm:h-12 w-auto site-logo bg-white rounded-md p-1 shadow-sm" 
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </motion.div>
      <motion.span 
        className="text-lg sm:text-2xl font-bold site-name hidden xs:block elegant-title" 
        style={{ color: "var(--navbar-text-color)" }}
        whileHover={{ scale: 1.05 }}
      >
        {settings.siteName}
      </motion.span>
    </Link>
  );
};
