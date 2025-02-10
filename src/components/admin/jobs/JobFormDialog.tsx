
import React, { useState, useEffect } from 'react';
import { Job, JobDomain, JobContract } from '@/types/job';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface JobFormDialogProps {
  selectedJob?: Job | null;
  isEditing: boolean;
  onSave: (formData: Omit<Job, "id">) => void;
  onCancel: () => void;
}

const domainOptions = {
  residential_security: "Sécurité résidentielle",
  industrial_security: "Sécurité industrielle",
  construction_security: "Sécurité de chantier",
  event_security: "Sécurité événementielle",
  k9_security: "Sécurité cynophile",
  security_consulting: "Conseil en sécurité"
};

const contractOptions = {
  full_time: "Temps plein",
  part_time: "Temps partiel",
  contract: "Contrat"
};

export const JobFormDialog: React.FC<JobFormDialogProps> = ({
  selectedJob,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(selectedJob?.title || '');
  const [domain, setDomain] = useState<JobDomain>(selectedJob?.domain || 'residential_security');
  const [description, setDescription] = useState(selectedJob?.description || '');
  const [requirements, setRequirements] = useState(selectedJob?.requirements || '');
  const [contract, setContract] = useState<JobContract>(selectedJob?.contract || 'full_time');
  const [location, setLocation] = useState(selectedJob?.location || '');
  const [salary, setSalary] = useState(selectedJob?.salary.amount || 0);
  const [positions, setPositions] = useState(selectedJob?.positions || 1);
  const [deadline, setDeadline] = useState(selectedJob?.deadline || '');

  useEffect(() => {
    if (selectedJob) {
      setTitle(selectedJob.title);
      setDomain(selectedJob.domain);
      setDescription(selectedJob.description);
      setRequirements(selectedJob.requirements);
      setContract(selectedJob.contract);
      setLocation(selectedJob.location);
      setSalary(selectedJob.salary.amount);
      setPositions(selectedJob.positions);
      setDeadline(selectedJob.deadline);
    }
  }, [selectedJob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      title,
      domain,
      description,
      requirements,
      contract,
      location,
      salary: {
        amount: salary,
        currency: "EUR"
      },
      positions,
      publishDate: new Date().toISOString().split('T')[0],
      deadline,
      status: "active" as const
    };

    onSave(formData);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDomain('residential_security');
    setDescription('');
    setRequirements('');
    setContract('full_time');
    setLocation('');
    setSalary(0);
    setPositions(1);
    setDeadline('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {isEditing ? "Modifier l'offre" : "Ajouter une offre"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier l'offre d'emploi" : "Ajouter une nouvelle offre d'emploi"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => {
              setOpen(false);
              onCancel();
              resetForm();
            }}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
