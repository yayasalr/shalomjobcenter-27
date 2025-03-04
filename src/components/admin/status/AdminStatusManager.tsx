
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ImageUploader } from '@/components/shared/image-uploader/ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Megaphone, EyeIcon, Upload, LayoutTemplate, Shield } from 'lucide-react';

export interface StatusMessage {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  active: boolean;
  type: 'announcement' | 'promotion' | 'info' | 'alert';
  backgroundColor?: string;
  textColor?: string;
}

export const AdminStatusManager = () => {
  const { toast } = useToast();
  const [statusMessages, setStatusMessages] = useLocalStorage<StatusMessage[]>('admin-status-messages', []);
  const [newStatusText, setNewStatusText] = useState('');
  const [statusType, setStatusType] = useState<'announcement' | 'promotion' | 'info' | 'alert'>('announcement');
  const [statusImage, setStatusImage] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#f97316'); // Default orange color
  const [textColor, setTextColor] = useState('#ffffff'); // Default white text
  const [isPreview, setIsPreview] = useState(false);

  const handleImageUpload = (file: File) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStatusImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const handlePublish = () => {
    if (!newStatusText.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez saisir un texte pour le statut",
        variant: "destructive"
      });
      return;
    }

    const newStatus: StatusMessage = {
      id: Date.now().toString(),
      text: newStatusText.trim(),
      imageUrl: statusImage,
      createdAt: new Date().toISOString(),
      active: true,
      type: statusType,
      backgroundColor,
      textColor
    };

    setStatusMessages([newStatus, ...statusMessages]);
    
    // Reset form
    setNewStatusText('');
    setStatusImage(undefined);
    setIsPreview(false);
    
    toast({
      title: "Statut publié",
      description: "Votre statut a été publié avec succès"
    });
  };

  const toggleStatusActive = (id: string) => {
    setStatusMessages(
      statusMessages.map(status => 
        status.id === id ? { ...status, active: !status.active } : status
      )
    );
    
    toast({
      title: "Statut mis à jour",
      description: "Le statut a été mis à jour avec succès"
    });
  };

  const deleteStatus = (id: string) => {
    setStatusMessages(statusMessages.filter(status => status.id !== id));
    
    toast({
      title: "Statut supprimé",
      description: "Le statut a été supprimé avec succès"
    });
  };

  const getTypeIcon = (type: 'announcement' | 'promotion' | 'info' | 'alert') => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="h-5 w-5" />;
      case 'promotion':
        return <LayoutTemplate className="h-5 w-5" />;
      case 'info':
        return <Shield className="h-5 w-5" />;
      case 'alert':
        return <Shield className="h-5 w-5 text-red-500" />;
      default:
        return <Megaphone className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-sholom-primary" />
            Créer un nouveau statut
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="status-text">Texte du statut</Label>
                <Textarea
                  id="status-text"
                  value={newStatusText}
                  onChange={(e) => setNewStatusText(e.target.value)}
                  placeholder="Saisissez votre annonce ici..."
                  className="h-32"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bg-color">Couleur de fond</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="color" 
                      id="bg-color" 
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-10 h-10 border-0 rounded-md"
                    />
                    <span className="text-sm text-gray-500">{backgroundColor}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="text-color">Couleur du texte</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="color" 
                      id="text-color" 
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 border-0 rounded-md"
                    />
                    <span className="text-sm text-gray-500">{textColor}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="status-type">Type de statut</Label>
                <select
                  id="status-type"
                  value={statusType}
                  onChange={(e) => setStatusType(e.target.value as any)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="announcement">Annonce</option>
                  <option value="promotion">Promotion</option>
                  <option value="info">Information</option>
                  <option value="alert">Alerte</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label className="block mb-2">Image (optionnelle)</Label>
              <ImageUploader
                currentImage={statusImage}
                onImageUpload={handleImageUpload}
                onImageRemove={() => setStatusImage(undefined)}
                isUploading={isUploading}
                variant="featured"
                label="Ajouter une image"
                className="w-full h-32"
              />
            </div>
          </div>
          
          {isPreview && (
            <div className="mt-4">
              <Label className="block mb-2">Aperçu</Label>
              <div 
                className="p-4 rounded-md flex items-center gap-3 overflow-hidden"
                style={{ backgroundColor, color: textColor }}
              >
                {getTypeIcon(statusType)}
                <div className="flex-1">{newStatusText}</div>
                {statusImage && (
                  <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                    <img src={statusImage} alt="Status preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsPreview(!isPreview)}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            {isPreview ? "Masquer l'aperçu" : "Aperçu"}
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={!newStatusText.trim()}
          >
            <Megaphone className="h-4 w-4 mr-2" />
            Publier
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Statuts récents</h3>
        {statusMessages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun statut publié</p>
        ) : (
          <div className="space-y-3">
            {statusMessages.map((status) => (
              <Card key={status.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className={`p-2 rounded-md flex-shrink-0 ${
                        status.active ? 'opacity-100' : 'opacity-50'
                      }`}
                      style={{ backgroundColor: status.backgroundColor, color: status.textColor }}
                    >
                      {getTypeIcon(status.type)}
                    </div>
                    
                    <div className={`flex-1 ${status.active ? '' : 'opacity-50'}`}>
                      <p className="font-medium">{status.text}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(status.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {status.imageUrl && (
                      <div className={`h-12 w-12 rounded-md overflow-hidden flex-shrink-0 ${
                        status.active ? '' : 'opacity-50'
                      }`}>
                        <img src={status.imageUrl} alt="Status" className="h-full w-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`switch-${status.id}`}
                          checked={status.active}
                          onCheckedChange={() => toggleStatusActive(status.id)}
                        />
                        <Label htmlFor={`switch-${status.id}`} className="text-xs">
                          {status.active ? 'Actif' : 'Inactif'}
                        </Label>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 h-8 w-8 p-0"
                        onClick={() => deleteStatus(status.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
