
import React from 'react';
import { Check } from "lucide-react";

interface PublishSettingsSectionProps {
  isHousingOffer: boolean;
  setIsHousingOffer: (value: boolean) => void;
  isPublished: boolean;
  setIsPublished: (value: boolean) => void;
}

export const PublishSettingsSection: React.FC<PublishSettingsSectionProps> = ({
  isHousingOffer,
  setIsHousingOffer,
  isPublished,
  setIsPublished
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isHousingOffer}
            onChange={() => setIsHousingOffer(!isHousingOffer)}
            className="mr-2"
          />
          <span className="text-sm font-medium">Ceci est une offre de logement</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
            className="mr-2"
          />
          <span className="text-sm font-medium">Publier cette offre</span>
        </label>
      </div>
      
      {isHousingOffer && (
        <div className="mt-2 p-3 bg-purple-50 rounded-md text-sm text-purple-700 border border-purple-200">
          <div className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Vous êtes en train de créer une offre de logement
          </div>
        </div>
      )}
      
      {!isPublished && (
        <div className="mt-2 p-3 bg-amber-50 rounded-md text-sm text-amber-700 border border-amber-200">
          <div className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Cette offre sera enregistrée comme brouillon
          </div>
        </div>
      )}
    </div>
  );
};
