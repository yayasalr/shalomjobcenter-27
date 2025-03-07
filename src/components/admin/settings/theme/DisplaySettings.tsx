
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DisplaySettingsProps {
  settings: SiteSettings;
  handleInputChange: (field: keyof SiteSettings, value: any) => void;
}

export const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  settings,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <Alert variant="default" className="mb-4 bg-yellow-50 text-yellow-800 border border-yellow-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Le mode sombre est désactivé sur cette plateforme pour assurer une expérience utilisateur cohérente.
        </AlertDescription>
      </Alert>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={false}
          disabled={true}
          id="darkMode"
          aria-label="Mode sombre (désactivé)"
        />
        <Label htmlFor="darkMode">Mode sombre (désactivé)</Label>
      </div>
    </div>
  );
};
