
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  onCancel,
  onSubmit,
  isEditing,
  isSubmitting = false
}) => {
  return (
    <>
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
        disabled={isSubmitting}
        type="button"
      >
        Annuler
      </Button>
      <Button 
        onClick={onSubmit}
        className="bg-sholom-primary hover:bg-sholom-primary/90 text-white"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Mise à jour..." : "Ajout..."}
          </>
        ) : (
          isEditing ? "Mettre à jour" : "Ajouter"
        )}
      </Button>
    </>
  );
};
