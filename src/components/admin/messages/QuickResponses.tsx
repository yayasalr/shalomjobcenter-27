
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Send, Lightning } from 'lucide-react';

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
  const [open, setOpen] = useState(false);

  const handleAddResponse = () => {
    if (newResponse.trim()) {
      onAddResponse(newResponse);
      setNewResponse('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1">
          <Lightning className="h-4 w-4" />
          <span className="hidden sm:inline">Réponses rapides</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b bg-muted/50">
          <h3 className="font-medium">Réponses rapides</h3>
          <p className="text-xs text-muted-foreground">
            Cliquez sur une réponse pour l'utiliser
          </p>
        </div>
        
        <ScrollArea className="h-60 overflow-y-auto">
          {responses.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Aucune réponse rapide. Ajoutez-en une ci-dessous.
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {responses.map((response, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-muted rounded-md">
                  <div 
                    className="flex-1 cursor-pointer line-clamp-2 text-sm"
                    onClick={() => {
                      onSelectResponse(response);
                      setOpen(false);
                    }}
                  >
                    {response}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-1 opacity-70 hover:opacity-100"
                    onClick={() => onRemoveResponse(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex items-center p-3 border-t">
          <Input
            placeholder="Nouvelle réponse rapide..."
            value={newResponse}
            onChange={(e) => setNewResponse(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddResponse();
              }
            }}
          />
          <Button 
            size="sm"
            className="ml-2"
            onClick={handleAddResponse}
            disabled={!newResponse.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
