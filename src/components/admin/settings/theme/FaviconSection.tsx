
import React, { useState, useEffect } from 'react';
import { ImageUploadField } from '../ImageUploadField';
import { toast } from "sonner";

interface FaviconSectionProps {
  faviconUrl: string;
  faviconUploading: boolean;
  handleFaviconUpload: (file: File) => void;
}

export const FaviconSection: React.FC<FaviconSectionProps> = ({
  faviconUrl,
  faviconUploading,
  handleFaviconUpload
}) => {
  const [faviconError, setFaviconError] = useState(false);
  
  // Reset error when URL changes
  useEffect(() => {
    setFaviconError(false);
  }, [faviconUrl]);
  
  return (
    <div>
      <div className="flex items-center space-x-4 mt-1">
        <div className="h-16 w-16 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg">
          {!faviconError ? (
            <img 
              key={`favicon-${faviconUrl}`}
              src={faviconUrl} 
              alt="Favicon" 
              className="h-full w-auto object-contain"
              onError={() => {
                setFaviconError(true);
                toast.error("Erreur de chargement du favicon");
              }}
            />
          ) : (
            <span className="text-sm text-gray-400">Favicon</span>
          )}
        </div>
        <ImageUploadField
          label=""
          imageUrl={faviconUrl}
          onUpload={handleFaviconUpload}
          isUploading={faviconUploading}
        />
      </div>
    </div>
  );
};
