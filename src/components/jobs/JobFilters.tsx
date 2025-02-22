
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { JobDomain, JobContract } from '@/types/job';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from "lucide-react";

interface FiltersState {
  search: string;
  domain: JobDomain | 'all';
  contract: JobContract | 'all';
  location: string | 'all';
  salaryRange: [number, number];
  showExpired: boolean;
  sortBy: 'newest' | 'salary';
}

interface JobFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  locations: string[];
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  locations,
}) => {
  const domainOptions: { value: JobDomain | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous les domaines' },
    { value: 'residential_security', label: 'Sécurité résidentielle' },
    { value: 'bodyguard', label: 'Garde du corps' },
    { value: 'private_property', label: 'Surveillance propriétés privées' },
    { value: 'industrial_security', label: 'Sécurité industrielle' },
    { value: 'office_security', label: 'Sécurité de bureau' },
    { value: 'security_patrol', label: 'Patrouilleur' },
    { value: 'access_control', label: 'Contrôle d\'accès' },
    { value: 'security_systems', label: 'Opérateur systèmes' },
    { value: 'construction_security', label: 'Sécurité chantier' },
    { value: 'site_supervisor', label: 'Surveillant travaux' },
    { value: 'security_coordinator', label: 'Coordinateur sécurité' },
    { value: 'event_security', label: 'Sécurité événementielle' },
    { value: 'k9_security', label: 'Sécurité cynophile' },
    { value: 'security_manager', label: 'Responsable sécurité' },
    { value: 'security_consultant', label: 'Consultant sécurité' },
    { value: 'security_trainer', label: 'Formateur sécurité' },
  ];

  const contractOptions: { value: JobContract | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous les contrats' },
    { value: 'full_time', label: 'Temps plein' },
    { value: 'part_time', label: 'Temps partiel' },
    { value: 'contract', label: 'Contrat' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher des offres..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Select 
          value={filters.domain} 
          onValueChange={(value: JobDomain | 'all') => onFiltersChange({ ...filters, domain: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par domaine" />
          </SelectTrigger>
          <SelectContent>
            {domainOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2" type="button">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Type de contrat</h4>
                <Select 
                  value={filters.contract} 
                  onValueChange={(value: JobContract | 'all') => 
                    onFiltersChange({ ...filters, contract: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les contrats" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Localisation</h4>
                <Select 
                  value={filters.location} 
                  onValueChange={(value) => onFiltersChange({ ...filters, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les localisations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les localisations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Fourchette de salaire (€)</h4>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={filters.salaryRange}
                  onValueChange={(value) => 
                    onFiltersChange({ ...filters, salaryRange: value as [number, number] })}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{filters.salaryRange[0]}€</span>
                  <span>{filters.salaryRange[1]}€</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-expired"
                  checked={filters.showExpired}
                  onCheckedChange={(checked) => 
                    onFiltersChange({ ...filters, showExpired: checked as boolean })}
                />
                <Label htmlFor="show-expired">Afficher les offres expirées</Label>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Trier par</h4>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value: 'newest' | 'salary') => 
                    onFiltersChange({ ...filters, sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récent</SelectItem>
                    <SelectItem value="salary">Salaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
