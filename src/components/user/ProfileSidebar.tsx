
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Camera } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProfileSidebarProps {
  user: UserType | null;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  const [avatar, setAvatar] = useState(user?.avatar || "/placeholder.svg");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
  );
};
