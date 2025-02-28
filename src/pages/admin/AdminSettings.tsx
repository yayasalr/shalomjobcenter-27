
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Bell, 
  Lock, 
  Mail, 
  Upload,
  Save,
  Palette,
  Language,
  DollarSign,
  Euro,
  MapPin,
  Share2,
  Image,
  FileText,
  Check
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const AdminSettings = () => {
  const { settings, updateSettings } = useSiteSettings();
  
  // États locaux pour les formulaires
  const [generalSettings, setGeneralSettings] = useState({
    siteName: settings.siteName || 'Sholom',
    siteDescription: settings.siteDescription || 'Plateforme de location de logements',
    adminEmail: settings.adminEmail || 'admin@sholom.com',
    supportEmail: settings.supportEmail || 'support@sholom.com',
    phoneNumber: settings.phoneNumber || '+228 90 123 456',
    address: settings.address || 'Lomé, Togo',
    logo: settings.logo || '/placeholder.svg',
    favicon: settings.favicon || '/favicon.ico',
  });
  
  const [appearance, setAppearance] = useState({
    primaryColor: settings.primaryColor || '#10b981',
    secondaryColor: settings.secondaryColor || '#6366f1',
    fontFamily: settings.fontFamily || 'Inter',
    borderRadius: settings.borderRadius || 'medium',
    darkMode: settings.darkMode || false,
  });
  
  const [localization, setLocalization] = useState({
    defaultLanguage: settings.defaultLanguage || 'fr',
    defaultCurrency: settings.defaultCurrency || 'XOF',
    dateFormat: settings.dateFormat || 'DD/MM/YYYY',
    timeFormat: settings.timeFormat || '24h',
    timezone: settings.timezone || 'Africa/Lome',
  });
  
  const [mediaSettings, setMediaSettings] = useState({
    maxFileSize: settings.maxFileSize || 5, // en MB
    allowedFileTypes: settings.allowedFileTypes || 'jpg,jpeg,png,gif,pdf',
    imageCompression: settings.imageCompression || 'medium',
    watermarkEnabled: settings.watermarkEnabled || false,
    watermarkOpacity: settings.watermarkOpacity || 50,
  });
  
  const [emailSettings, setEmailSettings] = useState({
    mailProvider: settings.mailProvider || 'smtp',
    smtpHost: settings.smtpHost || 'smtp.example.com',
    smtpPort: settings.smtpPort || '587',
    smtpUser: settings.smtpUser || 'user@example.com',
    smtpPassword: settings.smtpPassword || '',
    senderName: settings.senderName || 'Sholom',
    senderEmail: settings.senderEmail || 'no-reply@sholom.com',
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    currency: settings.currency || 'XOF',
    stripeLiveKey: settings.stripeLiveKey || '',
    stripeTestKey: settings.stripeTestKey || '',
    paypalClientId: settings.paypalClientId || '',
    testMode: settings.testMode || true,
    commissionRate: settings.commissionRate || 5,
    minWithdrawalAmount: settings.minWithdrawalAmount || 1000,
  });
  
  const [socialSettings, setSOcialSettings] = useState({
    facebookUrl: settings.facebookUrl || '',
    twitterUrl: settings.twitterUrl || '',
    instagramUrl: settings.instagramUrl || '',
    linkedinUrl: settings.linkedinUrl || '',
    youtubeUrl: settings.youtubeUrl || '',
    enableSocialLogin: settings.enableSocialLogin || true,
    enableSocialSharing: settings.enableSocialSharing || true,
  });
  
  // Gérer l'enregistrement des paramètres généraux
  const handleSaveGeneralSettings = () => {
    updateSettings({
      ...settings,
      ...generalSettings
    });
    toast.success("Paramètres généraux enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres d'apparence
  const handleSaveAppearance = () => {
    updateSettings({
      ...settings,
      ...appearance
    });
    toast.success("Paramètres d'apparence enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres de localisation
  const handleSaveLocalization = () => {
    updateSettings({
      ...settings,
      ...localization
    });
    toast.success("Paramètres de localisation enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres médias
  const handleSaveMediaSettings = () => {
    updateSettings({
      ...settings,
      ...mediaSettings
    });
    toast.success("Paramètres médias enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres email
  const handleSaveEmailSettings = () => {
    updateSettings({
      ...settings,
      ...emailSettings
    });
    toast.success("Paramètres email enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres de paiement
  const handleSavePaymentSettings = () => {
    updateSettings({
      ...settings,
      ...paymentSettings
    });
    toast.success("Paramètres de paiement enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres sociaux
  const handleSaveSocialSettings = () => {
    updateSettings({
      ...settings,
      ...socialSettings
    });
    toast.success("Paramètres sociaux enregistrés avec succès");
  };
  
  // Tester l'envoi d'email
  const handleTestEmail = () => {
    toast.success("Email de test envoyé avec succès");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Paramètres du site</h1>
            <p className="text-gray-500">Configurez les paramètres généraux de votre site</p>
          </div>
          
          <Tabs defaultValue="general" className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto">
              <TabsList className="inline-flex h-9 w-auto">
                <TabsTrigger value="general" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Général
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Apparence
                </TabsTrigger>
                <TabsTrigger value="localization" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Localisation
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Médias
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Paiement
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Réseaux sociaux
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Paramètres généraux */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                  <CardDescription>
                    Configurez les informations de base de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nom du site</Label>
                      <Input 
                        id="siteName" 
                        value={generalSettings.siteName} 
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email de l'administrateur</Label>
                      <Input 
                        id="adminEmail" 
                        type="email" 
                        value={generalSettings.adminEmail} 
                        onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Email de support</Label>
                      <Input 
                        id="supportEmail" 
                        type="email" 
                        value={generalSettings.supportEmail} 
                        onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                      <Input 
                        id="phoneNumber" 
                        value={generalSettings.phoneNumber} 
                        onChange={(e) => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Description du site</Label>
                    <Textarea 
                      id="siteDescription" 
                      value={generalSettings.siteDescription} 
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    />
                    <p className="text-sm text-gray-500">Cette description apparaîtra dans les moteurs de recherche</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input 
                      id="address" 
                      value={generalSettings.address} 
                      onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo</Label>
                      <div className="flex items-center gap-4">
                        <img 
                          src={generalSettings.logo} 
                          alt="Logo" 
                          className="h-12 w-12 object-contain border rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <Button variant="outline" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Changer
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="favicon">Favicon</Label>
                      <div className="flex items-center gap-4">
                        <img 
                          src={generalSettings.favicon} 
                          alt="Favicon" 
                          className="h-12 w-12 object-contain border rounded-md" 
                          onError={(e) => {
                            e.currentTarget.src = "/favicon.ico";
                          }}
                        />
                        <Button variant="outline" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Changer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveGeneralSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Paramètres d'apparence */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Couleur principale</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-8 w-8 rounded-md border" 
                          style={{ backgroundColor: appearance.primaryColor }}
                        />
                        <Input 
                          id="primaryColor" 
                          value={appearance.primaryColor} 
                          onChange={(e) => setAppearance({...appearance, primaryColor: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-8 w-8 rounded-md border" 
                          style={{ backgroundColor: appearance.secondaryColor }}
                        />
                        <Input 
                          id="secondaryColor" 
                          value={appearance.secondaryColor} 
                          onChange={(e) => setAppearance({...appearance, secondaryColor: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Police de caractères</Label>
                      <Select 
                        value={appearance.fontFamily}
                        onValueChange={(value) => setAppearance({...appearance, fontFamily: value})}
                      >
                        <SelectTrigger id="fontFamily">
                          <SelectValue placeholder="Sélectionner une police" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="borderRadius">Rayon des bordures</Label>
                      <Select 
                        value={appearance.borderRadius}
                        onValueChange={(value) => setAppearance({...appearance, borderRadius: value})}
                      >
                        <SelectTrigger id="borderRadius">
                          <SelectValue placeholder="Sélectionner un rayon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          <SelectItem value="small">Petit</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="large">Grand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="darkMode" 
                      checked={appearance.darkMode}
                      onCheckedChange={(checked) => setAppearance({...appearance, darkMode: checked})}
                    />
                    <Label htmlFor="darkMode">Activer le mode sombre</Label>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-sm font-medium mb-2">Aperçu</h3>
                    <div className="flex flex-col gap-2">
                      <div 
                        className="p-4 rounded-md text-white" 
                        style={{ 
                          backgroundColor: appearance.primaryColor,
                          borderRadius: appearance.borderRadius === 'none' ? '0' : 
                            appearance.borderRadius === 'small' ? '0.25rem' : 
                            appearance.borderRadius === 'medium' ? '0.5rem' : '1rem'
                        }}
                      >
                        <p style={{ fontFamily: appearance.fontFamily }}>Bouton principal</p>
                      </div>
                      <div 
                        className="p-4 rounded-md text-white" 
                        style={{ 
                          backgroundColor: appearance.secondaryColor,
                          borderRadius: appearance.borderRadius === 'none' ? '0' : 
                            appearance.borderRadius === 'small' ? '0.25rem' : 
                            appearance.borderRadius === 'medium' ? '0.5rem' : '1rem'
                        }}
                      >
                        <p style={{ fontFamily: appearance.fontFamily }}>Bouton secondaire</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveAppearance} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Paramètres de localisation */}
            <TabsContent value="localization">
              <Card>
                <CardHeader>
                  <CardTitle>Localisation</CardTitle>
                  <CardDescription>
                    Configurez les paramètres régionaux de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                      <Select 
                        value={localization.defaultLanguage}
                        onValueChange={(value) => setLocalization({...localization, defaultLanguage: value})}
                      >
                        <SelectTrigger id="defaultLanguage">
                          <SelectValue placeholder="Sélectionner une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                      <Select 
                        value={localization.defaultCurrency}
                        onValueChange={(value) => setLocalization({...localization, defaultCurrency: value})}
                      >
                        <SelectTrigger id="defaultCurrency">
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XOF">
                            <div className="flex items-center">
                              <span className="mr-2">XOF</span>
                              <span>Franc CFA BCEAO</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="EUR">
                            <div className="flex items-center">
                              <span className="mr-2">EUR</span>
                              <span>Euro</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="USD">
                            <div className="flex items-center">
                              <span className="mr-2">USD</span>
                              <span>Dollar américain</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Format de date</Label>
                      <Select 
                        value={localization.dateFormat}
                        onValueChange={(value) => setLocalization({...localization, dateFormat: value})}
                      >
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Sélectionner un format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Format d'heure</Label>
                      <Select 
                        value={localization.timeFormat}
                        onValueChange={(value) => setLocalization({...localization, timeFormat: value})}
                      >
                        <SelectTrigger id="timeFormat">
                          <SelectValue placeholder="Sélectionner un format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
                          <SelectItem value="24h">24 heures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select 
                      value={localization.timezone}
                      onValueChange={(value) => setLocalization({...localization, timezone: value})}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lome">Africa/Lome (UTC+00:00)</SelectItem>
                        <SelectItem value="Europe/Paris">Europe/Paris (UTC+01:00)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (UTC-05:00)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+09:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveLocalization} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Paramètres des médias */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Médias</CardTitle>
                  <CardDescription>
                    Configurez les paramètres pour la gestion des fichiers médias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">Taille maximale des fichiers (MB)</Label>
                      <Input 
                        id="maxFileSize" 
                        type="number" 
                        min="1"
                        max="50"
                        value={mediaSettings.maxFileSize} 
                        onChange={(e) => setMediaSettings({...mediaSettings, maxFileSize: Number(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowedFileTypes">Types de fichiers autorisés</Label>
                      <Input 
                        id="allowedFileTypes" 
                        value={mediaSettings.allowedFileTypes} 
                        onChange={(e) => setMediaSettings({...mediaSettings, allowedFileTypes: e.target.value})}
                      />
                      <p className="text-xs text-gray-500">Séparés par des virgules (ex: jpg,png,pdf)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageCompression">Compression d'image</Label>
                    <Select 
                      value={mediaSettings.imageCompression}
                      onValueChange={(value) => setMediaSettings({...mediaSettings, imageCompression: value})}
                    >
                      <SelectTrigger id="imageCompression">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune compression</SelectItem>
                        <SelectItem value="low">Faible (90% qualité)</SelectItem>
                        <SelectItem value="medium">Moyenne (80% qualité)</SelectItem>
                        <SelectItem value="high">Haute (70% qualité)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="watermarkEnabled" 
                        checked={mediaSettings.watermarkEnabled}
                        onCheckedChange={(checked) => setMediaSettings({...mediaSettings, watermarkEnabled: checked})}
                      />
                      <Label htmlFor="watermarkEnabled">Activer le filigrane sur les images</Label>
                    </div>
                    
                    {mediaSettings.watermarkEnabled && (
                      <div className="pl-6 space-y-2">
                        <Label htmlFor="watermarkOpacity">Opacité du filigrane (%)</Label>
                        <Input 
                          id="watermarkOpacity" 
                          type="number" 
                          min="10"
                          max="100"
                          value={mediaSettings.watermarkOpacity} 
                          onChange={(e) => setMediaSettings({...mediaSettings, watermarkOpacity: Number(e.target.value)})}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveMediaSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Paramètres des emails */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>
                    Configurez les paramètres d'envoi d'emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mailProvider">Fournisseur d'email</Label>
                    <Select 
                      value={emailSettings.mailProvider}
                      onValueChange={(value) => setEmailSettings({...emailSettings, mailProvider: value})}
                    >
                      <SelectTrigger id="mailProvider">
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {emailSettings.mailProvider === 'smtp' && (
                    <div className="space-y-6 border-l-2 pl-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost">Serveur SMTP</Label>
                          <Input 
                            id="smtpHost" 
                            value={emailSettings.smtpHost} 
                            onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">Port SMTP</Label>
                          <Input 
                            id="smtpPort" 
                            value={emailSettings.smtpPort} 
                            onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
                          <Input 
                            id="smtpUser" 
                            value={emailSettings.smtpUser} 
                            onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                          <Input 
                            id="smtpPassword" 
                            type="password"
                            value={emailSettings.smtpPassword} 
                            onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Nom de l'expéditeur</Label>
                      <Input 
                        id="senderName" 
                        value={emailSettings.senderName} 
                        onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">Email de l'expéditeur</Label>
                      <Input 
                        id="senderEmail" 
                        type="email"
                        value={emailSettings.senderEmail} 
                        onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-4">
                    <Button onClick={handleTestEmail} variant="outline" className="w-fit gap-2">
                      <Mail className="h-4 w-4" />
                      Envoyer un email de test
                    </Button>
                    <p className="text-xs text-gray-500">
                      Envoie un email de test pour vérifier que la configuration est correcte
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveEmailSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Paramètres de paiement */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Paiement</CardTitle>
                  <CardDescription>
                    Configurez les options de paiement de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise principale</Label>
                    <Select 
                      value={paymentSettings.currency}
                      onValueChange={(value) => setPaymentSettings({...paymentSettings, currency: value})}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XOF">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>XOF - Franc CFA BCEAO</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-2" />
                            <span>EUR - Euro</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="USD">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>USD - Dollar américain</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Stripe</h3>
                    <div className="space-y-2">
                      <Label htmlFor="stripeLiveKey">Clé API Stripe (Production)</Label>
                      <Input 
                        id="stripeLiveKey" 
                        value={paymentSettings.stripeLiveKey} 
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeLiveKey: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stripeTestKey">Clé API Stripe (Test)</Label>
                      <Input 
                        id="stripeTestKey" 
                        value={paymentSettings.stripeTestKey} 
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeTestKey: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">PayPal</h3>
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientId">ID Client PayPal</Label>
                      <Input 
                        id="paypalClientId" 
                        value={paymentSettings.paypalClientId} 
                        onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="testMode" 
                      checked={paymentSettings.testMode}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, testMode: checked})}
                    />
                    <Label htmlFor="testMode">Activer le mode test (sandbox)</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                      <Input 
                        id="commissionRate" 
                        type="number"
                        min="0"
                        max="100"
                        value={paymentSettings.commissionRate} 
                        onChange={(e) => setPaymentSettings({...paymentSettings, commissionRate: Number(e.target.value)})}
                      />
                      <p className="text-xs text-gray-500">Commission prélevée sur chaque réservation</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minWithdrawalAmount">Montant min. de retrait</Label>
                      <Input 
                        id="minWithdrawalAmount" 
                        type="number"
                        min="0"
                        value={paymentSettings.minWithdrawalAmount} 
                        onChange={(e) => setPaymentSettings({...paymentSettings, minWithdrawalAmount: Number(e.target.value)})}
                      />
                      <p className="text-xs text-gray-500">Montant minimum pour les retraits des hôtes</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePaymentSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Paramètres des réseaux sociaux */}
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                  <CardDescription>
                    Configurez les liens vers vos réseaux sociaux et options de partage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="facebookUrl">Facebook</Label>
                      <Input 
                        id="facebookUrl" 
                        value={socialSettings.facebookUrl} 
                        onChange={(e) => setSOcialSettings({...socialSettings, facebookUrl: e.target.value})}
                        placeholder="https://facebook.com/votrepage"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">Twitter / X</Label>
                      <Input 
                        id="twitterUrl" 
                        value={socialSettings.twitterUrl} 
                        onChange={(e) => setSOcialSettings({...socialSettings, twitterUrl: e.target.value})}
                        placeholder="https://twitter.com/votrecompte"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagramUrl">Instagram</Label>
                      <Input 
                        id="instagramUrl" 
                        value={socialSettings.instagramUrl} 
                        onChange={(e) => setSOcialSettings({...socialSettings, instagramUrl: e.target.value})}
                        placeholder="https://instagram.com/votrecompte"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn</Label>
                      <Input 
                        id="linkedinUrl" 
                        value={socialSettings.linkedinUrl} 
                        onChange={(e) => setSOcialSettings({...socialSettings, linkedinUrl: e.target.value})}
                        placeholder="https://linkedin.com/company/votreentreprise"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="youtubeUrl">YouTube</Label>
                      <Input 
                        id="youtubeUrl" 
                        value={socialSettings.youtubeUrl} 
                        onChange={(e) => setSOcialSettings({...socialSettings, youtubeUrl: e.target.value})}
                        placeholder="https://youtube.com/c/votrechaine"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableSocialLogin" 
                        checked={socialSettings.enableSocialLogin}
                        onCheckedChange={(checked) => setSOcialSettings({...socialSettings, enableSocialLogin: checked})}
                      />
                      <Label htmlFor="enableSocialLogin">Activer la connexion via réseaux sociaux</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableSocialSharing" 
                        checked={socialSettings.enableSocialSharing}
                        onCheckedChange={(checked) => setSOcialSettings({...socialSettings, enableSocialSharing: checked})}
                      />
                      <Label htmlFor="enableSocialSharing">Activer les boutons de partage social</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSocialSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
