
import React from 'react';
import { Building, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobActionButtonsProps {
  isHousingOffer: boolean;
  status: string;
  onApply: () => void;
  onShare: () => void;
}

const JobActionButtons = ({ 
  isHousingOffer, 
  status, 
  onApply, 
  onShare 
}: JobActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      <Button 
        className="bg-sholom-primary hover:bg-sholom-primary/90 text-white"
        onClick={onApply}
        disabled={status !== 'active'}
      >
        {isHousingOffer ? (
          <>
            <Building className="mr-2 h-5 w-5" />
            Réserver ce logement
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Postuler maintenant
          </>
        )}
      </Button>
      <Button variant="outline" onClick={onShare}>
        <Share2 className="mr-2 h-5 w-5" />
        Partager
      </Button>
    </div>
  );
};

export default JobActionButtons;
