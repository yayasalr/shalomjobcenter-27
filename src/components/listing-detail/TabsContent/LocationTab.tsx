
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationTabProps {
  mapLocation?: string;
}

const LocationTab = ({ mapLocation }: LocationTabProps) => {
  // Fonction pour valider et formater l'URL Google Maps
  const getValidMapUrl = (url?: string) => {
    if (!url) return null;
    
    // S'assurer que l'URL commence par https et provient de Google Maps
    if (!url.startsWith('https://')) {
      url = 'https://' + url.replace(/^http:\/\//, '');
    }
    
    // Vérifier si c'est une URL Google Maps
    if (url.includes('google.com/maps') || url.includes('goo.gl/maps')) {
      // Si c'est un lien de partage, on le transforme en embed
      if (!url.includes('embed')) {
        // Extraire les coordonnées si possible
        const coordinates = url.match(/[?&]q=([^&]+)/);
        if (coordinates) {
          return `https://www.google.com/maps/embed?q=${coordinates[1]}`;
        }
        
        // Sinon, essayons de transformer un lien de partage standard en lien embed
        if (url.includes('maps/place/')) {
          return url.replace('maps/place/', 'maps/embed/v1/place?key=YOUR_API_KEY&q=');
        }
        
        // Fallback: utiliser l'URL telle quelle mais en format embed
        return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(url)}`;
      }
    }
    
    // Si l'URL est déjà correcte, la retourner
    return url;
  };

  const validMapUrl = getValidMapUrl(mapLocation);

  return (
    <TabsContent value="location" className="animate-fade-in pt-4">
      <div className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
        {validMapUrl ? (
          <iframe
            src={validMapUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg w-full h-full"
          ></iframe>
        ) : (
          <div className="text-gray-500 text-center p-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Carte de localisation non disponible</p>
            <p className="mt-2">
              Le propriétaire n'a pas encore ajouté d'emplacement précis.
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="mt-2 text-xs">
          <MapPin className="h-3 w-3 mr-1" />
          Voir le quartier
        </Button>
        {validMapUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 text-xs"
            onClick={() => window.open(mapLocation, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Ouvrir dans Google Maps
          </Button>
        )}
      </div>
    </TabsContent>
  );
};

export default LocationTab;
