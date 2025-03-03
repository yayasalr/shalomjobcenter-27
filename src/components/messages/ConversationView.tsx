
import React, { useState } from 'react';
import { Conversation } from './types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import WhatsAppHeader from './WhatsAppHeader';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { toast } from 'sonner';

interface ConversationViewProps {
  conversation: Conversation;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline?: boolean;
  onBack?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isOnline = Math.random() > 0.5, // Simulation aléatoire de l'état en ligne
  onBack
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleProfileImageUpload = (file: File) => {
    setIsUploading(true);
    
    // This would normally upload the image to a server
    setTimeout(() => {
      toast.success("Photo de profil mise à jour");
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="col-span-2 flex flex-col h-full whatsapp-container md:rounded-r-lg">
      <WhatsAppHeader 
        conversation={conversation} 
        isOnline={isOnline} 
        onBack={onBack}
        onViewProfile={handleViewProfile}
      />
      
      <MessageList conversation={conversation} />
      
      <MessageInput 
        newMessage={newMessage} 
        setNewMessage={setNewMessage} 
        handleSendMessage={handleSendMessage} 
      />
      
      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4 py-2 pb-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <ImageUploader
                  variant="avatar"
                  currentImage={conversation.with.avatar || '/placeholder.svg'}
                  onImageUpload={handleProfileImageUpload}
                  isUploading={isUploading}
                  previewClassName="h-28 w-28"
                />
              </div>
              
              <h2 className="text-xl font-bold">{conversation.with.name}</h2>
              
              {conversation.with.email && (
                <p className="text-sm text-gray-500">{conversation.with.email}</p>
              )}
              
              <div className="text-sm text-gray-500">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">À propos</h3>
              <p className="text-gray-600">Disponible</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Médias, liens et docs</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  Aucun média
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationView;
