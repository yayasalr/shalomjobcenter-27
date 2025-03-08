
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EmptyGalleryStateProps {
  className?: string;
}

export const EmptyGalleryState: React.FC<EmptyGalleryStateProps> = ({ className }) => {
  return (
    <div className={`${className} flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden min-h-[300px]`}>
      <div className="text-center p-4">
        <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-2" />
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    </div>
  );
};
