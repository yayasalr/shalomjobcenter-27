
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation } from './types';
import { useNavigate } from 'react-router-dom';

interface WhatsAppHeaderProps {
  conversation: Conversation;
  isOnline?: boolean;
  onBack?: () => void;
  onViewProfile?: () => void;
}

const WhatsAppHeader: React.FC<WhatsAppHeaderProps> = ({ 
  conversation, 
  isOnline = false,
  onBack,
  onViewProfile
}) => {
  const navigate = useNavigate();

  const handleVideoCall = () => {
    // This would typically navigate to a video call page
    window.alert("Fonctionnalité d'appel vidéo à venir");
  };

  const handleVoiceCall = () => {
    // This would typically initiate a voice call
    window.alert("Fonctionnalité d'appel vocal à venir");
  };

  const handleMoreOptions = () => {
    // This would open a dropdown with more options
    window.alert("Plus d'options à venir");
  };

  return (
    <div className="whatsapp-header">
      {onBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="whatsapp-back-button text-white"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <div 
        className="flex items-center flex-1 cursor-pointer" 
        onClick={onViewProfile || (() => window.alert("Affichage du profil à venir"))}
      >
        <div className="relative">
          <Avatar className="whatsapp-user-avatar">
            <AvatarImage src={conversation.with.avatar || '/placeholder.svg'} />
            <AvatarFallback>
              {conversation.with.name ? conversation.with.name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          {isOnline && <div className="whatsapp-online-indicator"></div>}
          {!isOnline && <div className="whatsapp-offline-indicator"></div>}
        </div>
        
        <div className="whatsapp-user-info">
          <h3 className="font-semibold text-white">{conversation.with.name}</h3>
          <div className="text-xs text-white/80">
            {isOnline ? 'En ligne' : 'Dernière connexion il y a 2 heures'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-white" onClick={handleVideoCall}>
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={handleVoiceCall}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={handleMoreOptions}>
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppHeader;
