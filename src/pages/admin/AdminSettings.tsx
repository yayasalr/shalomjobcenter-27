
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

// The rest of the code for the AdminSettings component goes here
// This is a placeholder that will be replaced with the actual content of the file

export const AdminSettings = () => {
  const { 
    settings, 
    updateSettings, 
    resetSettings, 
    exportSettings, 
    importSettings 
  } = useSiteSettings();
  const [selectedTab, setSelectedTab] = useState("general");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkFileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  // Handle logo file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoDataUrl = event.target?.result as string;
        updateSettings.mutate({ logo: logoDataUrl });
        toast.success("Logo mis à jour avec succès");
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle watermark image upload
  const handleWatermarkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const watermarkDataUrl = event.target?.result as string;
        updateSettings.mutate({ watermarkImage: watermarkDataUrl });
        toast.success("Image de filigrane mise à jour avec succès");
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle settings import
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importSettings(file);
      if (success) {
        toast.success("Paramètres importés avec succès");
      }
    }
  };
  
  // Handle general settings save
  const handleSaveGeneralSettings = () => {
    const siteName = (document.getElementById("siteName") as HTMLInputElement).value;
    const siteDescription = (document.getElementById("siteDescription") as HTMLTextAreaElement).value;
    const primaryColor = (document.getElementById("primaryColor") as HTMLInputElement).value;
    const secondaryColor = (document.getElementById("secondaryColor") as HTMLInputElement).value;
    const fontFamily = (document.getElementById("fontFamily") as HTMLSelectElement).value;
    const borderRadius = (document.getElementById("borderRadius") as HTMLSelectElement).value;
    const language = (document.getElementById("language") as HTMLSelectElement).value as 'fr' | 'en';
    
    updateSettings.mutate({
      siteName,
      siteDescription,
      primaryColor,
      secondaryColor,
      fontFamily,
      borderRadius,
      language,
    });
  };
  
  // Handle contact settings save
  const handleSaveContactSettings = () => {
    const adminEmail = (document.getElementById("adminEmail") as HTMLInputElement).value;
    const supportEmail = (document.getElementById("supportEmail") as HTMLInputElement).value;
    const phoneNumber = (document.getElementById("phoneNumber") as HTMLInputElement).value;
    const address = (document.getElementById("address") as HTMLInputElement).value;
    
    updateSettings.mutate({
      adminEmail,
      supportEmail,
      phoneNumber,
      address,
    });
  };
  
  // Handle media settings save
  const handleSaveMediaSettings = () => {
    const maxFileSize = Number((document.getElementById("maxFileSize") as HTMLInputElement).value);
    const allowedFileTypes = (document.getElementById("allowedFileTypes") as HTMLInputElement).value;
    const imageCompression = (document.getElementById("imageCompression") as HTMLSelectElement).value;
    const watermarkEnabled = (document.getElementById("watermarkEnabled") as HTMLInputElement).checked;
    const watermarkOpacity = Number((document.getElementById("watermarkOpacity") as HTMLInputElement).value);
    
    updateSettings.mutate({
      maxFileSize,
      allowedFileTypes,
      imageCompression,
      watermarkEnabled,
      watermarkOpacity,
      watermarkImage: settings.watermarkImage // Keep the existing watermark image
    });
  };
  
  // Handle payment settings save
  const handleSavePaymentSettings = () => {
    const currency = (document.getElementById("currency") as HTMLSelectElement).value;
    const stripeLiveKey = (document.getElementById("stripeLiveKey") as HTMLInputElement).value;
    const stripeTestKey = (document.getElementById("stripeTestKey") as HTMLInputElement).value;
    const paypalClientId = (document.getElementById("paypalClientId") as HTMLInputElement).value;
    const testMode = (document.getElementById("testMode") as HTMLInputElement).checked;
    const commissionRate = Number((document.getElementById("commissionRate") as HTMLInputElement).value);
    const minWithdrawalAmount = Number((document.getElementById("minWithdrawalAmount") as HTMLInputElement).value);
    
    updateSettings.mutate({
      currency,
      stripeLiveKey,
      stripeTestKey,
      paypalClientId,
      testMode,
      commissionRate,
      minWithdrawalAmount,
    });
  };
  
  // Handle email settings save
  const handleSaveEmailSettings = () => {
    const mailProvider = (document.getElementById("mailProvider") as HTMLSelectElement).value;
    const smtpHost = (document.getElementById("smtpHost") as HTMLInputElement).value;
    const smtpPort = (document.getElementById("smtpPort") as HTMLInputElement).value;
    const smtpUser = (document.getElementById("smtpUser") as HTMLInputElement).value;
    const smtpPassword = (document.getElementById("smtpPassword") as HTMLInputElement).value;
    const senderName = (document.getElementById("senderName") as HTMLInputElement).value;
    const senderEmail = (document.getElementById("senderEmail") as HTMLInputElement).value;
    
    updateSettings.mutate({
      mailProvider,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      senderName,
      senderEmail,
    });
  };
  
  // Handle social settings save
  const handleSaveSocialSettings = () => {
    const facebookUrl = (document.getElementById("facebookUrl") as HTMLInputElement).value;
    const twitterUrl = (document.getElementById("twitterUrl") as HTMLInputElement).value;
    const instagramUrl = (document.getElementById("instagramUrl") as HTMLInputElement).value;
    const linkedinUrl = (document.getElementById("linkedinUrl") as HTMLInputElement).value;
    const youtubeUrl = (document.getElementById("youtubeUrl") as HTMLInputElement).value;
    const enableSocialLogin = (document.getElementById("enableSocialLogin") as HTMLInputElement).checked;
    const enableSocialSharing = (document.getElementById("enableSocialSharing") as HTMLInputElement).checked;
    
    updateSettings.mutate({
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      enableSocialLogin,
      enableSocialSharing,
    });
  };
  
  // Handle footer settings save
  const handleSaveFooterSettings = () => {
    const contactFooter = (document.getElementById("contactFooter") as HTMLTextAreaElement).value;
    const aboutFooter = (document.getElementById("aboutFooter") as HTMLTextAreaElement).value;
    const termsFooter = (document.getElementById("termsFooter") as HTMLTextAreaElement).value;
    const policyFooter = (document.getElementById("policyFooter") as HTMLTextAreaElement).value;
    
    updateSettings.mutate({
      footer: {
        contact: contactFooter,
        about: aboutFooter,
        terms: termsFooter,
        policy: policyFooter,
      }
    });
  };
  
  // Handle company info settings save
  const handleSaveCompanySettings = () => {
    const companyAddress = (document.getElementById("companyAddress") as HTMLInputElement).value;
    const companyPhone = (document.getElementById("companyPhone") as HTMLInputElement).value;
    const companyEmail = (document.getElementById("companyEmail") as HTMLInputElement).value;
    const companyRegistration = (document.getElementById("companyRegistration") as HTMLInputElement).value;
    
    updateSettings.mutate({
      companyInfo: {
        address: companyAddress,
        phone: companyPhone,
        email: companyEmail,
        registrationNumber: companyRegistration,
      }
    });
  };
  
  // Handle reservation settings save
  const handleSaveReservationSettings = () => {
    const minStay = Number((document.getElementById("minStay") as HTMLInputElement).value);
    const maxStay = Number((document.getElementById("maxStay") as HTMLInputElement).value);
    const advanceBookingDays = Number((document.getElementById("advanceBookingDays") as HTMLInputElement).value);
    const instantBooking = (document.getElementById("instantBooking") as HTMLInputElement).checked;
    
    updateSettings.mutate({
      reservationSettings: {
        minStay,
        maxStay,
        advanceBookingDays,
        instantBooking,
      }
    });
  };
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
              <p className="text-muted-foreground">
                Gérez les paramètres de votre site Location+
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={() => resetSettings.mutate()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button 
                variant="outline" 
                onClick={() => exportSettings()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Exporter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => importFileInputRef.current?.click()}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Importer
              </Button>
              <input 
                ref={importFileInputRef}
                type="file" 
                accept=".json" 
                onChange={handleImportFile}
                className="hidden" 
              />
            </div>
          </div>
          
          <Tabs 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Général</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Contact</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Média</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Paiement</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Email</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Réseaux</span>
              </TabsTrigger>
              <TabsTrigger value="footer" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Pied de page</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className={isMobile ? "sr-only" : ""}>Entreprise</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Général */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                  <CardDescription>
                    Configurez les paramètres généraux de votre site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Nom du site</Label>
                        <Input 
                          id="siteName" 
                          defaultValue={settings.siteName} 
                          placeholder="Location+" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="siteDescription">Description</Label>
                        <Textarea 
                          id="siteDescription" 
                          defaultValue={settings.siteDescription} 
                          placeholder="Une description brève de votre site" 
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Couleur principale</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="primaryColor" 
                              type="color" 
                              defaultValue={settings.primaryColor} 
                              className="w-12 h-10 p-1"
                            />
                            <Input 
                              value={settings.primaryColor} 
                              readOnly 
                              className="flex-1"
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="secondaryColor" 
                              type="color" 
                              defaultValue={settings.secondaryColor} 
                              className="w-12 h-10 p-1"
                            />
                            <Input 
                              value={settings.secondaryColor} 
                              readOnly 
                              className="flex-1"
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Police de caractère</Label>
                          <Select defaultValue={settings.fontFamily}>
                            <SelectTrigger id="fontFamily">
                              <SelectValue placeholder="Sélectionner une police" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Open Sans">Open Sans</SelectItem>
                              <SelectItem value="Montserrat">Montserrat</SelectItem>
                              <SelectItem value="Poppins">Poppins</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="borderRadius">Rayon de bordure</Label>
                          <Select defaultValue={settings.borderRadius}>
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Langue par défaut</Label>
                        <Select defaultValue={settings.language}>
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">Anglais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-64 flex flex-col gap-4">
                      <div className="space-y-2">
                        <Label>Logo</Label>
                        <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/50">
                          <Avatar className="w-40 h-40 mb-4">
                            <AvatarImage src={settings.logo} alt="Logo" />
                            <AvatarFallback>LP</AvatarFallback>
                          </Avatar>
                          <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full"
                          >
                            Changer le logo
                          </Button>
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="hidden" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveGeneralSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Contact */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                  <CardDescription>
                    Configurez les informations de contact de votre site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email d'administration</Label>
                      <Input 
                        id="adminEmail" 
                        defaultValue={settings.adminEmail} 
                        placeholder="admin@example.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Email de support</Label>
                      <Input 
                        id="supportEmail" 
                        defaultValue={settings.supportEmail} 
                        placeholder="support@example.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                      <Input 
                        id="phoneNumber" 
                        defaultValue={settings.phoneNumber} 
                        placeholder="+228 12 34 56 78" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input 
                        id="address" 
                        defaultValue={settings.address} 
                        placeholder="123 Rue Principale, Ville, Pays" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveContactSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Média */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres des médias</CardTitle>
                  <CardDescription>
                    Configurez les paramètres des fichiers et images.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxFileSize">Taille maximale de fichier (MB)</Label>
                        <Input 
                          id="maxFileSize" 
                          type="number" 
                          defaultValue={settings.maxFileSize} 
                          min="1" 
                          max="50" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="allowedFileTypes">Types de fichiers autorisés</Label>
                        <Input 
                          id="allowedFileTypes" 
                          defaultValue={settings.allowedFileTypes} 
                          placeholder="jpg,jpeg,png,gif,pdf" 
                        />
                        <p className="text-sm text-muted-foreground">
                          Séparez les extensions par des virgules
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="imageCompression">Compression d'image</Label>
                        <Select defaultValue={settings.imageCompression}>
                          <SelectTrigger id="imageCompression">
                            <SelectValue placeholder="Sélectionner un niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucune</SelectItem>
                            <SelectItem value="low">Faible</SelectItem>
                            <SelectItem value="medium">Moyenne</SelectItem>
                            <SelectItem value="high">Élevée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="watermarkEnabled" 
                          defaultChecked={settings.watermarkEnabled} 
                        />
                        <Label htmlFor="watermarkEnabled">Activer le filigrane</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="watermarkOpacity">Opacité du filigrane (%)</Label>
                        <Input 
                          id="watermarkOpacity" 
                          type="number" 
                          defaultValue={settings.watermarkOpacity} 
                          min="1" 
                          max="100" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Image de filigrane</Label>
                        <div className="border rounded-lg p-4 bg-muted/50 flex flex-col items-center">
                          {settings.watermarkImage && (
                            <img 
                              src={settings.watermarkImage} 
                              alt="Filigrane" 
                              className="h-24 mb-4 object-contain" 
                            />
                          )}
                          <Button 
                            variant="outline" 
                            onClick={() => watermarkFileInputRef.current?.click()}
                            className="w-full"
                          >
                            Choisir une image
                          </Button>
                          <input 
                            ref={watermarkFileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleWatermarkFileChange}
                            className="hidden" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveMediaSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Payment */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de paiement</CardTitle>
                  <CardDescription>
                    Configurez les paramètres de paiement et de transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise par défaut</Label>
                      <Select defaultValue={settings.currency}>
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XOF">
                            <div className="flex items-center gap-2">
                              <span>Franc CFA (XOF)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="EUR">
                            <div className="flex items-center gap-2">
                              <Euro className="h-4 w-4" />
                              <span>Euro (EUR)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="USD">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>Dollar US (USD)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stripeLiveKey">Clé publique Stripe (Live)</Label>
                      <Input 
                        id="stripeLiveKey" 
                        defaultValue={settings.stripeLiveKey} 
                        placeholder="pk_live_..." 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stripeTestKey">Clé publique Stripe (Test)</Label>
                      <Input 
                        id="stripeTestKey" 
                        defaultValue={settings.stripeTestKey} 
                        placeholder="pk_test_..." 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientId">ID Client PayPal</Label>
                      <Input 
                        id="paypalClientId" 
                        defaultValue={settings.paypalClientId} 
                        placeholder="Client ID..." 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="testMode" 
                        defaultChecked={settings.testMode} 
                      />
                      <Label htmlFor="testMode">Mode Test</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                        <Input 
                          id="commissionRate" 
                          type="number" 
                          defaultValue={settings.commissionRate} 
                          min="0" 
                          max="100" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="minWithdrawalAmount">Montant minimum de retrait</Label>
                        <Input 
                          id="minWithdrawalAmount" 
                          type="number" 
                          defaultValue={settings.minWithdrawalAmount} 
                          min="0" 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePaymentSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Email */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres d'email</CardTitle>
                  <CardDescription>
                    Configurez les paramètres d'envoi d'emails.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mailProvider">Fournisseur d'email</Label>
                    <Select defaultValue={settings.mailProvider}>
                      <SelectTrigger id="mailProvider">
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailchimp">Mailchimp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">Hôte SMTP</Label>
                      <Input 
                        id="smtpHost" 
                        defaultValue={settings.smtpHost} 
                        placeholder="smtp.example.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">Port SMTP</Label>
                      <Input 
                        id="smtpPort" 
                        defaultValue={settings.smtpPort} 
                        placeholder="587" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
                      <Input 
                        id="smtpUser" 
                        defaultValue={settings.smtpUser} 
                        placeholder="user@example.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                      <Input 
                        id="smtpPassword" 
                        type="password" 
                        defaultValue={settings.smtpPassword} 
                        placeholder="••••••••" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Nom de l'expéditeur</Label>
                      <Input 
                        id="senderName" 
                        defaultValue={settings.senderName} 
                        placeholder="Location+" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">Email de l'expéditeur</Label>
                      <Input 
                        id="senderEmail" 
                        defaultValue={settings.senderEmail} 
                        placeholder="no-reply@example.com" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveEmailSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Social */}
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres sociaux</CardTitle>
                  <CardDescription>
                    Configurez les liens et intégrations des réseaux sociaux.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebookUrl">URL Facebook</Label>
                      <Input 
                        id="facebookUrl" 
                        defaultValue={settings.facebookUrl} 
                        placeholder="https://facebook.com/yourpage" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">URL Twitter</Label>
                      <Input 
                        id="twitterUrl" 
                        defaultValue={settings.twitterUrl} 
                        placeholder="https://twitter.com/yourhandle" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagramUrl">URL Instagram</Label>
                      <Input 
                        id="instagramUrl" 
                        defaultValue={settings.instagramUrl} 
                        placeholder="https://instagram.com/yourhandle" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">URL LinkedIn</Label>
                      <Input 
                        id="linkedinUrl" 
                        defaultValue={settings.linkedinUrl} 
                        placeholder="https://linkedin.com/company/yourcompany" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="youtubeUrl">URL YouTube</Label>
                      <Input 
                        id="youtubeUrl" 
                        defaultValue={settings.youtubeUrl} 
                        placeholder="https://youtube.com/yourchannel" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableSocialLogin" 
                        defaultChecked={settings.enableSocialLogin} 
                      />
                      <Label htmlFor="enableSocialLogin">Activer la connexion avec réseaux sociaux</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableSocialSharing" 
                        defaultChecked={settings.enableSocialSharing} 
                      />
                      <Label htmlFor="enableSocialSharing">Activer le partage sur réseaux sociaux</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSocialSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Footer */}
            <TabsContent value="footer">
              <Card>
                <CardHeader>
                  <CardTitle>Pied de page</CardTitle>
                  <CardDescription>
                    Configurez les informations du pied de page du site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactFooter">Informations de contact</Label>
                      <Textarea 
                        id="contactFooter" 
                        defaultValue={settings.footer.contact} 
                        placeholder="Informations de contact" 
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aboutFooter">À propos</Label>
                      <Textarea 
                        id="aboutFooter" 
                        defaultValue={settings.footer.about} 
                        placeholder="À propos du site" 
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="termsFooter">Conditions d'utilisation</Label>
                      <Textarea 
                        id="termsFooter" 
                        defaultValue={settings.footer.terms} 
                        placeholder="Conditions d'utilisation" 
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="policyFooter">Politique de confidentialité</Label>
                      <Textarea 
                        id="policyFooter" 
                        defaultValue={settings.footer.policy} 
                        placeholder="Politique de confidentialité" 
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveFooterSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Company */}
            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Informations d'entreprise</CardTitle>
                  <CardDescription>
                    Configurez les informations légales de votre entreprise.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Adresse</Label>
                      <Input 
                        id="companyAddress" 
                        defaultValue={settings.companyInfo.address} 
                        placeholder="123 Rue Principale, Ville, Pays" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Téléphone</Label>
                      <Input 
                        id="companyPhone" 
                        defaultValue={settings.companyInfo.phone} 
                        placeholder="+228 12 34 56 78" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input 
                        id="companyEmail" 
                        defaultValue={settings.companyInfo.email} 
                        placeholder="contact@example.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyRegistration">RCCM / Numéro d'enregistrement</Label>
                      <Input 
                        id="companyRegistration" 
                        defaultValue={settings.companyInfo.registrationNumber} 
                        placeholder="RCCM TG-LOM-2023-B-12345" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveCompanySettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Reservation */}
            <TabsContent value="reservation">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de réservation</CardTitle>
                  <CardDescription>
                    Configurez les règles et limites de réservation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minStay">Séjour minimum (jours)</Label>
                      <Input 
                        id="minStay" 
                        type="number" 
                        defaultValue={settings.reservationSettings.minStay} 
                        min="1" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxStay">Séjour maximum (jours)</Label>
                      <Input 
                        id="maxStay" 
                        type="number" 
                        defaultValue={settings.reservationSettings.maxStay} 
                        min="1" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="advanceBookingDays">Jours de réservation à l'avance</Label>
                      <Input 
                        id="advanceBookingDays" 
                        type="number" 
                        defaultValue={settings.reservationSettings.advanceBookingDays} 
                        min="0" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Switch 
                      id="instantBooking" 
                      defaultChecked={settings.reservationSettings.instantBooking} 
                    />
                    <Label htmlFor="instantBooking">Autoriser la réservation instantanée</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveReservationSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
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
