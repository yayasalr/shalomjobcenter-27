
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneralSettingsTabProps {
  settings: SiteSettings;
  handleInputChange: (field: keyof SiteSettings, value: any) => void;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  settings,
  handleInputChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>Configurez les paramètres de base de votre site.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="siteName">Nom du site</Label>
            <Input
              type="text"
              id="siteName"
              defaultValue={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="siteDescription">Description du site</Label>
            <Input
              type="text"
              id="siteDescription"
              defaultValue={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adminEmail">Email de l'administrateur</Label>
            <Input
              type="email"
              id="adminEmail"
              defaultValue={settings.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supportEmail">Email de support</Label>
            <Input
              type="email"
              id="supportEmail"
              defaultValue={settings.supportEmail}
              onChange={(e) => handleInputChange('supportEmail', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
            <Input
              type="tel"
              id="phoneNumber"
              defaultValue={settings.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              type="text"
              id="address"
              defaultValue={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
