
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOME_NEIGHBORHOODS } from "@/constants/locations";

interface ValidationErrors {
  neighborhood?: string;
  location?: string;
  mapLocation?: string;
  [key: string]: string | undefined;
}

interface LocationSectionProps {
  neighborhood: string;
  location: string;
  mapLocation: string;
  handleNeighborhoodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setLocation: (location: string) => void;
  setMapLocation: (mapLocation: string) => void;
  errors: ValidationErrors;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  neighborhood,
  location,
  mapLocation,
  handleNeighborhoodChange,
  setLocation,
  setMapLocation,
  errors
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label 
            htmlFor="neighborhood" 
            className={`text-gray-700 font-medium ${errors.neighborhood ? 'text-red-500' : ''}`}
          >
            Quartier *
          </Label>
          <select
            id="neighborhood"
            className={`flex h-10 w-full rounded-md border ${errors.neighborhood ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 ${errors.neighborhood ? 'focus-visible:ring-red-500' : 'focus-visible:ring-ring'}`}
            value={neighborhood}
            onChange={handleNeighborhoodChange}
            required
            aria-invalid={!!errors.neighborhood}
            aria-describedby={errors.neighborhood ? "neighborhood-error" : undefined}
          >
            <option value="">Sélectionnez un quartier</option>
            {LOME_NEIGHBORHOODS.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
          {errors.neighborhood && (
            <p id="neighborhood-error" className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label 
            htmlFor="location" 
            className={`text-gray-700 font-medium ${errors.location ? 'text-red-500' : ''}`}
          >
            Localisation complète *
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Tokoin, Lomé, Togo"
            className={`bg-white ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            required
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          {errors.location && (
            <p id="location-error" className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mapLocation" className="text-gray-700 font-medium">
          Lien de la carte Google Maps
        </Label>
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
