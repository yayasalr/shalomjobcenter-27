
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DisplaySettingsProps {
  settings: SiteSettings;
  handleInputChange: (field: keyof SiteSettings, value: any) => void;
}

export const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  settings,
  handleInputChange
}) => {
  // Le mode est toujours clair, désactivé la possibilité de changer
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={false}
        disabled={true}
        id="darkMode"
      />
      <Label htmlFor="darkMode">Mode sombre (désactivé)</Label>
    </div>
  );
};
