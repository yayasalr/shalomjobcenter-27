
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';
import { Settings, Globe, Image, FileText, Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useListings } from '@/hooks/useListings';

export function AdminSettings() {
  const { settings, updateSettings, isLoading } = useSiteSettings();
  const { listings } = useListings();
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: settings.siteName,
    logo: settings.logo,
    language: settings.language,
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

  if (isLoading) {
    return <div>Chargement des paramètres...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Paramètres du site</h1>
              <p className="text-gray-500">
                Configurez les paramètres généraux de votre site
              </p>
            </div>

            <Tabs defaultValue="general">
              <TabsList className="mb-6 grid w-full grid-cols-5">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Général</span>
                </TabsTrigger>
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Couleurs</span>
                </TabsTrigger>
                <TabsTrigger value="footer" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Pied de page</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Réseaux sociaux</span>
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>Images</span>
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
                  <CardContent className="space-y-4">
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
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-2">Aperçu du logo :</p>
                          <img 
                            src={generalSettings.logo} 
                            alt="Logo du site" 
                            className="h-16 w-auto object-contain border rounded p-2"
                          />
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
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveGeneralSettings}
                      disabled={updateSettings.isPending}
                      className="mt-4"
                    >
                      {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Couleurs */}
              <TabsContent value="colors">
                <Card>
                  <CardHeader>
                    <CardTitle>Couleurs du site</CardTitle>
                    <CardDescription>
                      Personnalisez les couleurs principales de votre site
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
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
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveColorSettings}
                      disabled={updateSettings.isPending}
                      className="mt-4"
                    >
                      {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Pied de page */}
              <TabsContent value="footer">
                <Card>
                  <CardHeader>
                    <CardTitle>Pied de page</CardTitle>
                    <CardDescription>
                      Configurez les informations du pied de page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
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
                    </div>

                    <Button 
                      onClick={handleSaveFooterSettings}
                      disabled={updateSettings.isPending}
                      className="mt-4"
                    >
                      {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Réseaux sociaux */}
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Réseaux sociaux</CardTitle>
                    <CardDescription>
                      Configurez les liens vers vos réseaux sociaux
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={socialSettings.facebook}
                          onChange={(e) =>
                            setSocialSettings({
                              ...socialSettings,
                              facebook: e.target.value,
                            })
                          }
                          placeholder="https://facebook.com/votre-page"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={socialSettings.twitter}
                          onChange={(e) =>
                            setSocialSettings({
                              ...socialSettings,
                              twitter: e.target.value,
                            })
                          }
                          placeholder="https://twitter.com/votre-compte"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={socialSettings.instagram}
                          onChange={(e) =>
                            setSocialSettings({
                              ...socialSettings,
                              instagram: e.target.value,
                            })
                          }
                          placeholder="https://instagram.com/votre-compte"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={socialSettings.linkedin}
                          onChange={(e) =>
                            setSocialSettings({
                              ...socialSettings,
                              linkedin: e.target.value,
                            })
                          }
                          placeholder="https://linkedin.com/company/votre-entreprise"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveSocialSettings}
                      disabled={updateSettings.isPending}
                      className="mt-4"
                    >
                      {updateSettings.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Images */}
              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle>Catalogue d'images</CardTitle>
                    <CardDescription>
                      Gérez les images des logements disponibles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Toutes les images disponibles</h3>
                      <p className="text-gray-500 mb-4">
                        Visualisez et gérez toutes les images utilisées dans les logements.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {listings
                          .flatMap((listing) => 
                            listing.images ? 
                              listing.images.map((image) => ({ id: listing.id, image, title: listing.title })) : 
                              [{ id: listing.id, image: listing.image, title: listing.title }]
                          )
                          .slice(0, 12)
                          .map((item, index) => (
                            <Sheet key={index}>
                              <SheetTrigger asChild>
                                <div className="relative cursor-pointer group overflow-hidden rounded-lg">
                                  <img 
                                    src={item.image} 
                                    alt={`Image ${index}`} 
                                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      Voir détails
                                    </div>
                                  </div>
                                </div>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Détails de l'image</SheetTitle>
                                  <SheetDescription>
                                    Informations sur l'utilisation de cette image
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                  <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-auto rounded-lg shadow-lg"
                                  />
                                  <div className="space-y-2">
                                    <h3 className="font-medium">Utilisée dans :</h3>
                                    <p>{item.title}</p>
                                    <div className="flex items-center gap-2">
                                      <Button size="sm" variant="outline" asChild>
                                        <Link to={`/logement/${item.id}`}>
                                          Voir le logement
                                        </Link>
                                      </Button>
                                      <Button size="sm" variant="outline" asChild>
                                        <Link to={`/admin/logements`}>
                                          Éditer
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                          ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline">Voir toutes les images</Button>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Ajouter de nouvelles images</h3>
                      <p className="text-gray-500 mb-4">
                        Les nouvelles images peuvent être ajoutées lors de la création ou de la modification d'un logement.
                      </p>
                      <Button asChild>
                        <Link to="/admin/logements">
                          Gérer les logements
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
