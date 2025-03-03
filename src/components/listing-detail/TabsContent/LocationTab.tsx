
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LocationTabProps {
  mapLocation?: string;
}

const LocationTab = ({ mapLocation }: LocationTabProps) => {
  // Fonction améliorée pour valider et formater l'URL Google Maps
  const getValidMapUrl = (url?: string) => {
    if (!url) return null;
    
    try {
      // S'assurer que l'URL commence par https
      if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = 'https://' + url;
      }
      
      // Si c'est déjà une URL d'iframe, la retourner directement
      if (url.includes('maps/embed')) {
        return url;
      }
      
      // Si c'est un lien Google Maps standard, le convertir en iframe
      if (url.includes('google.com/maps') || url.includes('goo.gl/maps')) {
        // Pour les liens de partage courts (goo.gl)
        if (url.includes('goo.gl/maps')) {
          // Ne pas essayer de transformer, utiliser tel quel
          return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
        }
        
        // Pour les liens avec place/
        if (url.includes('maps/place/')) {
          const placePart = url.split('maps/place/')[1].split('/')[0];
          if (placePart) {
            return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placePart)}`;
          }
        }
        
        // Pour les liens avec des coordonnées @
        if (url.includes('@')) {
          const coordPart = url.split('@')[1].split(',')[0] + ',' + url.split('@')[1].split(',')[1];
          return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${coordPart.split(',')[1]}!3d${coordPart.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1695234567890!5m2!1sen!2sus`;
        }
        
        // Pour les liens avec query parameter q=
        const queryMatch = url.match(/[?&]q=([^&]+)/);
        if (queryMatch) {
          return `https://www.google.com/maps/embed?q=${queryMatch[1]}`;
        }
      }
      
      // Si c'est un lien sans format reconnu mais qui semble être des coordonnées
      const coordsRegex = /^(-?\d+\.\d+),(-?\d+\.\d+)$/;
      if (coordsRegex.test(url)) {
        const [lat, lng] = url.split(',');
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1695234567890!5m2!1sen!2sus`;
      }
      
      // Fallback - utiliser l'URL comme terme de recherche
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(url)}`;
    } catch (error) {
      console.error("Erreur lors du traitement de l'URL Maps:", error);
      // En cas d'erreur, essayer d'utiliser l'URL comme terme de recherche
      if (url) {
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(url)}`;
      }
      return null;
    }
  };

  const validMapUrl = getValidMapUrl(mapLocation);
  const originalMapUrl = mapLocation || '';

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
            onClick={() => {
              // Construire une URL Google Maps valide pour ouvrir dans un nouvel onglet
              let openUrl = originalMapUrl;
              
              // Si c'est des coordonnées simples, les formater correctement
              const coordsRegex = /^(-?\d+\.\d+),(-?\d+\.\d+)$/;
              if (coordsRegex.test(originalMapUrl)) {
                openUrl = `https://www.google.com/maps?q=${originalMapUrl}`;
              }
              
              window.open(openUrl, '_blank');
            }}
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
