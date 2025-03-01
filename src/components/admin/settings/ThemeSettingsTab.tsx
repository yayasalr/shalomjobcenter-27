
import React, { useState, useEffect } from 'react';
import { SiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from './ImageUploadField';
import { ColorPickerField } from './ColorPickerField';
import { toast } from "sonner";

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
  const [logoError, setLogoError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  
  // Réinitialiser les erreurs lorsque les URLs changent
  useEffect(() => {
    setLogoError(false);
  }, [logoUrl]);
  
  useEffect(() => {
    setFaviconError(false);
  }, [faviconUrl]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du thème</CardTitle>
        <CardDescription>Personnalisez l'apparence de votre site.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Logo</Label>
            <div className="flex items-center space-x-4 mt-1">
              <div className="h-16 w-16 flex items-center justify-center overflow-hidden bg-gray-50 rounded-full">
                {!logoError ? (
                  <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="h-full w-auto object-contain" 
                    onError={() => {
                      setLogoError(true);
                      toast.error("Erreur de chargement du logo");
                    }}
                  />
                ) : (
                  <span className="text-sm text-gray-400">Logo</span>
                )}
              </div>
              <ImageUploadField
                label=""
                imageUrl={logoUrl}
                onUpload={handleLogoUpload}
                isUploading={logoUploading}
              />
            </div>
          </div>
          <div>
            <Label>Favicon</Label>
            <div className="flex items-center space-x-4 mt-1">
              <div className="h-16 w-16 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg">
                {!faviconError ? (
                  <img 
                    src={faviconUrl} 
                    alt="Favicon" 
                    className="h-full w-auto object-contain"
                    onError={() => {
                      setFaviconError(true);
                      toast.error("Erreur de chargement du favicon");
                    }}
                  />
                ) : (
                  <span className="text-sm text-gray-400">Favicon</span>
                )}
              </div>
              <ImageUploadField
                label=""
                imageUrl={faviconUrl}
                onUpload={handleFaviconUpload}
                isUploading={faviconUploading}
              />
            </div>
          </div>
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
              onChange={(e) => handleInputChange('borderRadius', e.target.value as any)}
            >
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.darkMode}
            onCheckedChange={(checked) => handleInputChange('darkMode', checked)}
            id="darkMode"
          />
          <Label htmlFor="darkMode">Mode sombre</Label>
        </div>
      </CardContent>
    </Card>
  );
};
