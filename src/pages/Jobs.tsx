
import React from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Job, JobContract } from '@/types/job';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Search, Filter } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const Jobs = () => {
  const { jobs, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<string>('all');
  const [selectedContract, setSelectedContract] = React.useState<string>('all');
  const [selectedLocation, setSelectedLocation] = React.useState<string>('all');
  const [salaryRange, setSalaryRange] = React.useState([0, 5000]);
  const [sortBy, setSortBy] = React.useState<'newest' | 'salary'>('newest');
  const [showExpired, setShowExpired] = React.useState(false);
  const navigate = useNavigate();

  const locations = React.useMemo(() => {
    return ['all', ...new Set(jobs.map(job => job.location))];
  }, [jobs]);

  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === 'all' ? true : job.domain === selectedDomain;
      const matchesContract = selectedContract === 'all' ? true : job.contract === selectedContract;
      const matchesLocation = selectedLocation === 'all' ? true : job.location === selectedLocation;
      const matchesSalary = job.salary.amount >= salaryRange[0] && job.salary.amount <= salaryRange[1];
      const isActive = showExpired ? true : job.status === 'active';
      return matchesSearch && matchesDomain && matchesContract && matchesLocation && matchesSalary && isActive;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      } else {
        return b.salary.amount - a.salary.amount;
      }
    });
  }, [jobs, searchTerm, selectedDomain, selectedContract, selectedLocation, salaryRange, sortBy, showExpired]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Offres d'emploi disponibles</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher des offres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par domaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les domaines</SelectItem>
              <SelectItem value="residential_security">Sécurité résidentielle</SelectItem>
              <SelectItem value="industrial_security">Sécurité industrielle</SelectItem>
              <SelectItem value="construction_security">Sécurité de chantier</SelectItem>
              <SelectItem value="event_security">Sécurité événementielle</SelectItem>
              <SelectItem value="k9_security">Sécurité cynophile</SelectItem>
              <SelectItem value="security_consulting">Conseil en sécurité</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres avancés
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Type de contrat</h4>
                  <Select value={selectedContract} onValueChange={setSelectedContract}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les contrats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les contrats</SelectItem>
                      <SelectItem value="full_time">Temps plein</SelectItem>
                      <SelectItem value="part_time">Temps partiel</SelectItem>
                      <SelectItem value="contract">Contrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Localisation</h4>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les localisations" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location === 'all' ? 'Toutes les localisations' : location}
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
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{salaryRange[0]}€</span>
                    <span>{salaryRange[1]}€</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-expired"
                    checked={showExpired}
                    onCheckedChange={(checked) => setShowExpired(checked as boolean)}
                  />
                  <Label htmlFor="show-expired">Afficher les offres expirées</Label>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Trier par</h4>
                  <Select value={sortBy} onValueChange={(value: 'newest' | 'salary') => setSortBy(value)}>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </CardDescription>
                </div>
                <Badge variant={job.status === 'active' ? 'secondary' : 'destructive'}>
                  {job.contract === 'full_time' ? 'Temps plein' :
                   job.contract === 'part_time' ? 'Temps partiel' : 'Contrat'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.positions} poste{job.positions > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Date limite: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                <div className="w-full mt-2">
                  <span className="font-medium">{job.salary.amount}€ / mois</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full"
                onClick={() => navigate(`/emploi/${job.id}`)}
                variant={job.status === 'active' ? 'default' : 'outline'}
              >
                {job.status === 'active' ? 'Voir l\'offre' : 'Offre expirée'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune offre d'emploi ne correspond à vos critères</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
