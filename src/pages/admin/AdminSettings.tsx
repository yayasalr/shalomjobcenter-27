import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';
import { ColorPicker } from "@/components/ui/color-picker"
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

const AdminSettings = () => {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [logoUrl, setLogoUrl] = useState(settings.logo);
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState(settings.favicon);
  const [faviconUploading, setFaviconUploading] = useState(false);

  // Fix handler functions to remove .mutate
  const handleLogoUpload = () => {
    setLogoUploading(true);
    setTimeout(() => {
      const newLogoUrl = "/lovable-uploads/9eef1ea2-a8eb-4b08-a069-92ccc2b21a1e.png";
      setLogoUrl(newLogoUrl);
      updateSettings({ logo: newLogoUrl });
      setLogoUploading(false);
      toast.success("Logo mis à jour avec succès");
    }, 1500);
  };

  const handleFaviconUpload = () => {
    setFaviconUploading(true);
    setTimeout(() => {
      const newFaviconUrl = "/lovable-uploads/740ff73c-9223-468f-941b-578d7b960c2d.png";
      setFaviconUrl(newFaviconUrl);
      updateSettings({ favicon: newFaviconUrl });
      setFaviconUploading(false);
      toast.success("Favicon mis à jour avec succès");
    }, 1500);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const success = await importSettings(file);

    if (success) {
      toast.success("Paramètres importés avec succès");
    } else {
      toast.error("Échec de l'importation des paramètres");
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSettingsExport = () => {
    const success = exportSettings();
    if (success) {
      toast.success("Paramètres exportés avec succès");
    } else {
      toast.error("Échec de l'exportation des paramètres");
    }
  };

  // Fix handler functions to remove .mutate
  const handleThemeColorChange = (type: 'primaryColor' | 'secondaryColor', color: string) => {
    updateSettings({ [type]: color });
    toast.success(`Couleur ${type === 'primaryColor' ? 'principale' : 'secondaire'} mise à jour`);
  };

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    updateSettings({ [field]: value });
  };

  const handleFooterChange = (field: keyof SiteSettings['footer'], value: string) => {
    updateSettings({
      footer: { ...settings.footer, [field]: value }
    });
  };

  const handleCompanyInfoChange = (field: keyof SiteSettings['companyInfo'], value: string) => {
    updateSettings({
      companyInfo: { ...settings.companyInfo, [field]: value }
    });
  };

  const handleSocialLinkChange = (field: keyof SiteSettings['socialLinks'], value: string) => {
    updateSettings({
      socialLinks: { ...settings.socialLinks, [field]: value }
    });
  };

  const handleReset = () => {
    resetSettings();
    setLogoUrl(defaultSettings.logo);
    setFaviconUrl(defaultSettings.favicon);
    toast.success("Paramètres réinitialisés avec succès");
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Paramètres du site</h1>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general" onClick={() => setActiveTab("general")}>Général</TabsTrigger>
          <TabsTrigger value="theme" onClick={() => setActiveTab("theme")}>Thème</TabsTrigger>
          <TabsTrigger value="footer" onClick={() => setActiveTab("footer")}>Pied de page</TabsTrigger>
          <TabsTrigger value="company" onClick={() => setActiveTab("company")}>Entreprise</TabsTrigger>
          <TabsTrigger value="social" onClick={() => setActiveTab("social")}>Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="importExport" onClick={() => setActiveTab("importExport")}>Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du thème</CardTitle>
              <CardDescription>Personnalisez l'apparence de votre site.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Logo</Label>
                  <div className="flex items-center space-x-4">
                    <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
                    <Button variant="secondary" size="sm" onClick={handleLogoUpload} disabled={logoUploading}>
                      {logoUploading ? 'Téléchargement...' : 'Modifier le logo'}
                      <Upload className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Favicon</Label>
                  <div className="flex items-center space-x-4">
                    <img src={faviconUrl} alt="Favicon" className="h-8 w-auto" />
                    <Button variant="secondary" size="sm" onClick={handleFaviconUpload} disabled={faviconUploading}>
                      {faviconUploading ? 'Téléchargement...' : 'Modifier le favicon'}
                      <Upload className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Couleur principale</Label>
                  <ColorPicker color={settings.primaryColor} onColorChange={(color) => handleThemeColorChange('primaryColor', color)} />
                </div>
                <div>
                  <Label>Couleur secondaire</Label>
                  <ColorPicker color={settings.secondaryColor} onColorChange={(color) => handleThemeColorChange('secondaryColor', color)} />
                </div>
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
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du pied de page</CardTitle>
              <CardDescription>Modifiez le contenu du pied de page de votre site.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Textarea
                  id="contact"
                  defaultValue={settings.footer.contact}
                  onChange={(e) => handleFooterChange('contact', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="about">À propos</Label>
                <Textarea
                  id="about"
                  defaultValue={settings.footer.about}
                  onChange={(e) => handleFooterChange('about', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="terms">Conditions d'utilisation</Label>
                <Textarea
                  id="terms"
                  defaultValue={settings.footer.terms}
                  onChange={(e) => handleFooterChange('terms', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="policy">Politique de confidentialité</Label>
                <Textarea
                  id="policy"
                  defaultValue={settings.footer.policy}
                  onChange={(e) => handleFooterChange('policy', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liens vers les réseaux sociaux</CardTitle>
              <CardDescription>Ajoutez ou modifiez vos liens vers les réseaux sociaux.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  type="url"
                  id="facebook"
                  defaultValue={settings.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  type="url"
                  id="twitter"
                  defaultValue={settings.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  type="url"
                  id="instagram"
                  defaultValue={settings.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  type="url"
                  id="linkedin"
                  defaultValue={settings.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="importExport" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Importer / Exporter les paramètres</CardTitle>
              <CardDescription>Importer ou exporter les paramètres de votre site.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <Button onClick={handleImportClick}>Importer les paramètres</Button>
              <Button onClick={handleSettingsExport}>Exporter les paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button variant="destructive" onClick={handleReset}>Réinitialiser les paramètres</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
