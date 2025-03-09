
import React from 'react';
import { FavoriteMessage } from '@/hooks/messages/useFavoriteMessages';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, X, MessageSquare, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FavoriteMessagesProps {
  favorites: FavoriteMessage[];
  onRemoveFavorite: (messageId: string) => void;
  onNavigateToConversation: (conversationId: string) => void;
  onClose: () => void;
}

const FavoriteMessages: React.FC<FavoriteMessagesProps> = ({
  favorites,
  onRemoveFavorite,
  onNavigateToConversation,
  onClose
}) => {
  if (favorites.length === 0) {
    return (
      <Card className="w-full max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Messages Favoris</CardTitle>
            <CardDescription>Sauvegardez des messages importants ici</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-center text-gray-500">
            Vous n'avez pas encore de messages favoris. 
            <br />
            Utilisez l'option "Ajouter aux favoris" dans le menu d'un message.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-h-[80vh] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Messages Favoris</CardTitle>
          <CardDescription>
            {favorites.length} {favorites.length === 1 ? 'message sauvegardé' : 'messages sauvegardés'}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[calc(80vh-4rem)]">
        <div className="space-y-4">
          {favorites.map(message => (
            <div key={message.id} className="border rounded-lg p-4 relative group">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{message.conversationName}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.timestamp), {
                    addSuffix: true,
                    locale: fr
                  })}
                </div>
              </div>
              <p className="text-sm mb-4">{message.content}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Sauvegardé {formatDistanceToNow(new Date(message.savedAt), {
                    addSuffix: true,
                    locale: fr
                  })}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8"
                    onClick={() => onNavigateToConversation(message.conversationId)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Voir conversation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8"
                    onClick={() => onRemoveFavorite(message.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Retirer des favoris</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteMessages;
