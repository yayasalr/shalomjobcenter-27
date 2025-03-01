
import React from 'react';
import { SiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanySettingsTabProps {
  settings: SiteSettings;
  handleCompanyInfoChange: (field: keyof SiteSettings['companyInfo'], value: string) => void;
}

export const CompanySettingsTab: React.FC<CompanySettingsTabProps> = ({
  settings,
  handleCompanyInfoChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations sur l'entreprise</CardTitle>
        <CardDescription>Mettez à jour les informations de votre entreprise.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            type="text"
            id="address"
            defaultValue={settings.companyInfo.address}
            onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            type="tel"
            id="phone"
            defaultValue={settings.companyInfo.phone}
            onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            defaultValue={settings.companyInfo.email}
            onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="registrationNumber">Numéro d'enregistrement</Label>
          <Input
            type="text"
            id="registrationNumber"
            defaultValue={settings.companyInfo.registrationNumber}
            onChange={(e) => handleCompanyInfoChange('registrationNumber', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
