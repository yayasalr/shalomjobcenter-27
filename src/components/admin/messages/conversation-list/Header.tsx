
import React from 'react';
import { MoreVertical, UserPlus, Camera, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const handleUserPlus = () => {
    toast.info("Ajouter un utilisateur");
  };

  const handleCamera = () => {
    toast.info("Prendre une photo");
  };

  const handleMore = () => {
    toast.info("Plus d'options");
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500"
          onClick={handleCamera}
        >
          <Camera className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500"
          onClick={handleUserPlus}
        >
          <UserPlus className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500"
          onClick={handleMore}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
