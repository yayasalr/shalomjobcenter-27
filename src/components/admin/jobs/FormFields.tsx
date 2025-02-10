
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JobDomain, JobContract } from '@/types/job';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  domain: JobDomain;
  setDomain: (value: JobDomain) => void;
  description: string;
  setDescription: (value: string) => void;
  requirements: string;
  setRequirements: (value: string) => void;
  contract: JobContract;
  setContract: (value: JobContract) => void;
  location: string;
  setLocation: (value: string) => void;
  salary: number;
  setSalary: (value: number) => void;
  positions: number;
  setPositions: (value: number) => void;
  deadline: string;
  setDeadline: (value: string) => void;
}

export const domainOptions = {
  residential_security: "Sécurité résidentielle",
  industrial_security: "Sécurité industrielle",
  construction_security: "Sécurité de chantier",
  event_security: "Sécurité événementielle",
  k9_security: "Sécurité cynophile",
  security_consulting: "Conseil en sécurité"
};

export const contractOptions = {
  full_time: "Temps plein",
  part_time: "Temps partiel",
  contract: "Contrat"
};

export const FormFields: React.FC<FormFieldsProps> = ({
  title, setTitle,
  domain, setDomain,
  description, setDescription,
  requirements, setRequirements,
  contract, setContract,
  location, setLocation,
  salary, setSalary,
  positions, setPositions,
  deadline, setDeadline
}) => {
  return (
    <>
      <div className="grid gap-2">
        <label htmlFor="title">Titre du poste</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du poste"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="domain">Domaine</label>
        <Select
          value={domain}
          onValueChange={(value: JobDomain) => setDomain(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un domaine" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(domainOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="description">Description du poste</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description détaillée du poste..."
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="requirements">Exigences</label>
        <Textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Qualifications et expérience requises..."
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contract">Type de contrat</label>
        <Select
          value={contract}
          onValueChange={(value: JobContract) => setContract(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type de contrat" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(contractOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="location">Lieu</label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Lieu de travail"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="salary">Salaire (EUR)</label>
          <Input
            id="salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            min="0"
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="positions">Nombre de postes</label>
          <Input
            id="positions"
            type="number"
            value={positions}
            onChange={(e) => setPositions(Number(e.target.value))}
            min="1"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="deadline">Date limite de candidature</label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
    </>
  );
};

