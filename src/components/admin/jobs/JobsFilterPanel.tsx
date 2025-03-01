
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-white border-gray-300">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white z-50 shadow-lg border border-gray-200">
          <div className="space-y-4">
            <h4 className="font-medium">Filtres</h4>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Domaine</h5>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={domainFilter === 'all' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setDomainFilter('all')}
                >
                  Tous
                </Badge>
                {['residential_security', 'bodyguard', 'event_security', 'k9_security', 'housing_offer'].map(domain => (
                  <Badge 
                    key={domain}
                    variant={domainFilter === domain ? 'default' : 'outline'} 
                    className="cursor-pointer"
                    onClick={() => setDomainFilter(domain)}
                  >
                    {getDomainName(domain)}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-expired"
                checked={showExpired}
                onChange={() => setShowExpired(!showExpired)}
                className="mr-2"
              />
              <label htmlFor="show-expired" className="text-sm">
                Afficher les offres expirées
              </label>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setDomainFilter('all');
                  setShowExpired(false);
                }}
                className="gap-2 bg-white"
              >
                <RefreshCw className="h-3 w-3" />
                Réinitialiser
              </Button>
              <Button 
                size="sm"
                onClick={() => document.body.click()} // Ferme le popover
                className="bg-sholom-primary hover:bg-sholom-primary/90"
              >
                Appliquer
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {searchTerm && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSearchTerm('')}
          className="gap-2"
        >
          Effacer
        </Button>
      )}
    </div>
  );
};
