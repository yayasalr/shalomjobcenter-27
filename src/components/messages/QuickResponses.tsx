
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddNewResponse = () => {
    if (!newResponse.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }
    
    onAddResponse(newResponse.trim());
    setNewResponse('');
    setIsDialogOpen(false);
    toast.success("Réponse rapide ajoutée");
  };

  if (responses.length === 0) {
    return null;
  }

  return (
    <div className="quick-responses">
      {responses.map((response, index) => (
        <div 
          key={index} 
          className="quick-response-chip flex items-center" 
          onClick={() => onSelectResponse(response)}
        >
          <span className="mr-1 truncate max-w-[150px]">{response}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 p-0 ml-1 hover:bg-gray-200 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveResponse(index);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 py-1 h-auto rounded-full"
          >
            <PlusCircle className="h-3 w-3" />
            <span className="text-xs">Nouvelle</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une réponse rapide</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              placeholder="Saisissez votre réponse rapide..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddNewResponse}>
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
