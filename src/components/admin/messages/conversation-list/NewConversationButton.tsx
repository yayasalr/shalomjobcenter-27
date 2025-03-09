
import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
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
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={handleCreateNewConversation}
        >
          <MessageSquare className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>
    </>
  );
};

export default NewConversationButton;
