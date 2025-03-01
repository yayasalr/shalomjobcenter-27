
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { ColorPickerField } from '../ColorPickerField';

interface ColorSettingsProps {
  settings: SiteSettings;
  handleThemeColorChange: (type: 'primaryColor' | 'secondaryColor', color: string) => void;
}

export const ColorSettings: React.FC<ColorSettingsProps> = ({
  settings,
  handleThemeColorChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ColorPickerField
        label="Couleur principale"
        color={settings.primaryColor}
        onColorChange={(color) => handleThemeColorChange('primaryColor', color)}
      />
      <ColorPickerField
        label="Couleur secondaire"
        color={settings.secondaryColor}
        onColorChange={(color) => handleThemeColorChange('secondaryColor', color)}
      />
    </div>
  );
};
