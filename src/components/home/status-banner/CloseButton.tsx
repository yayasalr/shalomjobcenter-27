
import React from 'react';
import { X } from 'lucide-react';

interface CloseButtonProps {
  onClose: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <button 
      onClick={onClose}
      className="absolute right-2 text-gray-400 hover:text-gray-600 bg-white/90 p-1 rounded-full z-10 transition-colors"
      aria-label="Fermer"
    >
      <X className="h-3 w-3" />
    </button>
  );
};
