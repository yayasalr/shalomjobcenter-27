
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobDomain } from '@/types/job';
import { translateDomain } from './utils';

interface DomainSelectProps {
  currentDomain: string;
  onDomainChange: (domain: string) => void;
}

export const DomainSelect: React.FC<DomainSelectProps> = ({
  currentDomain,
  onDomainChange
}) => {
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

  return (
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
  );
};
