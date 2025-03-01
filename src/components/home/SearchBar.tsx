
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  primaryColor?: string;
}

export const SearchBar = ({ searchTerm, setSearchTerm, primaryColor }: SearchBarProps) => {
  return (
    <div id="all-listings" className="sticky top-20 z-10 bg-white py-4 border-b mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par quartier, titre..."
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            style={{ 
              borderColor: primaryColor,
              boxShadow: `0 0 0 0px ${primaryColor}`
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <Button 
            onClick={() => setSearchTerm("")}
            variant="outline"
            className="whitespace-nowrap"
          >
            Effacer la recherche
          </Button>
        )}
      </div>
    </div>
  );
};
