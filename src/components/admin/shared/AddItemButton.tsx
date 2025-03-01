
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddItemButtonProps {
  onClick: () => void;
  label: string;
}

export const AddItemButton: React.FC<AddItemButtonProps> = ({ onClick, label }) => {
  return (
    <Button 
      onClick={onClick}
      className="bg-sholom-primary hover:bg-sholom-primary/90 text-white font-medium flex items-center gap-2"
    >
      <PlusCircle size={18} />
      {label}
    </Button>
  );
};
