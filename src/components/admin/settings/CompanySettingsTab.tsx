
import React, { useState } from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Share2, Link, Info } from 'lucide-react';
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
  const [showHelp, setShowHelp] = useState(false);
  
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
    
    // Déterminer si c'est des coordonnées simples
    const coordsRegex = /^(-?\d+\.\d+),(-?\d+\.\d+)$/;
    let mapsUrl;
    
    if (coordsRegex.test(settings.companyInfo.mapLocation)) {
      // C'est des coordonnées simples
      const [lat, lng] = settings.companyInfo.mapLocation.split(',');
      mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    } else if (settings.companyInfo.mapLocation.startsWith('http')) {
      // C'est déjà une URL
      mapsUrl = settings.companyInfo.mapLocation;
    } else {
      // Fallback - utiliser comme terme de recherche
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.companyInfo.mapLocation)}`;
    }
    
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
  
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleCompanyInfoChange('mapLocation', text);
        toast.success("Lien de localisation collé depuis le presse-papiers");
      }
    } catch (err) {
      console.error("Erreur lors de la lecture du presse-papiers:", err);
      toast.error("Impossible de lire le presse-papiers");
    }
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
          
          <div className="flex flex-col gap-3 items-start">
            <div className="flex w-full gap-2">
              <div className="flex-1">
                <Label htmlFor="mapLocation" className="block mb-1">Coordonnées de localisation</Label>
                <div className="flex">
                  <Input
                    id="mapLocation"
                    value={settings.companyInfo.mapLocation || ''}
                    onChange={(e) => handleCompanyInfoChange('mapLocation', e.target.value)}
                    placeholder="Ex: 6.1796825,1.1272278 ou URL Google Maps"
                    className="bg-white rounded-r-none"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-l-none border-l-0"
                    onClick={handlePasteFromClipboard}
                    title="Coller depuis le presse-papiers"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
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
              <Button
                variant="ghost"
                onClick={() => setShowHelp(!showHelp)}
                size="sm"
                className="ml-auto text-xs"
              >
                <Info className="h-4 w-4 mr-1" />
                Aide
              </Button>
            </div>
            
            {showHelp && (
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-100 w-full mt-2">
                <p className="font-medium mb-2">Formats acceptés pour la localisation :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Coordonnées GPS : <code className="bg-blue-100 px-1 rounded">6.1796825,1.1272278</code></li>
                  <li>Lien Google Maps : <code className="bg-blue-100 px-1 rounded text-xs">https://www.google.com/maps?q=Lomé</code></li>
                  <li>URL de place : <code className="bg-blue-100 px-1 rounded text-xs">https://maps.app.goo.gl/...</code></li>
                </ul>
                <p className="mt-2 text-xs">Astuce : Utilisez le bouton "Définir ma position" si vous êtes actuellement sur le lieu de votre entreprise.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
