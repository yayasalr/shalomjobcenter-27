
import { useState, useEffect } from 'react';
import { CheckIcon, FilterIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobDomain, JobContract } from '@/types/job';
import { motion } from 'framer-motion';

interface JobFiltersProps {
  onDomainChange: (domain: string) => void;
  onHousingChange: (showHousingOnly: boolean) => void;
  currentDomain: string;
  showHousingOnly: boolean;
}

export const JobFilters = ({
  onDomainChange,
  onHousingChange,
  currentDomain,
  showHousingOnly
}: JobFiltersProps) => {
  // États locaux pour les filtres
  const [contractType, setContractType] = useState<string>('all');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([300000, 1500000]);
  
  // Animation variants
  const variants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  // Traduire les domaines
  const translateDomain = (domain: string) => {
    const domains: {[key: string]: string} = {
      'residential_security': 'Sécurité résidentielle',
      'bodyguard': 'Garde du corps',
      'private_property': 'Propriétés privées',
      'industrial_security': 'Sécurité industrielle',
      'office_security': 'Sécurité de bureau',
      'security_patrol': 'Patrouilleur',
      'access_control': 'Contrôle d\'accès',
      'security_systems': 'Opérateur systèmes',
      'construction_security': 'Sécurité chantier',
      'site_supervisor': 'Surveillant travaux',
      'security_coordinator': 'Coordinateur sécurité',
      'event_security': 'Sécurité événementielle',
      'k9_security': 'Maître-chien',
      'security_manager': 'Responsable sécurité',
      'security_consultant': 'Consultant sécurité',
      'security_trainer': 'Formateur sécurité',
      'housing_offer': 'Offre de logement',
      'all': 'Tous les domaines'
    };
    
    return domains[domain] || domain;
  };
  
  // Liste des domaines disponibles
  const domains: JobDomain[] = [
    'residential_security',
    'bodyguard',
    'private_property',
    'industrial_security',
    'office_security',
    'event_security',
    'k9_security',
    'housing_offer'
  ];
  
  // Types de contrats
  const contracts: JobContract[] = ['full_time', 'part_time', 'contract'];
  const translateContract = (contract: string) => {
    const contractsMap: {[key: string]: string} = {
      'full_time': 'CDI',
      'part_time': 'Temps partiel',
      'contract': 'CDD',
      'all': 'Tous les contrats'
    };
    
    return contractsMap[contract] || contract;
  };
  
  return (
    <motion.div 
      className="bg-gray-50 rounded-lg p-4 space-y-6"
      initial="initial"
      animate="animate"
      variants={variants}
    >
      <div>
        <h3 className="font-medium mb-3 flex items-center">
          <FilterIcon className="h-4 w-4 mr-2 text-sholom-primary" />
          Filtres
        </h3>
        
        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={currentDomain === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onDomainChange('all')}
            className={currentDomain === 'all' ? 'bg-sholom-primary hover:bg-sholom-primary/90' : ''}
          >
            Tous
          </Button>
          
          <Button 
            variant={currentDomain === 'residential_security' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onDomainChange('residential_security')}
            className={currentDomain === 'residential_security' ? 'bg-sholom-primary hover:bg-sholom-primary/90' : ''}
          >
            Sécurité résidentielle
          </Button>
          
          <Button 
            variant={currentDomain === 'bodyguard' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onDomainChange('bodyguard')}
            className={currentDomain === 'bodyguard' ? 'bg-sholom-primary hover:bg-sholom-primary/90' : ''}
          >
            Garde du corps
          </Button>
          
          <Button 
            variant={currentDomain === 'housing_offer' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onDomainChange('housing_offer')}
            className={currentDomain === 'housing_offer' ? 'bg-sholom-primary hover:bg-sholom-primary/90' : ''}
          >
            Logements
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        {/* Catégorie professionnelle */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Domaine</label>
          <Select 
            value={currentDomain} 
            onValueChange={onDomainChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un domaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les domaines</SelectItem>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {translateDomain(domain)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Type de contrat */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Type de contrat</label>
          <Select 
            value={contractType} 
            onValueChange={setContractType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un type de contrat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les contrats</SelectItem>
              {contracts.map((contract) => (
                <SelectItem key={contract} value={contract}>
                  {translateContract(contract)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Fourchette de salaire */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Salaire (FCFA): {salaryRange[0].toLocaleString('fr-FR')} - {salaryRange[1].toLocaleString('fr-FR')}
          </label>
          <Slider
            defaultValue={[300000, 1500000]}
            max={2000000}
            min={100000}
            step={50000}
            value={salaryRange}
            onValueChange={(value) => setSalaryRange(value as [number, number])}
            className="my-4"
          />
        </div>
        
        {/* Afficher uniquement les logements */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="housing-only" 
            checked={showHousingOnly}
            onCheckedChange={onHousingChange}
          />
          <Label htmlFor="housing-only">Voir uniquement les logements</Label>
        </div>
      </div>
    </motion.div>
  );
};
