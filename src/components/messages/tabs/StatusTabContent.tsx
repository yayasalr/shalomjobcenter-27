
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, Camera, Image, Edit, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/shared/ImageUploader';

interface Status {
  id: number;
  user: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
}

interface StatusTabContentProps {
  statuses: Status[];
}

const StatusTabContent: React.FC<StatusTabContentProps> = ({ statuses }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [textStatus, setTextStatus] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  
  // Gérer la création de statut
  const handleCreateStatus = (type: 'photo' | 'text') => {
    if (type === 'photo') {
      // Afficher l'uploader d'image au lieu du toast
      setShowTextInput(false);
    } else {
      // Afficher le champ de texte pour le statut
      setShowTextInput(true);
    }
  };
  
  // Gérer l'envoi d'une image de statut
  const handleImageUpload = (file: File) => {
    setIsUploading(true);
    
    // Simuler un téléchargement
    setTimeout(() => {
      toast.success("Statut photo publié avec succès");
      setIsUploading(false);
    }, 1500);
  };
  
  // Gérer l'envoi d'un statut texte
  const handleTextStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textStatus.trim()) return;
    
    toast.success("Statut texte publié avec succès");
    setTextStatus('');
    setShowTextInput(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Section pour créer un statut */}
      <div className="p-3 bg-white border-b">
        <div className="flex items-center mb-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Plus className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Mon statut</p>
            <p className="text-xs text-gray-500">Appuyez pour ajouter un statut</p>
          </div>
        </div>
        
        {showTextInput ? (
          <form onSubmit={handleTextStatusSubmit} className="mt-3">
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={textStatus}
                onChange={(e) => setTextStatus(e.target.value)}
                placeholder="Écrivez votre statut ici..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Publier
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowTextInput(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex space-x-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-green-50 border-green-100 hover:bg-green-100 text-green-600"
              onClick={() => handleCreateStatus('photo')}
            >
              <Camera className="h-4 w-4 mr-1" />
              Photo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600"
              onClick={() => handleCreateStatus('text')}
            >
              <Edit className="h-4 w-4 mr-1" />
              Texte
            </Button>
          </div>
        )}
        
        {/* Afficher l'uploader d'image uniquement lorsque nécessaire */}
        {!showTextInput && (
          <div className="mt-3">
            <ImageUploader
              onImageUpload={handleImageUpload}
              isUploading={isUploading}
              label="Ajouter une photo pour votre statut"
              className="w-full"
              buttonVariant="outline"
              buttonSize="default"
            />
          </div>
        )}
      </div>
      
      {/* Liste des status */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Récents</h3>
          
          {statuses.length > 0 ? (
            <div className="space-y-3">
              {statuses.map((status) => (
                <div key={status.id} className="flex items-center">
                  <div className={`h-12 w-12 rounded-full border-2 ${status.isViewed ? 'border-gray-300' : 'border-green-500'} p-0.5`}>
                    <img 
                      src={status.avatar} 
                      alt={status.user} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{status.user}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                Aucun statut récent.<br />Les statuts disparaissent après 24 heures.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusTabContent;
