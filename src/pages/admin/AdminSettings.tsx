
import React, { useState, useRef } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useListings } from '@/hooks/useListings';
import { toast } from 'sonner';
import { 
  Settings, 
  Globe, 
  Image, 
  FileText, 
  Palette, 
  Mail, 
  Building, 
  CreditCard, 
  Calendar, 
  Bell, 
  Upload, 
  Download, 
  Trash, 
  Info, 
  AlertTriangle, 
  Check, 
  Shield, 
  Code,
  Database,
  Save,
  RefreshCw
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AdminSettings() {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings, applySettingsToDOM } = useSiteSettings();
  const { listings } = useListings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: settings.siteName,
    logo: settings.logo,
    language: settings.language,
    favicon: settings.logo, // Utilisation du logo comme favicon par défaut
  });

  const [colorSettings, setColorSettings] = useState({
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
  });

  const [footerSettings, setFooterSettings] = useState({
    contact: settings.footer.contact,
    about: settings.footer.about,
    terms: settings.footer.terms,
    policy: settings.footer.policy,
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: settings.socialLinks.facebook,
    twitter: settings.socialLinks.twitter,
    instagram: settings.socialLinks.instagram,
    linkedin: settings.socialLinks.linkedin,
  });

  const [companySettings, setCompanySettings] = useState({
    address: settings.companyInfo.address,
    phone: settings.companyInfo.phone,
    email: settings.companyInfo.email,
    registrationNumber: settings.companyInfo.registrationNumber,
  });

  const [reservationSettings, setReservationSettings] = useState({
    minStay: settings.reservationSettings.minStay,
    maxStay: settings.reservationSettings.maxStay,
    advanceBookingDays: settings.reservationSettings.advanceBookingDays,
    instantBooking: settings.reservationSettings.instantBooking,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'notifications@example.com',
    smtpPassword: '••••••••',
    senderName: settings.siteName,
    senderEmail: 'contact@example.com',
    enableNotifications: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'EUR',
    stripeLiveKey: '••••••••••••••••••••••••',
    stripeTestKey: '••••••••••••••••••••••••',
    testMode: true,
    serviceFeePercentage: 5,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enablePushNotifications: true,
    newReservationNotification: true,
    reservationStatusChangeNotification: true,
    newMessageNotification: true,
    newReviewNotification: true,
    marketingEmails: false,
  });

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isTestEmailDialogOpen, setIsTestEmailDialogOpen] = useState(false);
  const [testEmailTo, setTestEmailTo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  const handleSaveGeneralSettings = () => {
    setIsSaving(true);
    updateSettings.mutate({
      siteName: generalSettings.siteName,
      logo: generalSettings.logo,
      language: generalSettings.language as 'fr' | 'en',
    }, {
      onSuccess: () => {
        setIsSaving(false);
        // Appliquer immédiatement les modifications au DOM
        applySettingsToDOM();
        toast.success("Les paramètres généraux ont été mis à jour avec succès");
      },
      onError: () => {
        setIsSaving(false);
        toast.error("Une erreur est survenue lors de la mise à jour des paramètres");
      }
    });
  };

  const handleSaveColorSettings = () => {
    setIsSaving(true);
    updateSettings.mutate({
      primaryColor: colorSettings.primaryColor,
      secondaryColor: colorSettings.secondaryColor,
    }, {
      onSuccess: () => {
        setIsSaving(false);
        applySettingsToDOM();
        toast.success("Les paramètres de couleur ont été mis à jour avec succès");
      },
      onError: () => {
        setIsSaving(false);
        toast.error("Une erreur est survenue lors de la mise à jour des couleurs");
      }
    });
  };

  const handleSaveFooterSettings = () => {
    setIsSaving(true);
    updateSettings.mutate({
      footer: {
        contact: footerSettings.contact,
        about: footerSettings.about,
        terms: footerSettings.terms,
        policy: footerSettings.policy,
      },
    }, {
      onSuccess: () => {
        setIsSaving(false);
        applySettingsToDOM();
        toast.success("Les paramètres du pied de page ont été mis à jour avec succès");
      },
      onError: () => {
        setIsSaving(false);
        toast.error("Une erreur est survenue lors de la mise à jour du pied de page");
      }
    });
  };

  const handleSaveSocialSettings = () => {
    setIsSaving(true);
    updateSettings.mutate({
      socialLinks: {
        facebook: socialSettings.facebook,
        twitter: socialSettings.twitter,
        instagram: socialSettings.instagram,
        linkedin: socialSettings.linkedin,
      },
    }, {
      onSuccess: () => {
        setIsSaving(false);
        applySettingsToDOM();
        toast.success("Les paramètres des réseaux sociaux ont été mis à jour avec succès");
      },
      onError: () => {
        setIsSaving(false);
        toast.error("Une erreur est survenue lors de la mise à jour des réseaux sociaux");
      }
    });
  };

  const handleSaveCompanySettings = () => {
    setIsSaving(true);
    updateSettings.mutate({
      companyInfo: {
        address: companySettings.address,
        phone: companySettings.phone,
        email: companySettings.email,
        registrationNumber: companySettings.registrationNumber,
      },
    }, {
      onSuccess: () => {
        setIsSaving(false);
        applySettingsToDOM();
        toast.success("Les informations de l'entreprise ont été mises à jour avec succès");
      },
      onError: () => {
        setIsSaving(false);
        toast.error("Une erreur est survenue lors de la mise à jour des informations de l'entreprise");
      }
    });
  };

  const handleSaveReservationSettings = () => {
    setIsSaving(true);
    updateSettings.mutate({
      reservationSettings: {
        minStay: reservationSettings.minStay,
        maxStay: reservationSettings.maxStay,
        advanceBookingDays: reservationSettings.advanceBookingDays,
        instantBooking: reservationSettings.instantBooking,
      },
    }, {
      onSuccess: () => {
        setIsSaving(false);
        applySettingsToDOM();
        toast.success("Les paramètres de réservation ont été mis à jour avec succès");
      },
      onError: () => {
        setIsSaving(false);
        toast.error("Une erreur est survenue lors de la mise à jour des paramètres de réservation");
      }
    });
  };

  const handleSaveEmailSettings = () => {
    toast.success("Paramètres d'email enregistrés");
    // Dans une implémentation réelle, vous enregistreriez ces paramètres dans la base de données
  };

  const handleSavePaymentSettings = () => {
    toast.success("Paramètres de paiement enregistrés");
    // Dans une implémentation réelle, vous enregistreriez ces paramètres dans la base de données
  };

  const handleSaveNotificationSettings = () => {
    toast.success("Paramètres de notification enregistrés");
    // Dans une implémentation réelle, vous enregistreriez ces paramètres dans la base de données
  };

  const handleResetSettings = () => {
    resetSettings.mutate(undefined, {
      onSuccess: () => {
        setIsResetDialogOpen(false);
        
        // Réinitialiser les états locaux avec les valeurs par défaut
        setGeneralSettings({
          siteName: settings.siteName,
          logo: settings.logo,
          language: settings.language,
          favicon: settings.logo,
        });
        
        setColorSettings({
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
        });
        
        setFooterSettings({
          contact: settings.footer.contact,
          about: settings.footer.about,
          terms: settings.footer.terms,
          policy: settings.footer.policy,
        });
        
        setSocialSettings({
          facebook: settings.socialLinks.facebook,
          twitter: settings.socialLinks.twitter,
          instagram: settings.socialLinks.instagram,
          linkedin: settings.socialLinks.linkedin,
        });
        
        setCompanySettings({
          address: settings.companyInfo.address,
          phone: settings.companyInfo.phone,
          email: settings.companyInfo.email,
          registrationNumber: settings.companyInfo.registrationNumber,
        });
        
        setReservationSettings({
          minStay: settings.reservationSettings.minStay,
          maxStay: settings.reservationSettings.maxStay,
          advanceBookingDays: settings.reservationSettings.advanceBookingDays,
          instantBooking: settings.reservationSettings.instantBooking,
        });

        // Appliquer immédiatement les changements au DOM
        applySettingsToDOM();
      }
    });
  };

  const handleExportSettings = () => {
    exportSettings();
    setIsExportDialogOpen(false);
  };

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importSettings(file).then(success => {
        if (success) {
          // Mettre à jour les états locaux avec les nouvelles valeurs
          setGeneralSettings({
            siteName: settings.siteName,
            logo: settings.logo,
            language: settings.language,
            favicon: settings.logo,
          });
          
          setColorSettings({
            primaryColor: settings.primaryColor,
            secondaryColor: settings.secondaryColor,
          });
          
          setFooterSettings({
            contact: settings.footer.contact,
            about: settings.footer.about,
            terms: settings.footer.terms,
            policy: settings.footer.policy,
          });
          
          setSocialSettings({
            facebook: settings.socialLinks.facebook,
            twitter: settings.socialLinks.twitter,
            instagram: settings.socialLinks.instagram,
            linkedin: settings.socialLinks.linkedin,
          });
          
          setCompanySettings({
            address: settings.companyInfo.address,
            phone: settings.companyInfo.phone,
            email: settings.companyInfo.email,
            registrationNumber: settings.companyInfo.registrationNumber,
          });
          
          setReservationSettings({
            minStay: settings.reservationSettings.minStay,
            maxStay: settings.reservationSettings.maxStay,
            advanceBookingDays: settings.reservationSettings.advanceBookingDays,
            instantBooking: settings.reservationSettings.instantBooking,
          });

          // Appliquer immédiatement les changements au DOM
          applySettingsToDOM();
        }
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dans une application réelle, ici vous téléchargeriez d'abord l'image sur un serveur
      // et recevriez une URL que vous utiliseriez pour mettre à jour la logo
      
      // Simuler une conversion d'image en base64 pour démo locale
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setGeneralSettings({
          ...generalSettings,
          logo: base64String
        });
        
        // Afficher un message de confirmation
        toast.success("Logo téléchargé avec succès. N'oubliez pas d'enregistrer les modifications.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simuler une conversion d'image en base64 pour démo locale
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setGeneralSettings({
          ...generalSettings,
          favicon: base64String
        });
        
        // Afficher un message de confirmation
        toast.success("Favicon téléchargé avec succès. N'oubliez pas d'enregistrer les modifications.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendTestEmail = () => {
    if (!testEmailTo) {
      toast.error("Veuillez entrer une adresse e-mail valide");
      return;
    }
    
    toast.success(`Email de test envoyé à ${testEmailTo}`);
    setIsTestEmailDialogOpen(false);
    setTestEmailTo('');
  };

  const handleApplyPreview = () => {
    // Appliquer les paramètres actuels pour prévisualisation
    applySettingsToDOM();
    setIsPreviewVisible(true);
    toast.success("Prévisualisation appliquée. Vous pouvez voir les changements sur votre site.");
    
    // Ouvrir le site dans un nouvel onglet
    window.open('/', '_blank');
  };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Paramètres du site</h1>
              <p className="text-gray-500">
                Configurez tous les aspects de votre site web
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleApplyPreview}>
                <Image className="mr-2 h-4 w-4" />
                Prévisualiser
              </Button>
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => {
                  handleSaveGeneralSettings();
                  handleSaveColorSettings();
                  handleSaveFooterSettings();
                  handleSaveCompanySettings();
                }}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer tout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9 space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-4 lg:grid-cols-8">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Général</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span>Apparence</span>
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Entreprise</span>
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>Médias</span>
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Réservations</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Paiement</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                </TabsList>

                {/* Onglet Général */}
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres généraux</CardTitle>
                      <CardDescription>
                        Configurez les informations de base de votre site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="siteName">Nom du site</Label>
                          <Input
                            id="siteName"
                            value={generalSettings.siteName}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                siteName: e.target.value,
                              })
                            }
                          />
                          <p className="text-sm text-gray-500">
                            Ce nom sera utilisé dans le titre de la page et à travers le site.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="logo">Logo du site</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="space-y-2">
                              <div className="p-4 border rounded-lg bg-white flex items-center justify-center">
                                <img 
                                  src={generalSettings.logo} 
                                  alt="Logo du site" 
                                  className="h-16 w-auto object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => logoFileInputRef.current?.click()}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Téléverser
                                  <input
                                    ref={logoFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                  />
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setGeneralSettings({
                                    ...generalSettings,
                                    logo: "/placeholder.svg"
                                  })}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="logoUrl">URL du logo</Label>
                              <Input
                                id="logoUrl"
                                value={generalSettings.logo}
                                onChange={(e) =>
                                  setGeneralSettings({
                                    ...generalSettings,
                                    logo: e.target.value,
                                  })
                                }
                                placeholder="https://votre-site.com/logo.png"
                              />
                              <div className="text-sm text-gray-500">
                                <p>Format recommandé: PNG ou SVG</p>
                                <p>Taille recommandée: 200x60 pixels</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="favicon">Favicon</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="space-y-2">
                              <div className="p-4 border rounded-lg bg-white flex items-center justify-center">
                                <img 
                                  src={generalSettings.favicon} 
                                  alt="Favicon du site" 
                                  className="h-10 w-10 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => faviconFileInputRef.current?.click()}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Téléverser
                                  <input
                                    ref={faviconFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFaviconUpload}
                                    className="hidden"
                                  />
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setGeneralSettings({
                                    ...generalSettings,
                                    favicon: "/placeholder.svg"
                                  })}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="faviconUrl">URL du favicon</Label>
                              <Input
                                id="faviconUrl"
                                value={generalSettings.favicon}
                                onChange={(e) =>
                                  setGeneralSettings({
                                    ...generalSettings,
                                    favicon: e.target.value,
                                  })
                                }
                                placeholder="https://votre-site.com/favicon.ico"
                              />
                              <div className="text-sm text-gray-500">
                                <p>Format recommandé: ICO ou PNG</p>
                                <p>Taille recommandée: 32x32 pixels</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="language">Langue du site</Label>
                          <Select 
                            value={generalSettings.language}
                            onValueChange={(value) =>
                              setGeneralSettings({
                                ...generalSettings,
                                language: value as 'fr' | 'en',
                              })
                            }
                          >
                            <SelectTrigger id="language">
                              <SelectValue placeholder="Choisir une langue" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-500">
                            Langue principale utilisée sur le site.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        Dernière modification : {new Date().toLocaleDateString()}
                      </div>
                      <Button 
                        onClick={handleSaveGeneralSettings}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les modifications
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Onglet Apparence */}
                <TabsContent value="appearance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Apparence du site</CardTitle>
                      <CardDescription>
                        Personnalisez les couleurs et l'apparence visuelle de votre site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Couleur principale</Label>
                          <div className="flex items-center gap-4">
                            <Input
                              id="primaryColor"
                              type="color"
                              value={colorSettings.primaryColor}
                              onChange={(e) =>
                                setColorSettings({
                                  ...colorSettings,
                                  primaryColor: e.target.value,
                                })
                              }
                              className="w-20 h-10 p-1"
                            />
                            <Input
                              value={colorSettings.primaryColor}
                              onChange={(e) =>
                                setColorSettings({
                                  ...colorSettings,
                                  primaryColor: e.target.value,
                                })
                              }
                              className="font-mono"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Utilisée pour les éléments principaux comme les boutons et les liens.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                          <div className="flex items-center gap-4">
                            <Input
                              id="secondaryColor"
                              type="color"
                              value={colorSettings.secondaryColor}
                              onChange={(e) =>
                                setColorSettings({
                                  ...colorSettings,
                                  secondaryColor: e.target.value,
                                })
                              }
                              className="w-20 h-10 p-1"
                            />
                            <Input
                              value={colorSettings.secondaryColor}
                              onChange={(e) =>
                                setColorSettings({
                                  ...colorSettings,
                                  secondaryColor: e.target.value,
                                })
                              }
                              className="font-mono"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Utilisée pour les accents et éléments secondaires.
                          </p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-2">Aperçu des couleurs</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className="h-20 rounded-md flex items-center justify-center text-white" 
                            style={{ backgroundColor: colorSettings.primaryColor }}
                          >
                            Couleur principale
                          </div>
                          <div 
                            className="h-20 rounded-md flex items-center justify-center text-white" 
                            style={{ backgroundColor: colorSettings.secondaryColor }}
                          >
                            Couleur secondaire
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-2">
                          <h4 className="text-sm font-medium">Exemples d'éléments</h4>
                          <div className="p-4 border rounded-lg space-y-4">
                            <div className="space-x-2">
                              <button 
                                className="px-4 py-2 rounded-md text-white" 
                                style={{ backgroundColor: colorSettings.primaryColor }}
                              >
                                Bouton principal
                              </button>
                              <button 
                                className="px-4 py-2 rounded-md text-white" 
                                style={{ backgroundColor: colorSettings.secondaryColor }}
                              >
                                Bouton secondaire
                              </button>
                            </div>
                            <div>
                              <a href="#" style={{ color: colorSettings.primaryColor }}>Voici à quoi ressemblerait un lien</a>
                            </div>
                            <div 
                              className="p-3 rounded-md text-white text-sm" 
                              style={{ backgroundColor: colorSettings.primaryColor }}
                            >
                              Un élément de mise en avant avec la couleur principale
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        Les modifications de couleur s'appliquent immédiatement sur tout le site.
                      </div>
                      <Button 
                        onClick={handleSaveColorSettings}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les modifications
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Autres onglets seront ajoutés ici */}
                <TabsContent value="company">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations de l'entreprise</CardTitle>
                      <CardDescription>
                        Configurez les informations de contact et administratives
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Textarea
                            id="address"
                            value={companySettings.address}
                            onChange={(e) =>
                              setCompanySettings({
                                ...companySettings,
                                address: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email professionnel</Label>
                          <Input
                            id="email"
                            type="email"
                            value={companySettings.email}
                            onChange={(e) =>
                              setCompanySettings({
                                ...companySettings,
                                email: e.target.value,
                              })
                            }
                          />
                          <Label htmlFor="phone" className="mt-4">Téléphone</Label>
                          <Input
                            id="phone"
                            value={companySettings.phone}
                            onChange={(e) =>
                              setCompanySettings({
                                ...companySettings,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Numéro d'enregistrement</Label>
                        <Input
                          id="registrationNumber"
                          value={companySettings.registrationNumber}
                          onChange={(e) =>
                            setCompanySettings({
                              ...companySettings,
                              registrationNumber: e.target.value,
                            })
                          }
                        />
                        <p className="text-sm text-gray-500">
                          Numéro d'enregistrement officiel de votre entreprise (SIRET, RCCM, etc.)
                        </p>
                      </div>

                      <div className="p-4 bg-amber-50 text-amber-800 rounded-md text-sm flex items-start">
                        <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Informations légales</p>
                          <p className="mt-1">
                            Ces informations apparaîtront sur vos factures et documents légaux. 
                            Assurez-vous qu'elles sont correctes et à jour.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        Dernière modification : {new Date().toLocaleDateString()}
                      </div>
                      <Button 
                        onClick={handleSaveCompanySettings}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les modifications
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="media">
                  {/* Contenu de l'onglet Médias */}
                </TabsContent>

                <TabsContent value="reservations">
                  {/* Contenu de l'onglet Réservations */}
                </TabsContent>

                <TabsContent value="email">
                  {/* Contenu de l'onglet Email */}
                </TabsContent>

                <TabsContent value="payment">
                  {/* Contenu de l'onglet Paiement */}
                </TabsContent>

                <TabsContent value="notifications">
                  {/* Contenu de l'onglet Notifications */}
                </TabsContent>
              </Tabs>
            </div>

            <div className="col-span-12 lg:col-span-3 space-y-6">
              {/* Panneau latéral des actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Gérez vos paramètres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsExportDialogOpen(true)}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter les paramètres
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer les paramètres
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                    />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-yellow-600" 
                    onClick={handleApplyPreview}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Prévisualiser les changements
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => setIsResetDialogOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Réinitialiser les paramètres
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aide</CardTitle>
                  <CardDescription>Besoin d'assistance ?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Comment modifier le logo ?</AccordionTrigger>
                      <AccordionContent>
                        Allez dans l'onglet "Général" et téléversez votre logo en cliquant sur le bouton "Téléverser".
                        Vous pouvez également entrer l'URL de votre logo si celui-ci est déjà hébergé sur Internet.
                        N'oubliez pas de cliquer sur "Enregistrer les modifications" pour appliquer les changements.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Comment changer les couleurs du site ?</AccordionTrigger>
                      <AccordionContent>
                        Accédez à l'onglet "Apparence" pour modifier les couleurs principale et secondaire du site.
                        Vous pouvez utiliser le sélecteur de couleur ou entrer directement un code hexadécimal.
                        Les modifications seront appliquées immédiatement après avoir cliqué sur "Enregistrer les modifications".
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Comment prévisualiser les changements ?</AccordionTrigger>
                      <AccordionContent>
                        Après avoir effectué vos modifications, cliquez sur le bouton "Prévisualiser" en haut de la page
                        ou sur "Prévisualiser les changements" dans le panneau latéral. Une nouvelle fenêtre s'ouvrira
                        avec votre site public affichant les modifications apportées.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser les paramètres</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              Tous vos paramètres personnalisés seront perdus et remplacés par les valeurs par défaut.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleResetSettings}>
              Réinitialiser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les paramètres</DialogTitle>
            <DialogDescription>
              Téléchargez un fichier JSON contenant tous vos paramètres personnalisés.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              Ce fichier peut être utilisé pour restaurer vos paramètres ultérieurement 
              ou les transférer vers une autre installation.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleExportSettings}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTestEmailDialogOpen} onOpenChange={setIsTestEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un email de test</DialogTitle>
            <DialogDescription>
              Envoyez un email de test pour vérifier la configuration SMTP.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmailTo">Adresse email de destination</Label>
              <Input
                id="testEmailTo"
                type="email"
                placeholder="votre@email.com"
                value={testEmailTo}
                onChange={(e) => setTestEmailTo(e.target.value)}
              />
            </div>
            <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md">
              <Info className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Un email de test sera envoyé avec les paramètres SMTP configurés.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestEmailDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendTestEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
