
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewConversationButtonProps {
  onClick: () => void;
}

const NewConversationButton: React.FC<NewConversationButtonProps> = ({ onClick }) => {
  return (
    <div className="p-3 border-t">
      <Button 
        onClick={onClick}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Nouvelle conversation
      </Button>
    </div>
  );
};

export default NewConversationButton;
