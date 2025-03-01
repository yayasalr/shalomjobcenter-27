
import React from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

const LocationMap = () => {
  const { settings } = useSiteSettings();

  const handleOpenDirections = () => {
    if (settings.companyInfo.mapLocation) {
      const [lat, lng] = settings.companyInfo.mapLocation.split(',');
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else {
      // Fallback to the address if no coordinates
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.companyInfo.address)}`, '_blank');
    }
  };

  return (
    <div className="mt-12 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: settings.primaryColor }}>Notre Emplacement</h2>
      <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg overflow-hidden relative">
        <iframe 
          src={settings.companyInfo.mapLocation 
            ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${settings.companyInfo.mapLocation.split(',')[1]}!3d${settings.companyInfo.mapLocation.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1695234567890!5m2!1sen!2sus`
            : `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126928.39052450143!2d1.1272278!3d6.1796825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c113185137%3A0x1223d5a1d5bfe89b!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sen!2sus!4v1695234567890!5m2!1sen!2sus`
          } 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="SHALOM JOB CENTER location"
        ></iframe>
        {settings.companyInfo.mapLocation && (
          <Button 
            className="absolute bottom-4 right-4 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
            onClick={handleOpenDirections}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Obtenir l'itinéraire
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationMap;
