
import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/home/Footer';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Shield, User, Award, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const { settings } = useSiteSettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-sholom-light to-blue-50">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 text-center text-sholom-dark leading-tight"
            variants={itemVariants}
          >
            À propos de <span className="text-sholom-primary italic">SHALOM SECURITY</span>
          </motion.h1>
          
          <div className="mb-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 md:p-8 border border-gray-100">
            <motion.div 
              className="flex justify-center mb-8"
              variants={imageVariants}
            >
              <img 
                src="/lovable-uploads/94c4ec86-49e9-498e-8fd3-ecdc693ca9fd.png" 
                alt="Logo Shalom Security" 
                className="h-32 w-auto hover-scale"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: settings.primaryColor }}>Notre Mission</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                SHALOM SECURITY est une entreprise de gardiennage et de protection spécialisée dans la sécurité des biens et des personnes au Togo.
                Notre mission est de garantir la sécurité de nos clients avec professionnalisme et vigilance, en offrant des services
                de gardiennage de qualité supérieure adaptés aux besoins spécifiques de chaque client.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex justify-center my-8"
              variants={highlightVariants}
            >
              <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200 max-w-lg hover-lift">
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Notre devise</h3>
                <p className="text-yellow-900 text-lg italic">"La sécurité, au centre de la vigilance."</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h2 id="services" className="text-2xl font-semibold mb-4" style={{ color: settings.primaryColor }}>Nos Services</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div 
                  id="gardiennage" 
                  className="bg-gray-50 p-4 rounded-lg hover-lift"
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <Shield className="w-10 h-10 text-yellow-600 mb-2" />
                  <h3 className="font-medium mb-2">Gardiennage</h3>
                  <p className="text-gray-600">Protection de sites résidentiels, commerciaux et industriels par des agents professionnels.</p>
                </motion.div>
                <motion.div 
                  id="protection" 
                  className="bg-gray-50 p-4 rounded-lg hover-lift"
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <User className="w-10 h-10 text-yellow-600 mb-2" />
                  <h3 className="font-medium mb-2">Protection Rapprochée</h3>
                  <p className="text-gray-600">Services de protection pour les individus et les personnalités.</p>
                </motion.div>
                <motion.div 
                  id="conseil" 
                  className="bg-gray-50 p-4 rounded-lg hover-lift"
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <Award className="w-10 h-10 text-yellow-600 mb-2" />
                  <h3 className="font-medium mb-2">Conseil en Sécurité</h3>
                  <p className="text-gray-600">Audit et recommandations pour sécuriser vos locaux contre les cambriolages et le vol.</p>
                </motion.div>
                <motion.div 
                  id="installation" 
                  className="bg-gray-50 p-4 rounded-lg hover-lift"
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <CheckCircle className="w-10 h-10 text-yellow-600 mb-2" />
                  <h3 className="font-medium mb-2">Installation de Systèmes</h3>
                  <p className="text-gray-600">Installation et maintenance de systèmes d'alarme et de surveillance.</p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: settings.primaryColor }}>Conseils de Sécurité</h2>
              <ul className="list-decimal pl-6 mb-8 space-y-2 text-gray-700">
                <motion.li 
                  className="hover:translate-x-1 transition-transform duration-200"
                  whileHover={{ x: 5 }}
                >Engager un agent de sécurité professionnel</motion.li>
                <motion.li 
                  className="hover:translate-x-1 transition-transform duration-200"
                  whileHover={{ x: 5 }}
                >Assurer un éclairage adéquat des zones extérieures</motion.li>
                <motion.li 
                  className="hover:translate-x-1 transition-transform duration-200"
                  whileHover={{ x: 5 }}
                >Installer des coffres-forts sécurisés</motion.li>
                <motion.li 
                  className="hover:translate-x-1 transition-transform duration-200"
                  whileHover={{ x: 5 }}
                >Mettre en place des mesures de sécurité et d'alarme</motion.li>
                <motion.li 
                  className="hover:translate-x-1 transition-transform duration-200"
                  whileHover={{ x: 5 }}
                >Sécuriser les portes et fenêtres côté extérieur</motion.li>
                <motion.li 
                  className="hover:translate-x-1 transition-transform duration-200"
                  whileHover={{ x: 5 }}
                >Prévoir des dispositifs de sécurité rapprochés pour lutter contre l'agression et le vol</motion.li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="flex justify-center mt-8"
              variants={imageVariants}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/0ff38471-c7cc-446c-99b2-391c850dbcdd.png" 
                  alt="Logo Shalom Security" 
                  className="hover-scale max-w-full h-auto transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center text-white gap-4">
                    <div>
                      <p className="text-lg font-medium">Protection de qualité</p>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Tokoin, Lomé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
