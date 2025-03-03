
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X } from 'lucide-react';
import { Conversation, Message } from '@/components/messages/types';

interface AdvancedSearchProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSearch: (query: string) => void;
  searchResults: Array<{conversation: Conversation, message: Message}>;
  onSelectResult: (conversationId: string) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  setIsOpen,
  onSearch,
  searchResults,
  onSelectResult
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchInSender, setSearchInSender] = useState(true);
  const [searchInContent, setSearchInContent] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Recherche avancée</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher des messages..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="searchInSender" 
                checked={searchInSender} 
                onCheckedChange={(checked) => 
                  setSearchInSender(checked === true)
                }
              />
              <Label htmlFor="searchInSender">Expéditeur</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="searchInContent" 
                checked={searchInContent} 
                onCheckedChange={(checked) => 
                  setSearchInContent(checked === true)
                }
              />
              <Label htmlFor="searchInContent">Contenu du message</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="onlyUnread" 
                checked={onlyUnread} 
                onCheckedChange={(checked) => 
                  setOnlyUnread(checked === true)
                }
              />
              <Label htmlFor="onlyUnread">Messages non lus uniquement</Label>
            </div>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 max-h-[300px] overflow-y-auto border rounded-md">
              <div className="p-2 bg-muted font-medium">
                {searchResults.length} résultat(s) trouvé(s)
              </div>
              {searchResults.map((result, index) => (
                <div 
                  key={index}
                  className="p-3 border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onSelectResult(result.conversation.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{result.conversation.with.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(result.message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-1">
                    {result.message.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
