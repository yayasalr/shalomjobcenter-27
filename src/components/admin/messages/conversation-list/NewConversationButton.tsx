
import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewConversationButtonProps {
  handleCreateNewConversation?: () => void;
}

export const NewConversationButton: React.FC<NewConversationButtonProps> = ({
  handleCreateNewConversation
}) => {
  return (
    <>
      <div className="p-3 bg-gray-50 border-t">
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleCreateNewConversation}
        >
          <Plus className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>
    </>
  );
};

export default NewConversationButton;
