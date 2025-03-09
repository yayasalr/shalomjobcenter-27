
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const NavbarLogo = () => {
  const { settings } = useSiteSettings();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string>("");
  
  // Update currentLogo when settings.logo changes or on component mount
  useEffect(() => {
    try {
      let logoSrc = "";
      
      if (settings.logo === 'stored_separately') {
        const storedLogo = localStorage.getItem('site_logo');
        logoSrc = storedLogo || "/lovable-uploads/94c4ec86-49e9-498e-8fd3-ecdc693ca9fd.png";
      } else {
        logoSrc = settings.logo || "/lovable-uploads/94c4ec86-49e9-498e-8fd3-ecdc693ca9fd.png";
      }
      
      console.log("Logo source actualisé:", logoSrc.substring(0, 30) + "...");
      setCurrentLogo(logoSrc);
      setLogoLoaded(false);
      setLogoError(false);
    } catch (error) {
      console.error("Erreur lors de l'initialisation du logo:", error);
      setLogoError(true);
      // Utiliser un logo par défaut en cas d'erreur
      setCurrentLogo("/lovable-uploads/94c4ec86-49e9-498e-8fd3-ecdc693ca9fd.png");
    }
  }, [settings.logo]);
  
  return (
    <Link to="/" className="flex items-center gap-8 sm:gap-12 md:gap-16 mr-8">
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <div className="h-10 sm:h-12 md:h-14 w-auto flex items-center justify-center overflow-hidden">
          {!logoError ? (
            <img 
              src={currentLogo} 
              alt={settings.siteName || "Logo"}
              className="w-auto h-full object-contain"
              onLoad={() => setLogoLoaded(true)}
              onError={() => {
                console.error("Error loading logo:", currentLogo.substring(0, 30) + "...");
                setLogoError(true);
              }}
              style={{ display: logoLoaded ? 'block' : 'none' }}
            />
          ) : null}
          
          {(!logoLoaded || logoError) && (
            <div className="h-full w-10 sm:w-12 md:w-14 rounded-full bg-yellow-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {settings.siteName ? settings.siteName.substring(0, 2) : 'SJ'}
              </span>
            </div>
          )}
        </div>
      </motion.div>
      <motion.span 
        className="text-xl sm:text-2xl md:text-3xl font-bold site-name inline-block font-serif tracking-wide truncate max-w-[180px] xs:max-w-[180px] sm:max-w-none" 
        whileHover={{ scale: 1.05 }}
      >
        {settings.siteName || 'Shalom Job Center'}
      </motion.span>
    </Link>
  );
};
