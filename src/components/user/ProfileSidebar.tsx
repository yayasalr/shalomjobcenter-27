
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { toast } from 'sonner';

interface ProfileSidebarProps {
  user: UserType | null;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  const [avatar, setAvatar] = useState(user?.avatar || "/placeholder.svg");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (file: File) => {
    setIsUploading(true);
    
    // Create a URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // Simulate upload delay
        setTimeout(() => {
          setAvatar(event.target.result as string);
          setIsUploading(false);
          toast.success("Photo de profil mise à jour avec succès");
        }, 1500);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto relative mb-4 group">
          <ImageUploader
            currentImage={avatar}
            onImageUpload={handleImageUpload}
            isUploading={isUploading}
            variant="avatar"
            label="Photo de profil"
            maxSizeMB={5}
          />
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
  );
};
