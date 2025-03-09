
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FooterFields } from './footer/FooterFields';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';

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
        <div className="flex items-center gap-2">
          <CardTitle>Paramètres du pied de page</CardTitle>
          <InfoIcon size={16} className="text-blue-200" />
        </div>
        <CardDescription className="text-blue-100">
          Modifiez le contenu du pied de page de votre site pour améliorer l'expérience utilisateur et respecter les obligations légales.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FooterFields 
          settings={settings.footer} 
          onFieldChange={handleFooterChange}
        />
        
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs text-gray-500"
            onClick={() => window.open('/home', '_blank')}
          >
            Prévisualiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
