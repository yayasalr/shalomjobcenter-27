
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JobDetailsFieldsProps {
  description: string;
  setDescription: (value: string) => void;
  requirements: string;
  setRequirements: (value: string) => void;
  isHousingOffer?: boolean;
}

export const JobDetailsFields: React.FC<JobDetailsFieldsProps> = ({
  description,
  setDescription,
  requirements,
  setRequirements,
  isHousingOffer = false
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="description" className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Description détaillée de ${isHousingOffer ? 'ce logement' : 'cette offre d\'emploi'}`}
          rows={5}
          required
        />
      </div>

      <div>
        <Label htmlFor="requirements" className="block text-sm font-medium mb-1">
          {isHousingOffer ? 'Caractéristiques' : 'Exigences'} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder={isHousingOffer 
            ? "Caractéristiques du logement (une par ligne)" 
            : "Exigences du poste (une par ligne)"
          }
          rows={5}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Entrez une exigence par ligne</p>
      </div>
    </div>
  );
};
