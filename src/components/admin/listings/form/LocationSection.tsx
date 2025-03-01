
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOME_NEIGHBORHOODS } from "@/hooks/useListings";

interface LocationSectionProps {
  neighborhood: string;
  location: string;
  mapLocation: string;
  handleNeighborhoodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setLocation: (location: string) => void;
  setMapLocation: (mapLocation: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  neighborhood,
  location,
  mapLocation,
  handleNeighborhoodChange,
  setLocation,
  setMapLocation
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="neighborhood" className="text-gray-700 font-medium">Quartier</Label>
          <select
            id="neighborhood"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={neighborhood}
            onChange={handleNeighborhoodChange}
            required
          >
            <option value="">Sélectionnez un quartier</option>
            {LOME_NEIGHBORHOODS.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 font-medium">Localisation complète</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Tokoin, Lomé, Togo"
            className="bg-white border-gray-300"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mapLocation" className="text-gray-700 font-medium">Lien de la carte Google Maps</Label>
        <Input
          id="mapLocation"
          value={mapLocation}
          onChange={(e) => setMapLocation(e.target.value)}
          placeholder="Ex: https://www.google.com/maps/embed?pb=..."
          className="bg-white border-gray-300"
        />
        <p className="text-sm text-gray-500">
          Comment obtenir un lien d'intégration Google Maps:
          <ol className="list-decimal pl-5 mt-1 text-xs">
            <li>Recherchez le lieu sur Google Maps</li>
            <li>Cliquez sur "Partager"</li>
            <li>Sélectionnez "Intégrer une carte"</li>
            <li>Copiez le lien qui commence par "https://www.google.com/maps/embed"</li>
          </ol>
        </p>
      </div>
    </>
  );
};
