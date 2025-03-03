
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOME_NEIGHBORHOODS } from "@/constants/locations";
import { InfoIcon } from "lucide-react";

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
          placeholder="Ex: https://www.google.com/maps/embed?pb=... ou 6.1796825,1.1272278"
          className="bg-white border-gray-300"
        />
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-100 mt-2">
          <div className="flex items-start">
            <InfoIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Formats acceptés pour la carte :</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Coordonnées GPS directes : <span className="font-mono bg-blue-100 px-1 rounded">6.1796825,1.1272278</span></li>
                <li>Lien d'intégration Google Maps : <span className="font-mono bg-blue-100 px-1 rounded">https://www.google.com/maps/embed?pb=...</span></li>
                <li>Lien Google Maps standard : <span className="font-mono bg-blue-100 px-1 rounded">https://www.google.com/maps?q=...</span></li>
                <li>Lien de lieu Google Maps : <span className="font-mono bg-blue-100 px-1 rounded">https://www.google.com/maps/place/...</span></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
