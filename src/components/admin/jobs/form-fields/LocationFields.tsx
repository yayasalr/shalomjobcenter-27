
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationFieldsProps {
  location: string;
  setLocation: (value: string) => void;
}

export const LocationFields: React.FC<LocationFieldsProps> = ({
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
        required
      />
    </div>
  );
};
