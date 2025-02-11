
import React, { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FormFields } from './FormFields';

interface JobFormDialogProps {
  selectedJob?: Job | null;
  isEditing: boolean;
  onSave: (formData: Omit<Job, "id">) => void;
  onCancel: () => void;
}

export const JobFormDialog: React.FC<JobFormDialogProps> = ({
  selectedJob,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(selectedJob?.title || '');
  const [domain, setDomain] = useState(selectedJob?.domain || 'residential_security');
  const [description, setDescription] = useState(selectedJob?.description || '');
  const [requirements, setRequirements] = useState(selectedJob?.requirements || '');
  const [contract, setContract] = useState(selectedJob?.contract || 'full_time');
  const [location, setLocation] = useState(selectedJob?.location || '');
  const [salary, setSalary] = useState(selectedJob?.salary.amount || 0);
  const [positions, setPositions] = useState(selectedJob?.positions || 1);
  const [deadline, setDeadline] = useState(selectedJob?.deadline || '');

  useEffect(() => {
    if (selectedJob) {
      setIsOpen(true);
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
      resetForm();
    }
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
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen || isEditing} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }} 
          className="gap-2"
        >
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
          <FormFields
            title={title}
            setTitle={setTitle}
            domain={domain}
            setDomain={setDomain}
            description={description}
            setDescription={setDescription}
            requirements={requirements}
            setRequirements={setRequirements}
            contract={contract}
            setContract={setContract}
            location={location}
            setLocation={setLocation}
            salary={salary}
            setSalary={setSalary}
            positions={positions}
            setPositions={setPositions}
            deadline={deadline}
            setDeadline={setDeadline}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              className="px-6"
            >
              Annuler
            </Button>
            <Button type="submit" className="px-6">
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
