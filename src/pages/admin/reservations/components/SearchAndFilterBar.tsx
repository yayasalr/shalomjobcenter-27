
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from 'lucide-react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  contentTab: string;
  setContentTab: (tab: string) => void;
  tab: string;
  setTab: (tab: string) => void;
  onExport: () => void;
  itemCount: number;
  itemType: string;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  contentTab,
  setContentTab,
  tab,
  setTab,
  onExport,
  itemCount,
  itemType
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des demandes</h1>
          <p className="text-gray-500 mt-1">
            {itemCount} {itemType}(s)
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
          <TabsList className="bg-white border">
            <TabsTrigger value="reservations" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
              Réservations
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
              Candidatures
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 h-9 w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchQuery('')}
              className="gap-2"
            >
              Effacer
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            Toutes
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmées
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées
          </TabsTrigger>
          {contentTab === 'applications' && (
            <TabsTrigger value="approved">
              Acceptées
            </TabsTrigger>
          )}
          {contentTab === 'applications' && (
            <TabsTrigger value="rejected">
              Refusées
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </>
  );
};

export default SearchAndFilterBar;
