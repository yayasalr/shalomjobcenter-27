
import React from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Job, JobContract } from '@/types/job';
import { useListings } from '@/hooks/useListings';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Search, Filter, Home, Bed, Bath } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Jobs = () => {
  const { jobs, isLoading: isLoadingJobs } = useJobs();
  const { listings, isLoading: isLoadingListings } = useListings();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<string>('all');
  const [selectedContract, setSelectedContract] = React.useState<string>('all');
  const [selectedLocation, setSelectedLocation] = React.useState<string>('all');
  const [salaryRange, setSalaryRange] = React.useState([0, 5000]);
  const [priceRange, setPriceRange] = React.useState([0, 3000]);
  const [sortBy, setSortBy] = React.useState<'newest' | 'salary'>('newest');
  const [showExpired, setShowExpired] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  const navigate = useNavigate();

  const locations = React.useMemo(() => {
    return ['all', ...new Set(jobs.map(job => job.location))];
  }, [jobs]);

  // Convertir les annonces de logement en format emploi pour l'affichage unifié
  const housingAsJobs = React.useMemo(() => {
    return listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      domain: 'housing_offer' as const,
      description: listing.description || '',
      requirements: '',
      contract: 'full_time' as const,
      location: listing.location,
      salary: {
        amount: listing.price,
        currency: '€/mois'
      },
      positions: 1,
      publishDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      status: 'active' as const,
      images: listing.images,
      price: listing.price,
      bedrooms: 2,
      bathrooms: 1,
      isHousingOffer: true
    }));
  }, [listings]);

  // Combiner offres d'emploi et logements
  const allOffers = React.useMemo(() => {
    return [...jobs, ...housingAsJobs];
  }, [jobs, housingAsJobs]);

  const filteredOffers = React.useMemo(() => {
    return allOffers.filter(offer => {
      // Filtrer par type (emploi/logement/tous)
      if (activeTab === 'jobs' && offer.isHousingOffer) return false;
      if (activeTab === 'housing' && !offer.isHousingOffer) return false;
      
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === 'all' ? true : offer.domain === selectedDomain;
      const matchesContract = selectedContract === 'all' ? true : offer.contract === selectedContract;
      const matchesLocation = selectedLocation === 'all' ? true : offer.location === selectedLocation;
      
      const matchesSalaryOrPrice = offer.isHousingOffer 
        ? (offer.price && offer.price >= priceRange[0] && offer.price <= priceRange[1])
        : (offer.salary.amount >= salaryRange[0] && offer.salary.amount <= salaryRange[1]);
      
      const isActive = showExpired ? true : offer.status === 'active';
      
      return matchesSearch && matchesDomain && matchesContract && matchesLocation && matchesSalaryOrPrice && isActive;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      } else {
        if (a.isHousingOffer && b.isHousingOffer) {
          return (b.price || 0) - (a.price || 0);
        }
        return b.salary.amount - a.salary.amount;
      }
    });
  }, [allOffers, searchTerm, selectedDomain, selectedContract, selectedLocation, salaryRange, priceRange, sortBy, showExpired, activeTab]);

  if (isLoadingJobs || isLoadingListings) {
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
      <h1 className="text-3xl font-bold mb-8">Offres d'emploi et de logement disponibles</h1>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Toutes les offres</TabsTrigger>
          <TabsTrigger value="jobs">Emplois</TabsTrigger>
          <TabsTrigger value="housing">Logements</TabsTrigger>
        </TabsList>
      </Tabs>
      
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
          
          {activeTab !== 'housing' && (
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
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres avancés
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                {activeTab !== 'housing' && (
                  <>
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
                  </>
                )}

                {activeTab !== 'jobs' && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Fourchette de prix (€)</h4>
                    <Slider
                      min={0}
                      max={3000}
                      step={50}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{priceRange[0]}€</span>
                      <span>{priceRange[1]}€</span>
                    </div>
                  </div>
                )}

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
                      <SelectItem value="salary">{activeTab === 'housing' ? 'Prix' : 'Salaire'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{offer.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {offer.location}
                  </CardDescription>
                </div>
                <Badge variant={offer.isHousingOffer ? 'success' : 'default'}>
                  {offer.isHousingOffer 
                    ? 'Logement' 
                    : (offer.contract === 'full_time' ? 'Temps plein' :
                       offer.contract === 'part_time' ? 'Temps partiel' : 'Contrat')}
                </Badge>
              </div>
            </CardHeader>
            {offer.images && offer.images.length > 0 && (
              <div className="px-6">
                <img 
                  src={offer.images[0]} 
                  alt={offer.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
            <CardContent className="flex-1 pt-4">
              <p className="text-sm text-gray-600 line-clamp-3">{offer.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {offer.isHousingOffer ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Logement</span>
                    </div>
                    {offer.bedrooms && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        <span>{offer.bedrooms} chambre(s)</span>
                      </div>
                    )}
                    {offer.bathrooms && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4" />
                        <span>{offer.bathrooms} salle(s) de bain</span>
                      </div>
                    )}
                    <div className="w-full mt-2">
                      <span className="font-medium">{offer.price}€ / mois</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{offer.positions} poste{offer.positions > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Date limite: {new Date(offer.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full mt-2">
                      <span className="font-medium">{offer.salary.amount}€ / mois</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full"
                onClick={() => navigate(offer.isHousingOffer ? `/logement/${offer.id}` : `/emploi/${offer.id}`)}
                variant={offer.status === 'active' ? 'default' : 'outline'}
              >
                {offer.status === 'active' ? 'Voir l\'offre' : 'Offre expirée'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune offre ne correspond à vos critères</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
