
import React, { useState } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface CompanySettingsTabProps {
  settings: SiteSettings;
  handleCompanyInfoChange: (field: keyof SiteSettings['companyInfo'], value: string) => void;
}

export const CompanySettingsTab: React.FC<CompanySettingsTabProps> = ({
  settings,
  handleCompanyInfoChange
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas prise en charge par votre navigateur");
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude},${longitude}`;
        
        // Update the company location in settings
        handleCompanyInfoChange('mapLocation', locationString);
        
        toast.success("Localisation mise à jour avec succès");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        toast.error("Impossible d'obtenir votre position actuelle");
        setIsGettingLocation(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };
  
  const handleShareLocation = () => {
    if (!settings.companyInfo.mapLocation) {
      toast.error("Aucune localisation à partager");
      return;
    }
    
    // Create Google Maps URL from coordinates
    const [lat, lng] = settings.companyInfo.mapLocation.split(',');
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(mapsUrl)
      .then(() => {
        toast.success("Lien de localisation copié dans le presse-papiers");
      })
      .catch(err => {
        console.error("Erreur lors de la copie:", err);
        toast.error("Impossible de copier le lien");
      });
  };

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
        
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-medium mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Partager la localisation de l'entreprise
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Les utilisateurs pourront suivre cette localisation pour trouver votre entreprise
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1">
              <Label htmlFor="mapLocation">Coordonnées de localisation</Label>
              <Input
                type="text"
                id="mapLocation"
                value={settings.companyInfo.mapLocation || ''}
                readOnly
                placeholder="Aucune localisation définie"
                className="bg-white"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? 'Chargement...' : 'Définir ma position'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleShareLocation}
                disabled={!settings.companyInfo.mapLocation}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
