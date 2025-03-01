
import React from 'react';
import { Button } from '@/components/ui/button';

interface DomainFilterProps {
  currentDomain: string;
  onDomainChange: (domain: string) => void;
}

export const DomainFilter: React.FC<DomainFilterProps> = ({
  currentDomain,
  onDomainChange
}) => {
  return (
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
  );
};
