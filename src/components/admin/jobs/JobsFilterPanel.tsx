
import React from 'react';
import { SearchInput } from './filters/SearchInput';
import { FilterPopover } from './filters/FilterPopover';
import { ClearButton } from './filters/ClearButton';

interface JobsFilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showExpired: boolean;
  setShowExpired: (show: boolean) => void;
  domainFilter: string;
  setDomainFilter: (domain: string) => void;
  getDomainName: (domain: string) => string;
}

export const JobsFilterPanel: React.FC<JobsFilterPanelProps> = ({
  searchTerm,
  setSearchTerm,
  showExpired,
  setShowExpired,
  domainFilter,
  setDomainFilter,
  getDomainName
}) => {
  return (
    <div className="flex items-center gap-2">
      <SearchInput 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <FilterPopover 
        showExpired={showExpired}
        setShowExpired={setShowExpired}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        getDomainName={getDomainName}
      />
      
      <ClearButton 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};
