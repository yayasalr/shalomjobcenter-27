
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SettingsHeaderProps {
  isSaving: boolean;
  handleSaveSettings: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ 
  isSaving, 
  handleSaveSettings 
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Paramètres du site</h1>
      <Button 
        variant="outline" 
        onClick={handleSaveSettings}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </>
        )}
      </Button>
    </div>
  );
};
