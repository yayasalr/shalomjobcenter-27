
import React from 'react';
import { Search, FileSearch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openAdvancedSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  openAdvancedSearch
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          className="pl-9" 
          placeholder="Rechercher..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        size="icon"
        onClick={openAdvancedSearch}
        className="h-10 w-10"
      >
        <FileSearch className="h-4 w-4" />
      </Button>
    </div>
  );
};
