
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TypographySettingsProps {
  settings: SiteSettings;
  handleInputChange: (field: keyof SiteSettings, value: any) => void;
}

export const TypographySettings: React.FC<TypographySettingsProps> = ({
  settings,
  handleInputChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="fontFamily">Police</Label>
        <Input
          type="text"
          id="fontFamily"
          value={settings.fontFamily}
          onChange={(e) => handleInputChange('fontFamily', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="borderRadius">Rayon de bordure</Label>
        <select
          id="borderRadius"
          className="w-full border rounded-md p-2"
          value={settings.borderRadius}
          onChange={(e) => handleInputChange('borderRadius', e.target.value as any)}
        >
          <option value="small">Petit</option>
          <option value="medium">Moyen</option>
          <option value="large">Grand</option>
        </select>
      </div>
    </div>
  );
};
