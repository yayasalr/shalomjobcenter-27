
import React from 'react';
import { Button } from "@/components/ui/button";

interface ClearButtonProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  if (!searchTerm) return null;
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => setSearchTerm('')}
      className="gap-2"
    >
      Effacer
    </Button>
  );
};
