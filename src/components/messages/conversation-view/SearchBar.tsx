
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
  onClose
}) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 border-b">
      <Input
        placeholder="Rechercher dans la conversation..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
        autoFocus
      />
      {searchQuery && (
        <Button variant="ghost" size="icon" onClick={clearSearch}>
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SearchBar;
