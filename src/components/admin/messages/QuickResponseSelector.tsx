
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface QuickResponseSelectorProps {
  responses: string[];
  onSelect: (text: string) => void;
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
}

export const QuickResponseSelector: React.FC<QuickResponseSelectorProps> = ({
  responses,
  onSelect,
  onAdd,
  onRemove
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {responses.map((response, index) => (
        <div 
          key={index} 
          className="flex items-center bg-blue-50 rounded-md px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 border border-blue-200"
          onClick={() => onSelect(response)}
        >
          <span className="mr-1 truncate max-w-[150px]">{response}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 p-0 ml-1 hover:bg-blue-200 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-md px-3 py-1 h-auto bg-gray-50"
        onClick={() => {
          const response = prompt("Ajouter une réponse rapide:");
          if (response && response.trim()) {
            onAdd(response.trim());
          }
        }}
      >
        <Plus className="h-3 w-3 mr-1" />
        <span className="text-xs">Nouvelle</span>
      </Button>
    </div>
  );
};
