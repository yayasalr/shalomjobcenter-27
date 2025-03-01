
import React, { useState, useEffect } from 'react';
import { ImageUploadField } from '../ImageUploadField';
import { toast } from "sonner";

interface LogoSectionProps {
  logoUrl: string;
  logoUploading: boolean;
  handleLogoUpload: (file: File) => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  logoUrl,
  logoUploading,
  handleLogoUpload
}) => {
  const [logoError, setLogoError] = useState(false);
  
  // Reset error when URL changes
  useEffect(() => {
    setLogoError(false);
  }, [logoUrl]);
  
  return (
    <div>
      <div className="flex items-center space-x-4 mt-1">
        <div className="h-16 w-16 flex items-center justify-center overflow-hidden bg-gray-50 rounded-full">
          {!logoError ? (
            <img 
              key={`logo-${logoUrl}`} 
              src={logoUrl} 
              alt="Logo" 
              className="h-full w-auto object-contain" 
              onError={() => {
                setLogoError(true);
                toast.error("Erreur de chargement du logo");
              }}
            />
          ) : (
            <span className="text-sm text-gray-400">Logo</span>
          )}
        </div>
        <ImageUploadField
          label=""
          imageUrl={logoUrl}
          onUpload={handleLogoUpload}
          isUploading={logoUploading}
        />
      </div>
    </div>
  );
};
