
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Plus, MessageSquare, X } from 'lucide-react';

interface QuickResponsesProps {
  responses: string[];
  onSelectResponse: (text: string) => void;
  onAddResponse: (text: string) => void;
  onRemoveResponse: (index: number) => void;
}

export const QuickResponses: React.FC<QuickResponsesProps> = ({
  responses,
  onSelectResponse,
  onAddResponse,
  onRemoveResponse
}) => {
  const [newResponse, setNewResponse] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddResponse = () => {
    if (newResponse.trim()) {
      onAddResponse(newResponse.trim());
      setNewResponse('');
      setIsAddingNew(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:bg-gray-200 rounded-full"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-2">
          <h3 className="font-medium">Réponses rapides</h3>
          <div className="max-h-60 overflow-y-auto">
            {responses.map((response, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Button
                  variant="outline"
                  className="flex-1 h-auto justify-start p-2 text-sm text-left"
                  onClick={() => onSelectResponse(response)}
                >
                  <span className="truncate">{response}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => onRemoveResponse(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {isAddingNew ? (
            <div className="mt-2 space-y-2">
              <Input
                placeholder="Nouvelle réponse rapide..."
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddResponse();
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setNewResponse('');
                    setIsAddingNew(false);
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleAddResponse}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setIsAddingNew(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une réponse
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
