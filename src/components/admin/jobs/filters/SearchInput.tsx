
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 h-9 w-[200px] lg:w-[300px] bg-white"
      />
    </div>
  );
};
