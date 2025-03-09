
import React from 'react';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Conversation } from '@/components/messages/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ConversationHeaderProps {
  conversation: Conversation;
  isOnline: boolean;
  onBackClick: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  isOnline,
  onBackClick
}) => {
  return (
    <div className="whatsapp-header flex items-center gap-2 p-3">
      <Button 
        variant="ghost" 
        size="icon" 
        className="whatsapp-back-button text-white" 
        onClick={onBackClick}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center flex-1 gap-3">
        <div className="relative">
          <Avatar className="whatsapp-user-avatar h-10 w-10 border-2 border-white/10">
            <AvatarImage src={conversation.with.avatar || "/placeholder.svg"} alt={conversation.with.name} />
            <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className={isOnline ? "whatsapp-online-indicator" : "whatsapp-offline-indicator"}></div>
        </div>
        
        <div className="whatsapp-user-info text-white">
          <div className="font-semibold truncate">{conversation.with.name}</div>
          <div className="text-xs opacity-80">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => toast.success("Appel vidéo à venir")}>
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={() => toast.success("Appel vocal à venir")}>
          <Phone className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.success("Info contact")}>
              Info contact
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Médias partagés")}>
              Médias partagés
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Rechercher")}>
              Rechercher
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.success("Notifications")}>
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Messages éphémères")}>
              Messages éphémères
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.success("Bloquer l'utilisateur")}>
              Bloquer
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => toast.success("Conversation supprimée")}>
              Supprimer la conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
