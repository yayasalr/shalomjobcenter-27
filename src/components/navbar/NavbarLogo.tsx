
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import "../../styles/components/logo.css";

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
    <Link to="/" className="flex items-center gap-4 sm:gap-6 md:gap-8 mr-8">
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 5, z: 10 }}
        whileTap={{ scale: 0.95 }}
        className="relative logo-container"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <div className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 flex items-center justify-center overflow-hidden rounded-full">
          {!logoError ? (
            <img 
              src={currentLogo} 
              alt={settings.siteName || "Logo"}
              className={`logo w-full h-full transition-all duration-300 ease-in-out ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLogoLoaded(true)}
              onError={() => {
                console.error("Error loading logo:", currentLogo.substring(0, 30) + "...");
                setLogoError(true);
              }}
            />
          ) : null}
          
          {(!logoLoaded || logoError) && (
            <div className="h-full w-full rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center logo-fallback">
              <span className="text-white font-bold text-xl">
                {settings.siteName ? settings.siteName.substring(0, 2).toUpperCase() : 'SJ'}
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
