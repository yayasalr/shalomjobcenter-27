
import React from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const Jobs = () => {
  const { jobs, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<string>('all');
  const navigate = useNavigate();

  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === 'all' ? true : job.domain === selectedDomain;
      return matchesSearch && matchesDomain && job.status === 'active';
    });
  }, [jobs, searchTerm, selectedDomain]);

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
      
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Rechercher des offres..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
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
                <Badge variant="secondary">
                  {job.contract === 'full_time' ? 'Temps plein' :
                   job.contract === 'part_time' ? 'Temps partiel' : 'Contrat'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Briefcase className="h-4 w-4" />
                <span>{job.positions} poste{job.positions > 1 ? 's' : ''}</span>
                <Clock className="h-4 w-4 ml-4" />
                <span>Date limite: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full"
                onClick={() => navigate(`/emploi/${job.id}`)}
              >
                Voir l'offre
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
