
import React from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';

const ContactInfo = () => {
  const { settings } = useSiteSettings();

  return (
    <motion.div 
      className="col-span-2 bg-white p-6 rounded-lg shadow-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-6" style={{ color: settings.primaryColor }}>
        Nos Coordonnées
      </h2>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <MapPin className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Adresse</h4>
            <p className="text-gray-600 mt-1">
              Tokoin Trésor, ancien immeuble Udecto<br />
              Lomé, Togo
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Phone className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Téléphone</h4>
            <div className="text-gray-600 mt-1">
              <p>+228 90-19-03-41</p>
              <p>+228 98-89-41-23</p>
              <p>+228 98-88-06-20</p>
              <p>+228 99-13-84-64</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Mail className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Email</h4>
            <a 
              href="mailto:Shalomjob@gmail.com" 
              className="text-gray-600 hover:text-primary transition-colors mt-1 block"
            >
              Shalomjob@gmail.com
            </a>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Heures d'ouverture</h4>
            <p className="text-gray-600 mt-1">
              Lundi - Vendredi: 8h00 - 18h00<br />
              Samedi: 9h00 - 15h00<br />
              Dimanche: Fermé<br />
              <span className="font-medium">Service de sécurité: 24h/24, 7j/7</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Notre devise</h4>
            <p className="text-gray-600 mt-1 italic">
              "La sécurité, au centre de la vigilance."
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <img 
          src="/lovable-uploads/8f046947-6e09-442a-88f9-2f82a0a50910.png" 
          alt="Shalom Security" 
          className="h-36 w-auto rounded-lg shadow-sm"
        />
      </div>
    </motion.div>
  );
};

export default ContactInfo;
