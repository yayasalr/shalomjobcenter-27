
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

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
      <CardContent className="grid gap-6 pt-6">
        <div>
          <Label htmlFor="contact" className="text-blue-700 font-medium">Contact</Label>
          <Separator className="my-2 bg-blue-100" />
          <Textarea
            id="contact"
            defaultValue={settings.footer.contact}
            onChange={(e) => handleFooterChange('contact', e.target.value)}
            className="border-blue-200 focus:border-blue-500 mt-1"
          />
        </div>
        <div>
          <Label htmlFor="about" className="text-blue-700 font-medium">À propos</Label>
          <Separator className="my-2 bg-blue-100" />
          <Textarea
            id="about"
            defaultValue={settings.footer.about}
            onChange={(e) => handleFooterChange('about', e.target.value)}
            className="border-blue-200 focus:border-blue-500 mt-1"
          />
        </div>
        <div>
          <Label htmlFor="terms" className="text-blue-700 font-medium">Conditions d'utilisation</Label>
          <Separator className="my-2 bg-blue-100" />
          <Textarea
            id="terms"
            defaultValue={settings.footer.terms}
            onChange={(e) => handleFooterChange('terms', e.target.value)}
            className="border-blue-200 focus:border-blue-500 mt-1"
          />
        </div>
        <div>
          <Label htmlFor="policy" className="text-blue-700 font-medium">Politique de confidentialité</Label>
          <Separator className="my-2 bg-blue-100" />
          <Textarea
            id="policy"
            defaultValue={settings.footer.policy}
            onChange={(e) => handleFooterChange('policy', e.target.value)}
            className="border-blue-200 focus:border-blue-500 mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};
