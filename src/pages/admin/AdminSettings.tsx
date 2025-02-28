
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
import { SidebarProvider } from '@/components/ui/sidebar';
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

                {/* Autres onglets seront ajoutés ici */}
                <TabsContent value="appearance">
                  {/* Contenu de l'onglet Apparence */}
                </TabsContent>

                <TabsContent value="company">
                  {/* Contenu de l'onglet Entreprise */}
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
                        Allez dans l'onglet "Général" et entrez l'URL de votre logo dans le champ correspondant. 
                        Assurez-vous que l'image est accessible publiquement.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Comment configurer les emails ?</AccordionTrigger>
                      <AccordionContent>
                        Accédez à l'onglet "Email" pour configurer les paramètres SMTP et les modèles de notifications.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Où gérer les utilisateurs ?</AccordionTrigger>
                      <AccordionContent>
                        La gestion des utilisateurs se fait dans la section "Utilisateurs" du menu principal, 
                        et non dans les paramètres du site.
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
