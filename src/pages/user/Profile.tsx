
import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Camera, Upload, Check, AlertCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || "/placeholder.svg");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    country: "Togo",
    address: "",
    bio: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Type de fichier non supporté. Veuillez choisir une image (JPG, PNG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("L'image est trop volumineuse. La taille maximale est de 5 MB");
      return;
    }

    setIsUploading(true);
    
    // Create a URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        
        // Simulate upload delay
        setTimeout(() => {
          setIsUploading(false);
          toast.success("Photo de profil mise à jour avec succès");
        }, 1500);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    toast.success("Profil mis à jour avec succès");
  };

  const updatePassword = () => {
    toast.success("Mot de passe mis à jour avec succès");
  };
  
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={avatar} alt="Photo de profil" />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                      <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-4 w-4" />
                    </div>
                  )}
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
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+228 XX XX XX XX"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Input 
                          id="country" 
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Textarea 
                        id="address" 
                        placeholder="Votre adresse complète"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Parlez un peu de vous..."
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={saveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer les modifications
                    </Button>
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
                    <Button onClick={updatePassword}>
                      <Lock className="h-4 w-4 mr-2" />
                      Mettre à jour le mot de passe
                    </Button>
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notifications par email</h3>
                          <p className="text-sm text-gray-500">Recevoir des notifications sur les réservations</p>
                        </div>
                        <Switch id="email-notifications" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notifications push</h3>
                          <p className="text-sm text-gray-500">Recevoir des notifications sur votre navigateur</p>
                        </div>
                        <Switch id="push-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Mode sombre</h3>
                          <p className="text-sm text-gray-500">Utiliser le thème sombre pour l'interface</p>
                        </div>
                        <Switch id="dark-mode" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Check className="h-4 w-4 mr-2" />
                      Enregistrer les préférences
                    </Button>
                  </CardFooter>
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
