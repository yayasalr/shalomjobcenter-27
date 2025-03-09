
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
      <div className="p-3 border-t bg-gray-50">
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleCreateNewConversation}
        >
          <Plus className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>
      
      {/* Alternative bottom button for mobile */}
      <div className="md:hidden p-3 border-t bg-white">
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-center"
          onClick={handleCreateNewConversation}
        >
          <Users className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>
    </>
  );
};

export default NewConversationButton;
