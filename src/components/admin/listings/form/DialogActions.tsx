
import React from 'react';
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isEditing: boolean;
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  onCancel,
  onSubmit,
  isEditing
}) => {
  return (
    <>
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
      >
        Annuler
      </Button>
      <Button 
        onClick={onSubmit}
        className="bg-sholom-primary hover:bg-sholom-primary/90 text-white"
      >
        {isEditing ? "Mettre à jour" : "Ajouter"}
      </Button>
    </>
  );
};
