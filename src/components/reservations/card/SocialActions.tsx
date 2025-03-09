
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useLanguage } from '@/hooks/language';
import { useSocialInteractions } from '@/hooks/useSocialInteractions';

interface SocialActionsProps {
  listingId: string;
  onComment: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

export const SocialActions = ({ 
  listingId, 
  onComment, 
  onShare 
}: SocialActionsProps) => {
  const { t } = useLanguage();
  const { toggleLike, hasUserLiked } = useSocialInteractions();
  
  const userHasLiked = hasUserLiked('listing', listingId);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike.mutate({
      type: 'listing',
      itemId: listingId
    });
  };
  
  return (
    <div className="flex justify-between items-center pt-3 mt-3 border-t">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 px-2 ${userHasLiked ? 'text-red-500' : ''}`}
        onClick={handleLike}
      >
        <Heart className={`h-4 w-4 ${userHasLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span>{t('like') || 'J\'aime'}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 px-2"
        onClick={onComment}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{t('comment') || 'Commenter'}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 px-2"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
        <span>{t('share') || 'Partager'}</span>
      </Button>
    </div>
  );
};
