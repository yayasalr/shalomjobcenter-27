
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobDomain, JobContract } from '@/types/job';

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

export const FormFields: React.FC<FormFieldsProps> = ({
  title,
  setTitle,
  domain,
  setDomain,
  description,
  setDescription,
  requirements,
  setRequirements,
  contract,
  setContract,
  location,
  setLocation,
  salary,
  setSalary,
  positions,
  setPositions,
  deadline,
  setDeadline,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de l'offre <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            placeholder="Ex: Agent de sécurité pour résidences"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Domaine <span className="text-red-500">*</span></Label>
          <Select value={domain} onValueChange={(value: JobDomain) => setDomain(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un domaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential_security">Sécurité résidentielle</SelectItem>
              <SelectItem value="bodyguard">Garde du corps</SelectItem>
              <SelectItem value="private_property">Surveillance propriétés privées</SelectItem>
              <SelectItem value="industrial_security">Sécurité industrielle</SelectItem>
              <SelectItem value="office_security">Sécurité de bureau</SelectItem>
              <SelectItem value="security_patrol">Patrouilleur</SelectItem>
              <SelectItem value="access_control">Contrôle d'accès</SelectItem>
              <SelectItem value="security_systems">Opérateur systèmes</SelectItem>
              <SelectItem value="construction_security">Sécurité chantier</SelectItem>
              <SelectItem value="site_supervisor">Surveillant travaux</SelectItem>
              <SelectItem value="security_coordinator">Coordinateur sécurité</SelectItem>
              <SelectItem value="event_security">Sécurité événementielle</SelectItem>
              <SelectItem value="k9_security">Sécurité cynophile</SelectItem>
              <SelectItem value="security_manager">Responsable sécurité</SelectItem>
              <SelectItem value="security_consultant">Consultant sécurité</SelectItem>
              <SelectItem value="security_trainer">Formateur sécurité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description du poste <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          placeholder="Décrivez en détail les responsabilités et le contexte du poste"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Exigences et qualifications <span className="text-red-500">*</span></Label>
        <Textarea
          id="requirements"
          placeholder="Listez les compétences, certifications et expériences requises"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={5}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contract">Type de contrat <span className="text-red-500">*</span></Label>
          <Select value={contract} onValueChange={(value: JobContract) => setContract(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type de contrat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Temps plein</SelectItem>
              <SelectItem value="part_time">Temps partiel</SelectItem>
              <SelectItem value="contract">Contrat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localisation <span className="text-red-500">*</span></Label>
          <Input
            id="location"
            placeholder="Ex: Paris, Lyon, Marseille..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="salary">Salaire mensuel (€) <span className="text-red-500">*</span></Label>
          <Input
            id="salary"
            type="number"
            placeholder="Ex: 2000"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            min={0}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="positions">Nombre de postes <span className="text-red-500">*</span></Label>
          <Input
            id="positions"
            type="number"
            placeholder="Ex: 1"
            value={positions}
            onChange={(e) => setPositions(Number(e.target.value))}
            min={1}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Date limite <span className="text-red-500">*</span></Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
      </div>
    </>
  );
};
