
import React from 'react';
import { Conversation } from './types';
import { ChevronLeft, MoreVertical, Search, Star, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ConversationHeaderProps {
  conversation: Conversation;
  isOnline: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onShowFavorites?: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  conversation, 
  isOnline,
  onBack,
  onSearch,
  onShowFavorites
}) => {
  return (
    <div className="flex items-center p-2 border-b bg-white">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-1 lg:hidden">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      
      <Avatar className="h-10 w-10 mr-3 relative">
        <AvatarImage src={conversation.with.avatar} alt={conversation.with.name} />
        <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{conversation.with.name}</div>
        <div className="text-xs text-gray-500">
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => {}}>
          <Phone className="h-5 w-5" />
          <span className="sr-only">Appeler</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => {}}>
          <Video className="h-5 w-5" />
          <span className="sr-only">Vidéo</span>
        </Button>
        
        <Button variant="ghost" size="icon" onClick={onSearch}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Rechercher</span>
        </Button>
        
        <Button variant="ghost" size="icon" onClick={onShowFavorites}>
          <Star className="h-5 w-5" />
          <span className="sr-only">Favoris</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Plus d'options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSearch}>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShowFavorites}>
              <Star className="h-4 w-4 mr-2" />
              Messages favoris
            </DropdownMenuItem>
            <DropdownMenuItem>
              Bloquer
            </DropdownMenuItem>
            <DropdownMenuItem>
              Supprimer la conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ConversationHeader;
