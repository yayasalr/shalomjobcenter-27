
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobsList } from './JobsList';
import { JobsEmptyState } from './JobsEmptyState';
import { Job } from '@/types/job';
import { Search, Filter, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const JobsContent = () => {
  const { jobs, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [showHousingOnly, setShowHousingOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtrer les offres d'emploi selon les critères
  useEffect(() => {
    if (!jobs) return;
    
    setFilteredJobs(
      jobs.filter((job) => {
        // Filtrer par terme de recherche
        const searchMatch = 
          !searchTerm || 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        // Filtrer par domaine
        const domainMatch = domainFilter === 'all' || job.domain === domainFilter;
        
        // Filtrer par type d'offre (emploi ou logement)
        const typeMatch = !showHousingOnly || job.isHousingOffer;
        
        return searchMatch && domainMatch && typeMatch;
      })
    );
  }, [jobs, searchTerm, domainFilter, showHousingOnly]);

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Barre de recherche et filtres */}
      <div className="sticky top-20 z-10 bg-white rounded-xl shadow-sm p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un poste, un lieu..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </Button>
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
        
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <JobFilters 
              onDomainChange={setDomainFilter} 
              onHousingChange={setShowHousingOnly} 
              currentDomain={domainFilter}
              showHousingOnly={showHousingOnly}
            />
          </motion.div>
        )}
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold text-sholom-dark">
          {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''}
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${showHousingOnly ? 'bg-sholom-primary/10 text-sholom-primary' : ''}`}
            onClick={() => setShowHousingOnly(!showHousingOnly)}
          >
            <Home className={`h-4 w-4 mr-2 ${showHousingOnly ? 'text-sholom-primary' : ''}`} />
            Logements
          </Button>
        </div>
      </div>
      
      {/* Résultats de recherche */}
      {isLoading ? (
        <JobsLoadingSkeleton />
      ) : filteredJobs.length > 0 ? (
        <JobsList jobs={filteredJobs} />
      ) : (
        <JobsEmptyState 
          onResetFilters={() => {
            setSearchTerm('');
            setDomainFilter('all');
            setShowHousingOnly(false);
          }}
        />
      )}
    </div>
  );
};

// Loading Skeleton Component
const JobsLoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="animate-pulse bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 h-10 bg-gray-200 rounded"></div>
        <div className="mt-4 flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
    ))}
  </div>
);
