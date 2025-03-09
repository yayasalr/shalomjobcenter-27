
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, Camera, Edit, ImageIcon, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { Textarea } from '@/components/ui/textarea';

interface Status {
  id: number;
  user: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
  content?: string;
  image?: string;
}

interface StatusTabContentProps {
  statuses: Status[];
}

const StatusTabContent: React.FC<StatusTabContentProps> = ({ statuses: initialStatuses }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [textStatus, setTextStatus] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>(initialStatuses);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Gérer la création de statut
  const handleCreateStatus = (type: 'photo' | 'text') => {
    if (type === 'photo') {
      // Afficher l'uploader d'image au lieu du toast
      setShowTextInput(false);
    } else {
      // Afficher le champ de texte pour le statut
      setShowTextInput(true);
      setSelectedImage(null);
    }
  };
  
  // Gérer l'envoi d'une image de statut
  const handleImageUpload = (file: File) => {
    setIsUploading(true);
    
    // Créer une URL pour l'image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    
    // Simuler un téléchargement
    setTimeout(() => {
      setIsUploading(false);
    }, 1000);
  };
  
  // Publier le statut avec image
  const publishImageStatus = () => {
    if (!selectedImage) return;
    
    // Ajouter le nouveau statut à la liste
    const newStatus: Status = {
      id: Date.now(),
      user: "Vous",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(),
      image: selectedImage
    };
    
    setStatuses([newStatus, ...statuses]);
    setSelectedImage(null);
    
    toast.success("Statut photo publié avec succès");
  };
  
  // Gérer l'envoi d'un statut texte
  const handleTextStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textStatus.trim()) return;
    
    // Ajouter le nouveau statut à la liste
    const newStatus: Status = {
      id: Date.now(),
      user: "Vous",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(),
      content: textStatus
    };
    
    setStatuses([newStatus, ...statuses]);
    setTextStatus('');
    setShowTextInput(false);
    
    toast.success("Statut texte publié avec succès");
  };
  
  // Annuler la publication
  const cancelPublication = () => {
    setShowTextInput(false);
    setTextStatus('');
    setSelectedImage(null);
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
        
        {/* Interface de publication d'image */}
        {selectedImage && (
          <div className="mt-3 flex flex-col space-y-3">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-full object-contain max-h-64"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={publishImageStatus}
              >
                <Send className="h-4 w-4 mr-1" />
                Publier
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={cancelPublication}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
        
        {/* Formulaire de statut texte */}
        {showTextInput ? (
          <form onSubmit={handleTextStatusSubmit} className="mt-3">
            <div className="flex flex-col space-y-2">
              <Textarea
                value={textStatus}
                onChange={(e) => setTextStatus(e.target.value)}
                placeholder="Écrivez votre statut ici..."
                className="min-h-[100px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Publier
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={cancelPublication}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </form>
        ) : (
          !selectedImage && (
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
          )
        )}
        
        {/* Afficher l'uploader d'image uniquement lorsque nécessaire */}
        {!showTextInput && !selectedImage && (
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
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{status.user}</p>
                    <p className="text-xs text-gray-500">
                      {status.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {status.content && (
                    <div className="bg-gray-100 px-3 py-1 rounded text-sm max-w-[150px] truncate">
                      {status.content}
                    </div>
                  )}
                  {status.image && (
                    <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                      <img src={status.image} alt="Status" className="h-full w-full object-cover" />
                    </div>
                  )}
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
