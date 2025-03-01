
import { useState } from 'react';
import { FilterIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { DomainFilter } from './filters/DomainFilter';
import { DomainSelect } from './filters/DomainSelect';
import { ContractSelect } from './filters/ContractSelect';
import { SalaryRangeSlider } from './filters/SalaryRangeSlider';
import { HousingSwitch } from './filters/HousingSwitch';

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
        <DomainFilter 
          currentDomain={currentDomain} 
          onDomainChange={onDomainChange} 
        />
        
        <Separator className="my-4" />
        
        {/* Catégorie professionnelle */}
        <DomainSelect 
          currentDomain={currentDomain} 
          onDomainChange={onDomainChange} 
        />
        
        {/* Type de contrat */}
        <ContractSelect 
          contractType={contractType} 
          setContractType={setContractType} 
        />
        
        {/* Fourchette de salaire */}
        <SalaryRangeSlider 
          salaryRange={salaryRange} 
          setSalaryRange={setSalaryRange} 
        />
        
        {/* Afficher uniquement les logements */}
        <HousingSwitch 
          showHousingOnly={showHousingOnly} 
          onHousingChange={onHousingChange} 
        />
      </div>
    </motion.div>
  );
};
