
import React from 'react';
import { SiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from './ImageUploadField';
import { ColorPickerField } from './ColorPickerField';

interface ThemeSettingsTabProps {
  settings: SiteSettings;
  logoUrl: string;
  logoUploading: boolean;
  faviconUrl: string;
  faviconUploading: boolean;
  handleLogoUpload: () => void;
  handleFaviconUpload: () => void;
  handleThemeColorChange: (type: 'primaryColor' | 'secondaryColor', color: string) => void;
  handleInputChange: (field: keyof SiteSettings, value: any) => void;
}

export const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  settings,
  logoUrl,
  logoUploading,
  faviconUrl,
  faviconUploading,
  handleLogoUpload,
  handleFaviconUpload,
  handleThemeColorChange,
  handleInputChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du thème</CardTitle>
        <CardDescription>Personnalisez l'apparence de votre site.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadField
            label="Logo"
            imageUrl={logoUrl}
            onUpload={handleLogoUpload}
            isUploading={logoUploading}
          />
          <ImageUploadField
            label="Favicon"
            imageUrl={faviconUrl}
            onUpload={handleFaviconUpload}
            isUploading={faviconUploading}
          />
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fontFamily">Police</Label>
            <Input
              type="text"
              id="fontFamily"
              defaultValue={settings.fontFamily}
              onChange={(e) => handleInputChange('fontFamily', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="borderRadius">Rayon de bordure</Label>
            <select
              id="borderRadius"
              className="w-full border rounded-md p-2"
              defaultValue={settings.borderRadius}
              onChange={(e) => handleInputChange('borderRadius', e.target.value)}
            >
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>
          </div>
        </div>
        <div>
          <Label>Mode sombre</Label>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={(checked) => handleInputChange('darkMode', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
