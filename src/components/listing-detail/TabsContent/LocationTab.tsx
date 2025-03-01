
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationTabProps {
  mapLocation?: string;
}

const LocationTab = ({ mapLocation }: LocationTabProps) => (
  <TabsContent value="location" className="animate-fade-in pt-4">
    <div className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
      {mapLocation ? (
        <iframe
          src={mapLocation}
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
      <Button variant="outline" size="sm" className="mt-2 text-xs">
        <ExternalLink className="h-3 w-3 mr-1" />
        Ouvrir dans Google Maps
      </Button>
    </div>
  </TabsContent>
);

export default LocationTab;
