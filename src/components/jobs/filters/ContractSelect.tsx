
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobContract } from '@/types/job';
import { translateContract } from './utils';

interface ContractSelectProps {
  contractType: string;
  setContractType: (type: string) => void;
}

export const ContractSelect: React.FC<ContractSelectProps> = ({
  contractType,
  setContractType
}) => {
  // Types de contrats
  const contracts: JobContract[] = ['full_time', 'part_time', 'contract'];

  return (
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
  );
};
