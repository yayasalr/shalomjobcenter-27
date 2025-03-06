
import React, { useState, useRef, useEffect } from 'react';
import { Search, FileSearch, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openAdvancedSearch: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  openAdvancedSearch,
  placeholder = "Rechercher..."
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [searchInName, setSearchInName] = useState(true);
  const [searchInMessages, setSearchInMessages] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mettre le focus sur l'input lorsqu'on ouvre les options
  useEffect(() => {
    if (isOptionsOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOptionsOpen]);

  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            ref={inputRef}
            className="pl-9 pr-8" 
            placeholder={placeholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Popover open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-3">
              <h4 className="font-medium">Options de recherche</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="search-in-name" 
                    checked={searchInName} 
                    onCheckedChange={(checked) => setSearchInName(!!checked)} 
                  />
                  <Label htmlFor="search-in-name">Noms d'utilisateurs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="search-in-messages" 
                    checked={searchInMessages} 
                    onCheckedChange={(checked) => setSearchInMessages(!!checked)}
                  />
                  <Label htmlFor="search-in-messages">Contenu des messages</Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          variant="outline" 
          size="icon"
          onClick={openAdvancedSearch}
          className="h-10 w-10"
        >
          <FileSearch className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
