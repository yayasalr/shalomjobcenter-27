
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FooterFields } from './footer/FooterFields';

interface FooterSettingsTabProps {
  settings: SiteSettings;
  handleFooterChange: (field: keyof SiteSettings['footer'], value: string) => void;
}

export const FooterSettingsTab: React.FC<FooterSettingsTabProps> = ({
  settings,
  handleFooterChange
}) => {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardTitle>Paramètres du pied de page</CardTitle>
        <CardDescription className="text-blue-100">Modifiez le contenu du pied de page de votre site.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FooterFields 
          settings={settings.footer} 
          onFieldChange={handleFooterChange}
        />
      </CardContent>
    </Card>
  );
};
