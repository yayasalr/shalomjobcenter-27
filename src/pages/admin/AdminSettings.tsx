
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
  Save
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
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSiteSettings();
  const { listings } = useListings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleSaveGeneralSettings = () => {
    updateSettings.mutate({
      siteName: generalSettings.siteName,
      logo: generalSettings.logo,
      language: generalSettings.language as 'fr' | 'en',
    });
  };

  const handleSaveColorSettings = () => {
    updateSettings.mutate({
      primaryColor: colorSettings.primaryColor,
      secondaryColor: colorSettings.secondaryColor,
    });
  };

  const handleSaveFooterSettings = () => {
    updateSettings.mutate({
      footer: {
        contact: footerSettings.contact,
        about: footerSettings.about,
        terms: footerSettings.terms,
        policy: footerSettings.policy,
      },
    });
  };

  const handleSaveSocialSettings = () => {
    updateSettings.mutate({
      socialLinks: {
        facebook: socialSettings.facebook,
        twitter: socialSettings.twitter,
        instagram: socialSettings.instagram,
        linkedin: socialSettings.linkedin,
      },
    });
  };

  const handleSaveCompanySettings = () => {
    updateSettings.mutate({
      companyInfo: {
        address: companySettings.address,
        phone: companySettings.phone,
        email: companySettings.email,
        registrationNumber: companySettings.registrationNumber,
      },
    });
  };

  const handleSaveReservationSettings = () => {
    updateSettings.mutate({
      reservationSettings: {
        minStay: reservationSettings.minStay,
        maxStay: reservationSettings.maxStay,
        advanceBookingDays: reservationSettings.advanceBookingDays,
        instantBooking: reservationSettings.instantBooking,
      },
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
    resetSettings.mutate();
    setIsResetDialogOpen(false);
    
    // Réinitialiser les états locaux
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
            instagram: socialSettings.instagram,
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
        }
      });
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

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Paramètres du site</h1>
            <p className="text-gray-500">
              Configurez tous les aspects de votre site web
            </p>
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
                          <Label htmlFor="logo">URL du logo</Label>
                          <Input
                            id="logo"
                            value={generalSettings.logo}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                logo: e.target.value,
                              })
                            }
                          />
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="p-2 border rounded">
                              <img 
                                src={generalSettings.logo} 
                                alt="Logo du site" 
                                className="h-16 w-auto object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div className="text-sm text-gray-500">
                              <p>Format recommandé: PNG ou SVG</p>
                              <p>Taille recommandée: 200x60 pixels</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="favicon">Favicon</Label>
                          <Input
                            id="favicon"
                            value={generalSettings.favicon}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                favicon: e.target.value,
                              })
                            }
                          />
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="p-2 border rounded">
                              <img 
                                src={generalSettings.favicon} 
                                alt="Favicon du site" 
                                className="h-8 w-8 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div className="text-sm text-gray-500">
                              <p>Format recommandé: ICO ou PNG</p>
                              <p>Taille recommandée: 32x32 pixels</p>
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
                        disabled={updateSettings.isPending}
                      >
                        {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Onglet Apparence */}
                <TabsContent value="appearance">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Couleurs du site</CardTitle>
                        <CardDescription>
                          Personnalisez les couleurs principales de votre site
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

                        <div className="mt-6">
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
                              <div className="space-y-2">
                                <button 
                                  className="px-4 py-2 rounded-md text-white" 
                                  style={{ backgroundColor: colorSettings.primaryColor }}
                                >
                                  Bouton principal
                                </button>
                                <button 
                                  className="px-4 py-2 ml-2 rounded-md text-white" 
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
                          Dernière modification : {new Date().toLocaleDateString()}
                        </div>
                        <Button 
                          onClick={handleSaveColorSettings}
                          disabled={updateSettings.isPending}
                        >
                          {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Pied de page</CardTitle>
                        <CardDescription>
                          Configurez les informations du pied de page
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact">Contact</Label>
                          <Textarea
                            id="contact"
                            value={footerSettings.contact}
                            onChange={(e) =>
                              setFooterSettings({
                                ...footerSettings,
                                contact: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="about">À propos de nous</Label>
                          <Textarea
                            id="about"
                            value={footerSettings.about}
                            onChange={(e) =>
                              setFooterSettings({
                                ...footerSettings,
                                about: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="justify-end border-t px-6 py-4">
                        <Button 
                          onClick={handleSaveFooterSettings}
                          disabled={updateSettings.isPending}
                        >
                          Enregistrer
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Pages légales</CardTitle>
                        <CardDescription>
                          Configurez les informations légales
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="terms">Conditions d'utilisation</Label>
                          <Textarea
                            id="terms"
                            value={footerSettings.terms}
                            onChange={(e) =>
                              setFooterSettings({
                                ...footerSettings,
                                terms: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="policy">Politique de confidentialité</Label>
                          <Textarea
                            id="policy"
                            value={footerSettings.policy}
                            onChange={(e) =>
                              setFooterSettings({
                                ...footerSettings,
                                policy: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="justify-end border-t px-6 py-4">
                        <Button 
                          onClick={handleSaveFooterSettings}
                          disabled={updateSettings.isPending}
                        >
                          Enregistrer
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

                {/* Onglet Entreprise */}
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
                        disabled={updateSettings.isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Onglet Réservations */}
                <TabsContent value="reservations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres de réservation</CardTitle>
                      <CardDescription>
                        Configurez les règles de réservation pour votre plateforme
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="minStay">Durée minimale de séjour (jours)</Label>
                          <Input
                            id="minStay"
                            type="number"
                            min="1"
                            value={reservationSettings.minStay}
                            onChange={(e) =>
                              setReservationSettings({
                                ...reservationSettings,
                                minStay: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                          <p className="text-sm text-gray-500">
                            Nombre minimum de jours pour une réservation
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="maxStay">Durée maximale de séjour (jours)</Label>
                          <Input
                            id="maxStay"
                            type="number"
                            min={reservationSettings.minStay}
                            value={reservationSettings.maxStay}
                            onChange={(e) =>
                              setReservationSettings({
                                ...reservationSettings,
                                maxStay: parseInt(e.target.value) || reservationSettings.minStay,
                              })
                            }
                          />
                          <p className="text-sm text-gray-500">
                            Nombre maximum de jours pour une réservation
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="advanceBookingDays">Jours de réservation à l'avance</Label>
                          <Input
                            id="advanceBookingDays"
                            type="number"
                            min="0"
                            value={reservationSettings.advanceBookingDays}
                            onChange={(e) =>
                              setReservationSettings({
                                ...reservationSettings,
                                advanceBookingDays: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                          <p className="text-sm text-gray-500">
                            Combien de jours à l'avance les clients peuvent réserver
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="instantBooking">Réservation instantanée</Label>
                            <Switch
                              id="instantBooking"
                              checked={reservationSettings.instantBooking}
                              onCheckedChange={(checked) =>
                                setReservationSettings({
                                  ...reservationSettings,
                                  instantBooking: checked,
                                })
                              }
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Permettre aux clients de réserver sans approbation préalable
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm flex items-start">
                        <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Paramètres globaux</p>
                          <p className="mt-1">
                            Ces paramètres s'appliquent par défaut à tous les logements. 
                            Les hôtes peuvent les personnaliser pour leurs propres annonces.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        {listings.length} logement{listings.length !== 1 ? 's' : ''} sur la plateforme
                      </div>
                      <Button 
                        onClick={handleSaveReservationSettings}
                        disabled={updateSettings.isPending}
                      >
                        {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Onglet Email */}
                <TabsContent value="email">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuration des emails</CardTitle>
                      <CardDescription>
                        Paramètres du serveur SMTP et des notifications par email
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smtpServer">Serveur SMTP</Label>
                          <Input
                            id="smtpServer"
                            value={emailSettings.smtpServer}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                smtpServer: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">Port SMTP</Label>
                          <Input
                            id="smtpPort"
                            type="number"
                            value={emailSettings.smtpPort}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                smtpPort: parseInt(e.target.value) || 587,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smtpUsername">Nom d'utilisateur SMTP</Label>
                          <Input
                            id="smtpUsername"
                            value={emailSettings.smtpUsername}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                smtpUsername: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                          <Input
                            id="smtpPassword"
                            type="password"
                            value={emailSettings.smtpPassword}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                smtpPassword: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="senderName">Nom de l'expéditeur</Label>
                          <Input
                            id="senderName"
                            value={emailSettings.senderName}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                senderName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="senderEmail">Email de l'expéditeur</Label>
                          <Input
                            id="senderEmail"
                            type="email"
                            value={emailSettings.senderEmail}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                senderEmail: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableNotifications"
                          checked={emailSettings.enableNotifications}
                          onCheckedChange={(checked) =>
                            setEmailSettings({
                              ...emailSettings,
                              enableNotifications: checked,
                            })
                          }
                        />
                        <Label htmlFor="enableNotifications">Activer les notifications par email</Label>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Tester la configuration</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsTestEmailDialogOpen(true)}>
                            Envoyer un email de test
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        Ces paramètres sont nécessaires pour envoyer des emails depuis la plateforme
                      </div>
                      <Button 
                        onClick={handleSaveEmailSettings}
                      >
                        Enregistrer
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Onglet Paiement */}
                <TabsContent value="payment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuration des paiements</CardTitle>
                      <CardDescription>
                        Paramètres de paiement et de facturation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Devise</Label>
                          <Select 
                            value={paymentSettings.currency}
                            onValueChange={(value) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                currency: value,
                              })
                            }
                          >
                            <SelectTrigger id="currency">
                              <SelectValue placeholder="Choisir une devise" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                              <SelectItem value="USD">Dollar américain ($)</SelectItem>
                              <SelectItem value="GBP">Livre sterling (£)</SelectItem>
                              <SelectItem value="XOF">Franc CFA (FCFA)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="stripeLiveKey">Clé API Stripe (Production)</Label>
                            <Input
                              id="stripeLiveKey"
                              value={paymentSettings.stripeLiveKey}
                              onChange={(e) =>
                                setPaymentSettings({
                                  ...paymentSettings,
                                  stripeLiveKey: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="stripeTestKey">Clé API Stripe (Test)</Label>
                            <Input
                              id="stripeTestKey"
                              value={paymentSettings.stripeTestKey}
                              onChange={(e) =>
                                setPaymentSettings({
                                  ...paymentSettings,
                                  stripeTestKey: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="testMode"
                            checked={paymentSettings.testMode}
                            onCheckedChange={(checked) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                testMode: checked,
                              })
                            }
                          />
                          <Label htmlFor="testMode">Mode test activé</Label>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="serviceFeePercentage">Frais de service (%)</Label>
                          <Input
                            id="serviceFeePercentage"
                            type="number"
                            min="0"
                            max="100"
                            value={paymentSettings.serviceFeePercentage}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                serviceFeePercentage: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                          <p className="text-sm text-gray-500">
                            Pourcentage prélevé sur chaque transaction comme frais de service
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Mode test activé</p>
                          <p className="mt-1">
                            Les paiements sont traités en mode test. Aucune transaction réelle ne sera effectuée.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        Les clés API ne sont jamais affichées en clair côté client
                      </div>
                      <Button onClick={handleSavePaymentSettings}>
                        Enregistrer
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Onglet Notifications */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres de notification</CardTitle>
                      <CardDescription>
                        Configurez les notifications système et utilisateur
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Canaux de notification</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="enableEmailNotifications" className="font-medium">Notifications par email</Label>
                              <p className="text-xs text-gray-500">Envoyer des notifications par email aux utilisateurs</p>
                            </div>
                            <Switch
                              id="enableEmailNotifications"
                              checked={notificationSettings.enableEmailNotifications}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  enableEmailNotifications: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="enableSmsNotifications" className="font-medium">Notifications par SMS</Label>
                              <p className="text-xs text-gray-500">Envoyer des notifications par SMS aux utilisateurs</p>
                            </div>
                            <Switch
                              id="enableSmsNotifications"
                              checked={notificationSettings.enableSmsNotifications}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  enableSmsNotifications: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="enablePushNotifications" className="font-medium">Notifications push</Label>
                              <p className="text-xs text-gray-500">Envoyer des notifications push sur les appareils mobiles</p>
                            </div>
                            <Switch
                              id="enablePushNotifications"
                              checked={notificationSettings.enablePushNotifications}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  enablePushNotifications: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Événements de notification</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="newReservationNotification">Nouvelles réservations</Label>
                            <Switch
                              id="newReservationNotification"
                              checked={notificationSettings.newReservationNotification}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  newReservationNotification: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="reservationStatusChangeNotification">Changements de statut des réservations</Label>
                            <Switch
                              id="reservationStatusChangeNotification"
                              checked={notificationSettings.reservationStatusChangeNotification}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  reservationStatusChangeNotification: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="newMessageNotification">Nouveaux messages</Label>
                            <Switch
                              id="newMessageNotification"
                              checked={notificationSettings.newMessageNotification}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  newMessageNotification: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="newReviewNotification">Nouveaux avis</Label>
                            <Switch
                              id="newReviewNotification"
                              checked={notificationSettings.newReviewNotification}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  newReviewNotification: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Marketing</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="marketingEmails" className="font-medium">Emails marketing</Label>
                              <p className="text-xs text-gray-500">Envoyer des emails promotionnels aux utilisateurs</p>
                            </div>
                            <Switch
                              id="marketingEmails"
                              checked={notificationSettings.marketingEmails}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  marketingEmails: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        Les utilisateurs peuvent personnaliser leurs préférences de notification
                      </div>
                      <Button onClick={handleSaveNotificationSettings}>
                        Enregistrer
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Onglet Médias */}
                <TabsContent value="media">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestion des médias</CardTitle>
                      <CardDescription>
                        Configurez les paramètres de téléchargement et de stockage des médias
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Taille maximale de téléchargement</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              max="20"
                              defaultValue={5}
                            />
                            <span className="text-gray-500">MB</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Taille maximale des fichiers téléchargés
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Formats autorisés</Label>
                          <div className="p-3 bg-gray-50 rounded-md text-gray-600 text-sm">
                            JPG, PNG, GIF, WEBP, PDF, DOC, DOCX, XLS, XLSX
                          </div>
                          <p className="text-sm text-gray-500">
                            Formats de fichiers acceptés pour le téléchargement
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Optimisation des images</Label>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked id="optimize-images" />
                              <Label htmlFor="optimize-images">Optimiser les images à l'upload</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked id="create-thumbnails" />
                              <Label htmlFor="create-thumbnails">Créer des miniatures</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked id="preserve-exif" />
                              <Label htmlFor="preserve-exif">Préserver les métadonnées EXIF</Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Stockage</Label>
                          <Select defaultValue="local">
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un système de stockage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="local">Stockage local</SelectItem>
                              <SelectItem value="s3">Amazon S3</SelectItem>
                              <SelectItem value="cloudinary">Cloudinary</SelectItem>
                              <SelectItem value="gcloud">Google Cloud Storage</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-500">
                            Où les fichiers téléchargés seront stockés
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm flex items-start">
                        <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Stockage actuel</p>
                          <p className="mt-1">
                            Espace utilisé: <span className="font-medium">256 MB</span> / 5 GB
                          </p>
                          <div className="w-full h-2 bg-blue-200 rounded-full mt-2">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '5%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between border-t px-6 py-4">
                      <div className="text-xs text-gray-500">
                        La gestion efficace des médias améliore les performances du site
                      </div>
                      <Button>
                        Enregistrer
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="col-span-12 lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>
                    Gestion des paramètres
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsExportDialogOpen(true)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exporter les paramètres
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Importer les paramètres
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".json"
                      onChange={handleImportSettings}
                    />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setIsResetDialogOpen(true)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Réinitialiser les paramètres
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations système</CardTitle>
                  <CardDescription>
                    Détails techniques
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Version</span>
                      <span className="text-sm font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Environnement</span>
                      <span className="text-sm font-medium">Production</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Dernière mise à jour</span>
                      <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="logs">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          Journaux système
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs font-mono bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          <p>2024-05-01 15:32:21 - Paramètres mis à jour</p>
                          <p>2024-05-01 14:25:33 - Connexion administrateur</p>
                          <p>2024-05-01 12:11:05 - Sauvegarde automatique</p>
                          <p>2024-05-01 10:05:47 - Démarrage du système</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="database">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-2" />
                          Base de données
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-500">Type</span>
                            <span className="font-medium">PostgreSQL</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-500">Version</span>
                            <span className="font-medium">14.2</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Taille</span>
                            <span className="font-medium">125 MB</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="security">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Sécurité
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-500">SSL</span>
                            <span className="font-medium text-green-600">Activé</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-500">2FA</span>
                            <span className="font-medium text-green-600">Activé</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dernière analyse</span>
                            <span className="font-medium">2024-05-01</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="justify-center border-t px-6 py-4">
                  <Button variant="outline" size="sm">
                    <Info className="mr-2 h-4 w-4" />
                    Centre d'aide
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Dialogue de réinitialisation */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser les paramètres</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 text-red-800 rounded-md text-sm flex items-start mb-4">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Attention</p>
              <p className="mt-1">
                La réinitialisation restaurera tous les paramètres à leurs valeurs par défaut.
                Les modifications non sauvegardées seront perdues.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetSettings}
              disabled={resetSettings.isPending}
            >
              {resetSettings.isPending ? "Réinitialisation..." : "Réinitialiser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'exportation */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les paramètres</DialogTitle>
            <DialogDescription>
              Téléchargez un fichier JSON contenant tous les paramètres actuels.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm flex items-start mb-4">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Information</p>
              <p className="mt-1">
                Le fichier exporté peut être utilisé pour restaurer les paramètres
                ou pour les transférer vers une autre installation.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleExportSettings}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'email de test */}
      <Dialog open={isTestEmailDialogOpen} onOpenChange={setIsTestEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un email de test</DialogTitle>
            <DialogDescription>
              Envoyez un email de test pour vérifier votre configuration SMTP.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="testEmailTo">Adresse de destination</Label>
              <Input
                id="testEmailTo"
                type="email"
                placeholder="votre@email.com"
                value={testEmailTo}
                onChange={(e) => setTestEmailTo(e.target.value)}
              />
            </div>
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
              <p>Un email de test sera envoyé à l'adresse spécifiée.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestEmailDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendTestEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer le test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
