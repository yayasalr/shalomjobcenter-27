
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface JobDialogFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

export const JobDialogFooter: React.FC<JobDialogFooterProps> = ({
  isSubmitting,
  onCancel,
  isEditing
}) => {
  return (
    <DialogFooter className="px-6 py-4 border-t">
      <div className="flex justify-between w-full">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6"
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          form="job-form"
          disabled={isSubmitting}
          className="px-6 gap-2 bg-sholom-primary hover:bg-sholom-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              En cours...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditing ? "Mettre à jour" : "Publier l'offre"}
            </>
          )}
        </Button>
      </div>
    </DialogFooter>
  );
};
