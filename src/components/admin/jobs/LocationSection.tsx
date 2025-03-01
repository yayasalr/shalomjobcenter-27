
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationSectionProps {
  location: string;
  setLocation: (location: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  setLocation
}) => {
  return (
    <div>
      <Label htmlFor="location" className="block text-sm font-medium mb-1">
        Localisation <span className="text-red-500">*</span>
      </Label>
      <Input
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="ex: Tokoin, Lomé, Togo"
        className="bg-white border border-gray-300 shadow-sm"
        required
      />
      <p className="text-xs text-gray-500 mt-1">
        Précisez l'adresse ou le quartier où se situe cette offre
      </p>
    </div>
  );
};
