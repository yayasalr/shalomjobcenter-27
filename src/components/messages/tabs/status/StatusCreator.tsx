
import React, { useState } from 'react';
import { Camera, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusCreatorProps } from './types';
import TextStatusForm from './TextStatusForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const StatusCreator: React.FC<StatusCreatorProps> = ({ onStatusCreated }) => {
  const [creating, setCreating] = useState<'text' | 'image' | null>(null);
  const [textStatus, setTextStatus] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { loadData } = useLocalStorage();
  
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!textStatus.trim()) return;
    
    // Create a new status
    const currentUser = loadData('currentUser', { name: 'Moi', avatar: '/placeholder.svg' });
    
    const newStatus = {
      id: Date.now(),
      user: currentUser.name || 'Moi',
      avatar: currentUser.avatar || '/placeholder.svg',
      isViewed: false,
      timestamp: new Date(),
      content: textStatus
    };
    
    onStatusCreated(newStatus);
    
    // Reset form
    setTextStatus('');
    setCreating(null);
  };
  
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageSubmit = () => {
    if (!image) return;
    
    // Create a new status with image
    const currentUser = loadData('currentUser', { name: 'Moi', avatar: '/placeholder.svg' });
    
    const newStatus = {
      id: Date.now(),
      user: currentUser.name || 'Moi',
      avatar: currentUser.avatar || '/placeholder.svg',
      isViewed: false,
      timestamp: new Date(),
      image
    };
    
    onStatusCreated(newStatus);
    
    // Reset form
    setImage(null);
    setCreating(null);
  };
  
  const cancelCreation = () => {
    setTextStatus('');
    setImage(null);
    setCreating(null);
  };

  if (creating === 'text') {
    return (
      <TextStatusForm
        textStatus={textStatus}
        setTextStatus={setTextStatus}
        onSubmit={handleTextSubmit}
        onCancel={cancelCreation}
      />
    );
  }
  
  if (creating === 'image') {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Créer un statut avec une image</h3>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-500 h-8 w-8"
            onClick={cancelCreation}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {image ? (
          <div className="relative mb-4">
            <img 
              src={image} 
              alt="Status preview" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              className="absolute bottom-4 right-4 rounded-full"
              onClick={handleImageSubmit}
            >
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <label className="cursor-pointer bg-white p-10 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center">
              <Camera className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-gray-500">Sélectionner une image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelected}
              />
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-lg border-b">
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder.svg" alt="Your avatar" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <p className="font-medium">Mon statut</p>
          <div className="flex space-x-2 mt-1">
            <Button
              variant="outline"
              className="text-xs py-1 h-auto"
              onClick={() => setCreating('text')}
            >
              Ajouter du texte
            </Button>
            <Button
              variant="outline"
              className="text-xs py-1 h-auto"
              onClick={() => setCreating('image')}
            >
              Ajouter une photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCreator;
