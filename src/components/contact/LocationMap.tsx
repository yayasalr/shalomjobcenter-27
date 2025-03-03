
import React from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin } from 'lucide-react';

const LocationMap = () => {
  const { settings } = useSiteSettings();

  // Fonction pour traiter l'URL de la carte
  const getMapEmbedUrl = () => {
    const mapLocation = settings.companyInfo.mapLocation;
    
    // Si pas de localisation définie, utiliser une carte centrée sur Lomé
    if (!mapLocation) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126928.39052450143!2d1.1272278!3d6.1796825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c113185137%3A0x1223d5a1d5bfe89b!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sen!2sus!4v1695234567890!5m2!1sen!2sus`;
    }
    
    // Vérifier si c'est des coordonnées simples (format lat,lng)
    const coordsRegex = /^(-?\d+\.\d+),(-?\d+\.\d+)$/;
    if (coordsRegex.test(mapLocation)) {
      const [lat, lng] = mapLocation.split(',');
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1695234567890!5m2!1sen!2sus`;
    }
    
    // Si c'est une URL complète
    if (mapLocation.startsWith('http')) {
      if (mapLocation.includes('maps/embed')) {
        return mapLocation;
      } 
      else if (mapLocation.includes('google.com/maps')) {
        // Essayer d'extraire les coordonnées de l'URL
        const coordMatch = mapLocation.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
          return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${coordMatch[2]}!3d${coordMatch[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1695234567890!5m2!1sen!2sus`;
        }
      }
    }
    
    // Fallback: utiliser l'adresse comme terme de recherche
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(settings.companyInfo.address || 'Lomé, Togo')}`;
  };

  const handleOpenDirections = () => {
    if (settings.companyInfo.mapLocation) {
      // Vérifier si c'est des coordonnées simples (format lat,lng)
      const coordsRegex = /^(-?\d+\.\d+),(-?\d+\.\d+)$/;
      if (coordsRegex.test(settings.companyInfo.mapLocation)) {
        const [lat, lng] = settings.companyInfo.mapLocation.split(',');
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
        return;
      }
      
      // Si c'est une URL, essayer d'extraire les coordonnées
      if (settings.companyInfo.mapLocation.includes('@')) {
        const match = settings.companyInfo.mapLocation.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${match[1]},${match[2]}`, '_blank');
          return;
        }
      }
      
      // Sinon, ouvrir directement l'URL
      window.open(settings.companyInfo.mapLocation, '_blank');
    } else {
      // Fallback à l'adresse si pas de coordonnées
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.companyInfo.address || 'Lomé, Togo')}`, '_blank');
    }
  };

  return (
    <div className="mt-12 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: settings.primaryColor }}>Notre Emplacement</h2>
      <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg overflow-hidden relative">
        <iframe 
          src={getMapEmbedUrl()} 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="SHALOM JOB CENTER location"
        ></iframe>
        <Button 
          className="absolute bottom-4 right-4 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
          onClick={handleOpenDirections}
        >
          <Navigation className="mr-2 h-4 w-4" />
          Obtenir l'itinéraire
        </Button>
      </div>
      
      {settings.companyInfo.address && (
        <div className="mt-4 flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-2 text-gray-500" />
          <p>{settings.companyInfo.address}</p>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
