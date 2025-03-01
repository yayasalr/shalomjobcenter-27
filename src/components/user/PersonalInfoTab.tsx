
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PersonalInfoTabProps {
  user: User | null;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ user }) => {
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

  const saveProfile = () => {
    // Sauvegarder les données du profil
    localStorage.setItem('userProfileData', JSON.stringify(formData));
    toast.success("Profil mis à jour avec succès");
  };

  return (
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
        <Button onClick={saveProfile} className="bg-sholom-primary hover:bg-sholom-primary/90 text-white font-medium w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </CardFooter>
    </Card>
  );
};
