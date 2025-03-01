
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from 'lucide-react';
import { JobsFilterPanel } from './JobsFilterPanel';
import { JobsTable } from './JobsTable';
import { ListingsTable } from '../listings/ListingsTable';
import { Job } from '@/types/job';
import { Listing } from '@/types/listing';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showExpired: boolean;
  setShowExpired: (show: boolean) => void;
  domainFilter: string;
  setDomainFilter: (domain: string) => void;
  getDomainName: (domain: string) => string;
  isLoadingJobs: boolean;
  isLoadingListings: boolean;
  filteredJobs: Job[];
  filteredListings: Listing[];
  handleEditJob: (job: Job) => void;
  handleDeleteJob: (id: string) => void;
  handleEditListing: (listing: Listing) => void;
  handleDeleteListing: (id: string) => void;
  onCreateJob: () => void;
  onCreateListing: () => void;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  showExpired,
  setShowExpired,
  domainFilter,
  setDomainFilter,
  getDomainName,
  isLoadingJobs,
  isLoadingListings,
  filteredJobs,
  filteredListings,
  handleEditJob,
  handleDeleteJob,
  handleEditListing,
  handleDeleteListing,
  onCreateJob,
  onCreateListing
}) => {
  return (
    <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
        <TabsList className="bg-white border">
          <TabsTrigger value="jobs" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
            Offres d'emploi
          </TabsTrigger>
          <TabsTrigger value="listings" className="data-[state=active]:bg-sholom-primary data-[state=active]:text-white">
            Offres de logement
          </TabsTrigger>
        </TabsList>
        
        <JobsFilterPanel 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showExpired={showExpired}
          setShowExpired={setShowExpired}
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
          getDomainName={getDomainName}
        />
      </div>

      <TabsContent value="jobs" className="p-0 border-none">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingJobs ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
              </div>
              <p className="mt-2 text-gray-500">Chargement des offres d'emploi...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <JobsTable
              jobs={filteredJobs}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
            />
          ) : (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune offre d'emploi</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune offre d'emploi ne correspond à votre recherche.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={onCreateJob}
                  className="bg-sholom-primary hover:bg-sholom-primary/90 text-white gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Créer une nouvelle offre
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="listings" className="p-0 border-none">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingListings ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
              </div>
              <p className="mt-2 text-gray-500">Chargement des logements...</p>
            </div>
          ) : filteredListings.length > 0 ? (
            <ListingsTable
              listings={filteredListings}
              onEdit={handleEditListing}
              onDelete={handleDeleteListing}
            />
          ) : (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun logement</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun logement ne correspond à votre recherche.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={onCreateListing}
                  className="bg-sholom-primary hover:bg-sholom-primary/90 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un logement
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
