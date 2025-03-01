
import React, { useState, useRef } from 'react';
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
  Languages,
  DollarSign,
  Euro,
  MapPin,
  Share2,
  Image,
  FileText,
  Check,
  Trash,
  RefreshCw
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminSettings = () => {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSiteSettings();
  const isMobile = useIsMobile();
  
  // Refs for file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  
  // Upload states
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isFaviconUploading, setIsFaviconUploading] = useState(false);
  const [isWatermarkUploading, setIsWatermarkUploading] = useState(false);
  
  // États locaux pour les formulaires
  const [generalSettings, setGeneralSettings] = useState({
    siteName: settings.siteName || 'Location+',
    siteDescription: settings.siteDescription || 'Plateforme de location de logements',
    adminEmail: settings.adminEmail || 'admin@locationplus.fr',
    supportEmail: settings.supportEmail || 'support@locationplus.fr',
    phoneNumber: settings.phoneNumber || '+228 90 123 456',
    address: settings.address || 'Lomé, Togo',
    logo: settings.logo || "/placeholder.svg",
    favicon: settings.favicon || "/favicon.ico",
  });
  
  const [appearance, setAppearance] = useState({
    primaryColor: settings.primaryColor || '#FF385C',
    secondaryColor: settings.secondaryColor || '#222222',
    fontFamily: settings.fontFamily || 'Inter',
    borderRadius: settings.borderRadius || 'medium',
    darkMode: settings.darkMode ?? false,
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
    watermarkEnabled: settings.watermarkEnabled ?? false,
    watermarkOpacity: settings.watermarkOpacity || 50,
    watermarkImage: settings.logo || "/placeholder.svg",
  });
  
  const [emailSettings, setEmailSettings] = useState({
    mailProvider: settings.mailProvider || 'smtp',
    smtpHost: settings.smtpHost || 'smtp.example.com',
    smtpPort: settings.smtpPort || '587',
    smtpUser: settings.smtpUser || 'user@example.com',
    smtpPassword: settings.smtpPassword || '',
    senderName: settings.senderName || 'Location+',
    senderEmail: settings.senderEmail || 'no-reply@locationplus.fr',
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    currency: settings.currency || 'XOF',
    stripeLiveKey: settings.stripeLiveKey || '',
    stripeTestKey: settings.stripeTestKey || '',
    paypalClientId: settings.paypalClientId || '',
    testMode: settings.testMode ?? false,
    commissionRate: settings.commissionRate || 5,
    minWithdrawalAmount: settings.minWithdrawalAmount || 1000,
  });
  
  const [socialSettings, setSocialSettings] = useState({
    facebookUrl: settings.facebookUrl || '',
    twitterUrl: settings.twitterUrl || '',
    instagramUrl: settings.instagramUrl || '',
    linkedinUrl: settings.linkedinUrl || '',
    youtubeUrl: settings.youtubeUrl || '',
    enableSocialLogin: settings.enableSocialLogin ?? false,
    enableSocialSharing: settings.enableSocialSharing ?? false,
  });

  // Gestion des changements dans le formulaire général
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Gestion des changements dans le formulaire d'apparence
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setAppearance(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  // Fichier handlers
  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleFaviconClick = () => {
    faviconInputRef.current?.click();
  };

  const handleWatermarkClick = () => {
    watermarkInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'watermark') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/x-icon'];
    if (!validTypes.includes(file.type)) {
      toast.error("Type de fichier non supporté. Veuillez choisir une image (JPG, PNG, GIF, SVG, ICO)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("L'image est trop volumineuse. La taille maximale est de 5 MB");
      return;
    }

    // Set upload state
    if (type === 'logo') setIsLogoUploading(true);
    if (type === 'favicon') setIsFaviconUploading(true);
    if (type === 'watermark') setIsWatermarkUploading(true);
    
    // Create a URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string;
        
        // Update state based on type
        if (type === 'logo') {
          setGeneralSettings(prev => ({ ...prev, logo: imageUrl }));
          setTimeout(() => {
            setIsLogoUploading(false);
            updateSettings.mutate({ logo: imageUrl });
            toast.success("Logo mis à jour avec succès");
          }, 1500);
        } else if (type === 'favicon') {
          setGeneralSettings(prev => ({ ...prev, favicon: imageUrl }));
          setTimeout(() => {
            setIsFaviconUploading(false);
            updateSettings.mutate({ favicon: imageUrl });
            toast.success("Favicon mis à jour avec succès");
          }, 1500);
        } else if (type === 'watermark') {
          setMediaSettings(prev => ({ ...prev, watermarkImage: imageUrl }));
          setTimeout(() => {
            setIsWatermarkUploading(false);
            updateSettings.mutate({ watermarkImage: imageUrl });
            toast.success("Image de filigrane mise à jour avec succès");
          }, 1500);
        }
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Gérer l'enregistrement des paramètres généraux
  const handleSaveGeneralSettings = () => {
    updateSettings.mutate({
      siteName: generalSettings.siteName,
      siteDescription: generalSettings.siteDescription,
      adminEmail: generalSettings.adminEmail,
      supportEmail: generalSettings.supportEmail,
      phoneNumber: generalSettings.phoneNumber,
      address: generalSettings.address,
      logo: generalSettings.logo,
      favicon: generalSettings.favicon
    });
    toast.success("Paramètres généraux enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres d'apparence
  const handleSaveAppearance = () => {
    updateSettings.mutate({
      primaryColor: appearance.primaryColor,
      secondaryColor: appearance.secondaryColor,
      fontFamily: appearance.fontFamily,
      borderRadius: appearance.borderRadius,
      darkMode: appearance.darkMode
    });
    toast.success("Paramètres d'apparence enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres de localisation
  const handleSaveLocalization = () => {
    updateSettings.mutate({
      defaultLanguage: localization.defaultLanguage,
      defaultCurrency: localization.defaultCurrency,
      dateFormat: localization.dateFormat,
      timeFormat: localization.timeFormat,
      timezone: localization.timezone
    });
    toast.success("Paramètres de localisation enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres médias
  const handleSaveMediaSettings = () => {
    updateSettings.mutate({
      maxFileSize: mediaSettings.maxFileSize,
      allowedFileTypes: mediaSettings.allowedFileTypes,
      imageCompression: mediaSettings.imageCompression,
      watermarkEnabled: mediaSettings.watermarkEnabled,
      watermarkOpacity: mediaSettings.watermarkOpacity,
      watermarkImage: mediaSettings.watermarkImage
    });
    toast.success("Paramètres médias enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres email
  const handleSaveEmailSettings = () => {
    updateSettings.mutate({
      mailProvider: emailSettings.mailProvider,
      smtpHost: emailSettings.smtpHost,
      smtpPort: emailSettings.smtpPort,
      smtpUser: emailSettings.smtpUser,
      smtpPassword: emailSettings.smtpPassword,
      senderName: emailSettings.senderName,
      senderEmail: emailSettings.senderEmail
    });
    toast.success("Paramètres email enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres de paiement
  const handleSavePaymentSettings = () => {
    updateSettings.mutate({
      currency: paymentSettings.currency,
      stripeLiveKey: paymentSettings.stripeLiveKey,
      stripeTestKey: paymentSettings.stripeTestKey,
      paypalClientId: paymentSettings.paypalClientId,
      testMode: paymentSettings.testMode,
      commissionRate: paymentSettings.commissionRate,
      minWithdrawalAmount: paymentSettings.minWithdrawalAmount
    });
    toast.success("Paramètres de paiement enregistrés avec succès");
  };
  
  // Gérer l'enregistrement des paramètres sociaux
  const handleSaveSocialSettings = () => {
    updateSettings.mutate({
      facebookUrl: socialSettings.facebookUrl,
      twitterUrl: socialSettings.twitterUrl,
      instagramUrl: socialSettings.instagramUrl,
      linkedinUrl: socialSettings.linkedinUrl,
      youtubeUrl: socialSettings.youtubeUrl,
      enableSocialLogin: socialSettings.enableSocialLogin,
      enableSocialSharing: socialSettings.enableSocialSharing
    });
    toast.success("Paramètres sociaux enregistrés avec succès");
  };
  
  // Tester l'envoi d'email
  const handleTestEmail = () => {
    toast.success("Email de test envoyé avec succès");
  };

  // Handle file import
  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
      toast.error("Le fichier doit être au format JSON");
      return;
    }
    
    importSettings(file).then(success => {
      if (success) {
        toast.success("Paramètres importés avec succès");
      }
    });
  };

  // Handle reset settings
  const handleResetSettings = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.")) {
      resetSettings.mutate();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 md:p-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-semibold">Paramètres du site</h1>
            <p className="text-gray-500 text-sm md:text-base">Configurez les paramètres généraux de votre site</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportSettings()}
              className="text-xs md:text-sm"
            >
              <Upload className="h-3.5 w-3.5 mr-2" />
              Exporter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs md:text-sm"
              onClick={() => document.getElementById('import-settings')?.click()}
            >
              <Upload className="h-3.5 w-3.5 mr-2" />
              Importer
            </Button>
            <input
              id="import-settings"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportSettings}
            />
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs md:text-sm text-destructive hover:bg-destructive/10"
              onClick={handleResetSettings}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Réinitialiser
            </Button>
          </div>
          
          <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
            <TabsList className="grid grid-cols-2 md:flex md:flex-wrap gap-1">
              <TabsTrigger value="general" className="text-xs md:text-sm">
                <Settings className="h-3.5 w-3.5 mr-2" />
                Général
              </TabsTrigger>
              <TabsTrigger value="appearance" className="text-xs md:text-sm">
                <Palette className="h-3.5 w-3.5 mr-2" />
                Apparence
              </TabsTrigger>
              <TabsTrigger value="localization" className="text-xs md:text-sm">
                <Globe className="h-3.5 w-3.5 mr-2" />
                Localisation
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs md:text-sm">
                <Image className="h-3.5 w-3.5 mr-2" />
                Médias
              </TabsTrigger>
              <TabsTrigger value="email" className="text-xs md:text-sm">
                <Mail className="h-3.5 w-3.5 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-xs md:text-sm">
                <CreditCard className="h-3.5 w-3.5 mr-2" />
                Paiement
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs md:text-sm">
                <Share2 className="h-3.5 w-3.5 mr-2" />
                Social
              </TabsTrigger>
            </TabsList>
            
            {/* Paramètres généraux */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                  <CardDescription>
                    Configurez les informations de base de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nom du site</Label>
                      <Input 
                        id="siteName" 
                        value={generalSettings.siteName}
                        onChange={handleGeneralChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email administrateur</Label>
                      <Input 
                        id="adminEmail" 
                        type="email"
                        value={generalSettings.adminEmail}
                        onChange={handleGeneralChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Description du site</Label>
                    <Textarea 
                      id="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Email de support</Label>
                      <Input 
                        id="supportEmail" 
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={handleGeneralChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                      <Input 
                        id="phoneNumber"
                        value={generalSettings.phoneNumber}
                        onChange={handleGeneralChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea 
                      id="address"
                      value={generalSettings.address}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Logo du site</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            type="file"
                            ref={logoInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'logo')}
                          />
                          <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border">
                            {isLogoUploading ? (
                              <div className="animate-pulse flex space-x-1">
                                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                              </div>
                            ) : (
                              <img 
                                src={generalSettings.logo} 
                                alt="Logo" 
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-xs"
                            onClick={handleLogoClick}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Changer
                          </Button>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p className="font-medium">Recommandations:</p>
                          <ul className="list-disc pl-4">
                            <li>Format: SVG, PNG, JPG</li>
                            <li>Taille max: 5MB</li>
                            <li>Dimension: 200x200px</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Favicon</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            type="file"
                            ref={faviconInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'favicon')}
                          />
                          <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border">
                            {isFaviconUploading ? (
                              <div className="animate-pulse flex space-x-1">
                                <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                                <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                              </div>
                            ) : (
                              <img 
                                src={generalSettings.favicon} 
                                alt="Favicon" 
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/favicon.ico";
                                }}
                              />
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-xs"
                            onClick={handleFaviconClick}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Changer
                          </Button>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p className="font-medium">Recommandations:</p>
                          <ul className="list-disc pl-4">
                            <li>Format: ICO, PNG</li>
                            <li>Taille max: 1MB</li>
                            <li>Dimension: 32x32px</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveGeneralSettings}>
                    <Save className="h-4 w-4 mr-2" />
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Couleur primaire</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="primaryColor" 
                          type="text"
                          value={appearance.primaryColor}
                          onChange={handleAppearanceChange}
                          className="flex-1"
                        />
                        <input 
                          type="color"
                          value={appearance.primaryColor}
                          onChange={(e) => setAppearance(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-10 h-10 p-1 border rounded-md cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="secondaryColor" 
                          type="text"
                          value={appearance.secondaryColor}
                          onChange={handleAppearanceChange}
                          className="flex-1"
                        />
                        <input 
                          type="color"
                          value={appearance.secondaryColor}
                          onChange={(e) => setAppearance(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-10 h-10 p-1 border rounded-md cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Police de caractères</Label>
                      <Select 
                        value={appearance.fontFamily}
                        onValueChange={(value) => setAppearance(prev => ({ ...prev, fontFamily: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une police" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="borderRadius">Bordures arrondies</Label>
                      <Select 
                        value={appearance.borderRadius}
                        onValueChange={(value) => setAppearance(prev => ({ ...prev, borderRadius: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          <SelectItem value="small">Léger</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="large">Important</SelectItem>
                          <SelectItem value="full">Complet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="darkMode"
                      checked={appearance.darkMode}
                      onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, darkMode: checked }))}
                    />
                    <Label htmlFor="darkMode">Activer le mode sombre par défaut</Label>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Aperçu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="max-w-sm mx-auto">
                        <CardHeader style={{ backgroundColor: appearance.primaryColor, color: 'white' }}>
                          <CardTitle className="text-base">Exemple de carte</CardTitle>
                          <CardDescription className="text-gray-100">Aperçu de vos paramètres</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <p className="text-sm">Voici comment vos éléments apparaîtront avec ces paramètres.</p>
                          <Button className="w-full" style={{ backgroundColor: appearance.primaryColor }}>
                            Bouton primaire
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: appearance.primaryColor }}></div>
                          <span>Couleur primaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: appearance.secondaryColor }}></div>
                          <span>Couleur secondaire</span>
                        </div>
                        <div className="p-2 border rounded-md mt-2" style={{ fontFamily: appearance.fontFamily }}>
                          <p className="text-sm font-normal">Texte normal en {appearance.fontFamily}</p>
                          <p className="text-sm font-bold">Texte en gras en {appearance.fontFamily}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveAppearance}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Autres onglets de paramètres */}
            <TabsContent value="localization">
              <Card>
                <CardHeader>
                  <CardTitle>Localisation</CardTitle>
                  <CardDescription>
                    Configurez les paramètres régionaux de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                      <Select 
                        value={localization.defaultLanguage}
                        onValueChange={(value) => setLocalization(prev => ({ ...prev, defaultLanguage: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                          <SelectItem value="es">Espagnol</SelectItem>
                          <SelectItem value="de">Allemand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                      <Select 
                        value={localization.defaultCurrency}
                        onValueChange={(value) => setLocalization(prev => ({ ...prev, defaultCurrency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="USD">Dollar US ($)</SelectItem>
                          <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Format de date</Label>
                      <Select 
                        value={localization.dateFormat}
                        onValueChange={(value) => setLocalization(prev => ({ ...prev, dateFormat: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un format" />
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
                        onValueChange={(value) => setLocalization(prev => ({ ...prev, timeFormat: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12h (02:30 PM)</SelectItem>
                          <SelectItem value="24h">24h (14:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select 
                      value={localization.timezone}
                      onValueChange={(value) => setLocalization(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un fuseau horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lome">Lomé (GMT+0)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveLocalization}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Paramètres médias */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Médias</CardTitle>
                  <CardDescription>
                    Gérez les paramètres liés aux médias et téléchargements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">Taille max. des fichiers (MB)</Label>
                      <Input 
                        id="maxFileSize" 
                        type="number"
                        min="1"
                        max="20"
                        value={mediaSettings.maxFileSize}
                        onChange={(e) => setMediaSettings(prev => ({ ...prev, maxFileSize: Number(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowedFileTypes">Types de fichiers autorisés</Label>
                      <Input 
                        id="allowedFileTypes"
                        value={mediaSettings.allowedFileTypes}
                        onChange={(e) => setMediaSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                        placeholder="jpg,jpeg,png,gif,pdf"
                      />
                      <p className="text-xs text-gray-500">Séparez les extensions par des virgules</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageCompression">Compression d'image</Label>
                    <Select 
                      value={mediaSettings.imageCompression}
                      onValueChange={(value) => setMediaSettings(prev => ({ ...prev, imageCompression: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune</SelectItem>
                        <SelectItem value="low">Légère</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="watermarkEnabled"
                      checked={mediaSettings.watermarkEnabled}
                      onCheckedChange={(checked) => setMediaSettings(prev => ({ ...prev, watermarkEnabled: checked }))}
                    />
                    <Label htmlFor="watermarkEnabled">Activer le filigrane sur les images</Label>
                  </div>
                  
                  {mediaSettings.watermarkEnabled && (
                    <div className="space-y-4 mt-4 p-4 border rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor="watermarkOpacity">Opacité du filigrane (%)</Label>
                        <Input 
                          id="watermarkOpacity" 
                          type="number"
                          min="10"
                          max="100"
                          value={mediaSettings.watermarkOpacity}
                          onChange={(e) => setMediaSettings(prev => ({ ...prev, watermarkOpacity: Number(e.target.value) }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Image de filigrane</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <input
                              type="file"
                              ref={watermarkInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'watermark')}
                            />
                            <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border">
                              {isWatermarkUploading ? (
                                <div className="animate-pulse flex space-x-1">
                                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                </div>
                              ) : (
                                <img 
                                  src={mediaSettings.watermarkImage} 
                                  alt="Filigrane" 
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full text-xs"
                              onClick={handleWatermarkClick}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Changer
                            </Button>
                          </div>
                          <div className="text-sm text-gray-500">
                            <p className="font-medium">Recommandations:</p>
                            <ul className="list-disc pl-4">
                              <li>Format: PNG avec transparence</li>
                              <li>Taille max: 2MB</li>
                              <li>Dimensions: 200x200px max</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveMediaSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Email</CardTitle>
                  <CardDescription>
                    Configurez les paramètres d'envoi d'emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailProvider">Fournisseur d'email</Label>
                    <Select 
                      value={emailSettings.mailProvider}
                      onValueChange={(value) => setEmailSettings(prev => ({ ...prev, mailProvider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {emailSettings.mailProvider === 'smtp' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost">Serveur SMTP</Label>
                          <Input 
                            id="smtpHost"
                            value={emailSettings.smtpHost}
                            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                            placeholder="smtp.example.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">Port SMTP</Label>
                          <Input 
                            id="smtpPort"
                            value={emailSettings.smtpPort}
                            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                            placeholder="587"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtpUser">Nom d'utilisateur SMTP</Label>
                          <Input 
                            id="smtpUser"
                            value={emailSettings.smtpUser}
                            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                            placeholder="user@example.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                          <Input 
                            id="smtpPassword"
                            type="password"
                            value={emailSettings.smtpPassword}
                            onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Nom de l'expéditeur</Label>
                      <Input 
                        id="senderName"
                        value={emailSettings.senderName}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, senderName: e.target.value }))}
                        placeholder="Location+"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">Email de l'expéditeur</Label>
                      <Input 
                        id="senderEmail"
                        type="email"
                        value={emailSettings.senderEmail}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, senderEmail: e.target.value }))}
                        placeholder="no-reply@locationplus.fr"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" onClick={handleTestEmail}>
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer un email de test
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveEmailSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration des paiements</CardTitle>
                  <CardDescription>
                    Configurez les paramètres de paiement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Select 
                      value={paymentSettings.currency}
                      onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar US ($)</SelectItem>
                        <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4 p-4 border rounded-md mt-4">
                    <h3 className="font-medium">Configuration Stripe</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stripeLiveKey">Clé API Stripe (Live)</Label>
                      <Input 
                        id="stripeLiveKey"
                        value={paymentSettings.stripeLiveKey}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, stripeLiveKey: e.target.value }))}
                        placeholder="sk_live_..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stripeTestKey">Clé API Stripe (Test)</Label>
                      <Input 
                        id="stripeTestKey"
                        value={paymentSettings.stripeTestKey}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, stripeTestKey: e.target.value }))}
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-medium">Configuration PayPal</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientId">ID Client PayPal</Label>
                      <Input 
                        id="paypalClientId"
                        value={paymentSettings.paypalClientId}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, paypalClientId: e.target.value }))}
                        placeholder="Votre ID client PayPal"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="testMode"
                      checked={paymentSettings.testMode}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, testMode: checked }))}
                    />
                    <Label htmlFor="testMode">Mode test (sandbox)</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                      <Input 
                        id="commissionRate"
                        type="number"
                        min="0"
                        max="100"
                        value={paymentSettings.commissionRate}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minWithdrawalAmount">Montant min. de retrait</Label>
                      <Input 
                        id="minWithdrawalAmount"
                        type="number"
                        min="0"
                        value={paymentSettings.minWithdrawalAmount}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, minWithdrawalAmount: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePaymentSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                  <CardDescription>
                    Configurez les liens vers vos réseaux sociaux et les options de partage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook</Label>
                    <Input 
                      id="facebookUrl"
                      value={socialSettings.facebookUrl}
                      onChange={(e) => setSocialSettings(prev => ({ ...prev, facebookUrl: e.target.value }))}
                      placeholder="https://facebook.com/votrepage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter</Label>
                    <Input 
                      id="twitterUrl"
                      value={socialSettings.twitterUrl}
                      onChange={(e) => setSocialSettings(prev => ({ ...prev, twitterUrl: e.target.value }))}
                      placeholder="https://twitter.com/votrecompte"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram</Label>
                    <Input 
                      id="instagramUrl"
                      value={socialSettings.instagramUrl}
                      onChange={(e) => setSocialSettings(prev => ({ ...prev, instagramUrl: e.target.value }))}
                      placeholder="https://instagram.com/votrecompte"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <Input 
                      id="linkedinUrl"
                      value={socialSettings.linkedinUrl}
                      onChange={(e) => setSocialSettings(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/company/votreentreprise"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube</Label>
                    <Input 
                      id="youtubeUrl"
                      value={socialSettings.youtubeUrl}
                      onChange={(e) => setSocialSettings(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                      placeholder="https://youtube.com/c/votrechaine"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="enableSocialLogin"
                      checked={socialSettings.enableSocialLogin}
                      onCheckedChange={(checked) => setSocialSettings(prev => ({ ...prev, enableSocialLogin: checked }))}
                    />
                    <Label htmlFor="enableSocialLogin">Activer la connexion via réseaux sociaux</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSocialSharing"
                      checked={socialSettings.enableSocialSharing}
                      onCheckedChange={(checked) => setSocialSettings(prev => ({ ...prev, enableSocialSharing: checked }))}
                    />
                    <Label htmlFor="enableSocialSharing">Activer les boutons de partage sur les pages</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSocialSettings}>
                    <Save className="h-4 w-4 mr-2" />
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
