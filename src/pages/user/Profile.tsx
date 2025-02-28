
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Camera } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 mt-8">Mon profil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto relative mb-4 group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="Photo de profil" />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                <CardTitle>{user?.name || "Utilisateur"}</CardTitle>
                <CardDescription>Membre depuis {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>{user?.name || "Non spécifié"}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email || "email@exemple.com"}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>+228 XX XX XX XX</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>Lomé, Togo</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Inscrit le {new Date().toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Modifier mon profil</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="infos">
              <TabsList className="mb-6">
                <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="infos">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Modifiez vos informations de profil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" defaultValue={user?.name || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" type="tel" placeholder="+228 XX XX XX XX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Input id="country" defaultValue="Togo" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Textarea id="address" placeholder="Votre adresse complète" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea id="bio" placeholder="Parlez un peu de vous..." />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Enregistrer les modifications</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité du compte</CardTitle>
                    <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Mettre à jour le mot de passe</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences</CardTitle>
                    <CardDescription>Personnalisez votre expérience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8 text-gray-500">
                      Les préférences seront disponibles prochainement.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
