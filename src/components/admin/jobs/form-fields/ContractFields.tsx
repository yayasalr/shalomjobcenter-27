
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContractFieldsProps {
  contract: string;
  setContract: (value: string) => void;
}

export const ContractFields: React.FC<ContractFieldsProps> = ({
  contract,
  setContract
}) => {
  return (
    <div>
      <Label htmlFor="contract" className="block text-sm font-medium mb-1">
        Type de contrat <span className="text-red-500">*</span>
      </Label>
      <Input
        id="contract"
        value={contract}
        onChange={(e) => setContract(e.target.value)}
        placeholder="Entrez le type de contrat"
        required
      />
    </div>
  );
};
