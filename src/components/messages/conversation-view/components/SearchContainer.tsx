
import React from 'react';
import SearchBar from '../SearchBar';

interface SearchContainerProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  showSearch,
  setShowSearch,
  searchQuery,
  setSearchQuery,
  clearSearch
}) => {
  if (!showSearch) return null;
  
  return (
    <SearchBar 
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      clearSearch={clearSearch}
      onClose={() => setShowSearch(false)}
    />
  );
};

export default SearchContainer;
