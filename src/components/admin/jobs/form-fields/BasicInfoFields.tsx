
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  isHousingOffer?: boolean;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  title,
  setTitle,
  domain,
  setDomain,
  isHousingOffer = false
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="block text-sm font-medium mb-1">
          Titre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'offre"
          required
        />
      </div>

      {!isHousingOffer && (
        <div>
          <Label htmlFor="domain" className="block text-sm font-medium mb-1">
            Domaine <span className="text-red-500">*</span>
          </Label>
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Entrez le domaine"
            required
          />
        </div>
      )}
    </div>
  );
};
