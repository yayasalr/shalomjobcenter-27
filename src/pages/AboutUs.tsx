
import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/home/Footer';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const { settings } = useSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">À propos de SHALOM JOB CENTER</h1>
          
          <div className="mb-10 bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: settings.primaryColor }}>Notre Mission</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              SHALOM JOB CENTER est une plateforme innovante qui vise à faciliter la recherche de logements et d'emplois au Togo.
              Notre mission est de connecter les propriétaires de logements aux locataires potentiels et les employeurs aux chercheurs d'emploi,
              créant ainsi un écosystème de services complet pour les résidents et professionnels.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4" style={{ color: settings.primaryColor }}>Notre Histoire</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Fondée en 2023 à Lomé, SHALOM JOB CENTER est née de la vision d'un groupe d'entrepreneurs togolais
              désireux de moderniser le marché immobilier et de l'emploi au Togo. Face aux défis de trouver un logement
              adapté ou un emploi correspondant à ses compétences, notre équipe a développé une solution centralisée
              et accessible à tous.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4" style={{ color: settings.primaryColor }}>Nos Valeurs</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Transparence</h3>
                <p className="text-gray-600">Nous croyons en une communication ouverte et honnête avec tous nos utilisateurs.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Innovation</h3>
                <p className="text-gray-600">Nous améliorons constamment notre plateforme pour offrir la meilleure expérience possible.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Accessibilité</h3>
                <p className="text-gray-600">Nous nous efforçons de rendre nos services accessibles à tous les Togolais.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Excellence</h3>
                <p className="text-gray-600">Nous visons l'excellence dans tous nos services et interactions.</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4" style={{ color: settings.primaryColor }}>Notre Équipe</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Notre équipe est composée de professionnels passionnés et dévoués, experts dans les domaines
              de l'immobilier, du recrutement et de la technologie. Ensemble, nous travaillons pour créer
              une plateforme qui répond aux besoins spécifiques du marché togolais.
            </p>
            
            <div className="flex justify-center mt-8">
              <motion.img 
                src="/lovable-uploads/b50944ed-e893-4388-b344-17cca0ff14ea.png" 
                alt="L'équipe de SHALOM JOB CENTER" 
                className="rounded-lg shadow-md max-w-full h-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
