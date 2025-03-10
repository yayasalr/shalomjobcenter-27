
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import "../../../../styles/components/logo.css";

interface LogoSectionProps {
  logoUrl: string;
  logoUploading: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LogoSection = ({ 
  logoUrl, 
  logoUploading, 
  handleLogoUpload 
}: LogoSectionProps) => {
  const { settings } = useSiteSettings();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [logoError, setLogoError] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  useEffect(() => {
    try {
      // Réinitialiser l'état d'erreur au début
      setLogoError(false);
      setLogoLoaded(false);
      
      // Vérifier si le logo est stocké séparément
      if (settings.logo === 'stored_separately') {
        const storedLogo = localStorage.getItem('site_logo');
        if (storedLogo) {
          console.log("Logo chargé depuis le stockage séparé");
          setPreviewUrl(storedLogo);
        } else {
          console.log("Aucun logo trouvé dans le stockage séparé");
          setPreviewUrl(logoUrl || "");
        }
      } else {
        console.log("Utilisation du logo depuis les paramètres");
        setPreviewUrl(settings.logo || logoUrl || "");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du logo:", error);
      setLogoError(true);
      toast.error("Erreur lors du chargement du logo");
    }
  }, [settings.logo, logoUrl]);
  
  const handleLogoError = () => {
    console.error("Erreur lors du chargement de l'aperçu du logo");
    setLogoError(true);
    toast.error("Impossible d'afficher le logo. Veuillez essayer de le télécharger à nouveau.");
  };
  
  const handleRetryLoad = () => {
    setLogoError(false);
    setLogoLoaded(false);
    
    // Force reload by setting a temporary empty value
    setPreviewUrl("");
    setTimeout(() => {
      if (settings.logo === 'stored_separately') {
        const storedLogo = localStorage.getItem('site_logo');
        setPreviewUrl(storedLogo || logoUrl || "");
      } else {
        setPreviewUrl(settings.logo || logoUrl || "");
      }
    }, 100);
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-1.5 mb-4">
        <Label htmlFor="logo">Logo du site</Label>
        <p className="text-sm text-muted-foreground">
          Téléchargez votre logo pour le site. Formats recommandés: PNG, SVG (transparent).
        </p>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <Card className="w-full sm:w-1/3">
          <CardContent className="p-4 flex items-center justify-center">
            <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden logo-container">
              {logoUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Chargement...</span>
                </div>
              ) : previewUrl && !logoError ? (
                <img 
                  src={previewUrl} 
                  alt="Logo du site" 
                  className={`max-w-full max-h-[120px] object-contain logo ${logoLoaded ? '' : 'opacity-0'}`}
                  onError={handleLogoError}
                  onLoad={() => setLogoLoaded(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 logo-fallback rounded-full h-20 w-20 bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {settings.siteName ? settings.siteName.substring(0, 2).toUpperCase() : 'SJ'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col justify-center space-y-4 w-full sm:w-2/3">
          {logoError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erreur lors du chargement du logo. Veuillez essayer de télécharger à nouveau.
              </AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto" 
                onClick={handleRetryLoad}
              >
                Réessayer
              </Button>
            </Alert>
          )}
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="relative" disabled={logoUploading}>
              {logoUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {previewUrl ? "Changer le logo" : "Ajouter un logo"}
              <input
                id="logo"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleLogoUpload}
                accept="image/*"
                disabled={logoUploading}
              />
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Formats supportés: JPG, PNG, GIF, SVG. Taille max: 2MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
