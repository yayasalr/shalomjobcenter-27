
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const NavbarLogo = () => {
  const { settings } = useSiteSettings();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(
    settings.logo === 'stored_separately' 
      ? localStorage.getItem('site_logo') || "/placeholder.svg" 
      : settings.logo || "/placeholder.svg"
  );
  
  // Update currentLogo when settings.logo changes
  useEffect(() => {
    if (settings.logo) {
      const logoSrc = settings.logo === 'stored_separately' 
        ? localStorage.getItem('site_logo') || "/placeholder.svg" 
        : settings.logo;
      
      setCurrentLogo(logoSrc);
      setLogoLoaded(false);
      setLogoError(false);
    }
  }, [settings.logo]);
  
  return (
    <Link to="/" className="flex items-center gap-4">
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <div className="h-10 sm:h-12 w-auto flex items-center justify-center overflow-hidden rounded-full">
          {!logoError ? (
            <img 
              src={currentLogo} 
              alt={settings.siteName}
              className="w-auto h-full object-contain"
              onLoad={() => setLogoLoaded(true)}
              onError={() => {
                console.error("Error loading logo:", currentLogo);
                setLogoError(true);
              }}
              style={{ display: logoLoaded ? 'block' : 'none' }}
            />
          ) : null}
          
          {(!logoLoaded || logoError) && (
            <div className="h-full w-10 sm:w-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {settings.siteName.substring(0, 2)}
              </span>
            </div>
          )}
        </div>
      </motion.div>
      <motion.span 
        className="text-xl sm:text-2xl font-bold site-name hidden xs:block font-serif tracking-wide" 
        whileHover={{ scale: 1.05 }}
      >
        {settings.siteName}
      </motion.span>
    </Link>
  );
};
