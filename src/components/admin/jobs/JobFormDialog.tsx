
import React, { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Loader2, Save, Check } from "lucide-react";
import { FormFields } from './FormFields';

interface JobFormDialogProps {
  selectedJob?: Job | null;
  isEditing: boolean;
  onSave: (formData: Omit<Job, "id">) => void;
  onCancel: () => void;
  buttonText?: string;
}

export const JobFormDialog: React.FC<JobFormDialogProps> = ({
  selectedJob,
  isEditing,
  onSave,
  onCancel,
  buttonText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(selectedJob?.title || '');
  const [domain, setDomain] = useState(selectedJob?.domain || 'residential_security');
  const [description, setDescription] = useState(selectedJob?.description || '');
  const [requirements, setRequirements] = useState(selectedJob?.requirements || '');
  const [contract, setContract] = useState(selectedJob?.contract || 'full_time');
  const [location, setLocation] = useState(selectedJob?.location || '');
  const [salary, setSalary] = useState(selectedJob?.salary?.amount || 0);
  const [positions, setPositions] = useState(selectedJob?.positions || 1);
  const [deadline, setDeadline] = useState(selectedJob?.deadline || '');
  const [isHousingOffer, setIsHousingOffer] = useState(selectedJob?.isHousingOffer || false);
  const [price, setPrice] = useState(selectedJob?.price || 0);
  const [bedrooms, setBedrooms] = useState(selectedJob?.bedrooms || 1);
  const [bathrooms, setBathrooms] = useState(selectedJob?.bathrooms || 1);
  const [images, setImages] = useState<string[]>(selectedJob?.images || []);

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
      setIsHousingOffer(!!selectedJob.isHousingOffer);
      setPrice(selectedJob.price || 0);
      setBedrooms(selectedJob.bedrooms || 1);
      setBathrooms(selectedJob.bathrooms || 1);
      setImages(selectedJob.images || []);
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
    setIsHousingOffer(false);
    setPrice(0);
    setBedrooms(1);
    setBathrooms(1);
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !deadline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    
    const formData: any = {
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

    // Si c'est une offre de logement, ajoutez les propriétés spécifiques
    if (isHousingOffer) {
      formData.isHousingOffer = true;
      formData.price = price;
      formData.bedrooms = bedrooms;
      formData.bathrooms = bathrooms;
      formData.images = images;
    }

    try {
      await onSave(formData);
      toast.success(isEditing ? "Offre mise à jour avec succès" : "Offre publiée avec succès");
      handleOpenChange(false);
    } catch (error) {
      console.error('Error submitting job:', error);
      toast.error("Une erreur est survenue lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonctions pour gérer les images
  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleUpdateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <Dialog open={isOpen || isEditing} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }} 
          className="gap-2 bg-sholom-primary hover:bg-sholom-primary/90"
        >
          <Plus className="h-4 w-4" />
          {buttonText || (isEditing ? "Modifier l'offre" : "Ajouter une offre")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {isEditing ? "Modifier l'offre" : "Ajouter une nouvelle offre"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les informations de l'offre ci-dessous."
              : "Remplissez les informations pour publier une nouvelle offre."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isHousingOffer}
                  onChange={() => setIsHousingOffer(!isHousingOffer)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Ceci est une offre de logement</span>
              </label>
              {isHousingOffer && (
                <div className="mt-2 p-3 bg-purple-50 rounded-md text-sm text-purple-700 border border-purple-200">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Vous êtes en train de créer une offre de logement
                  </div>
                </div>
              )}
            </div>
            
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
              isHousingOffer={isHousingOffer}
              price={price}
              setPrice={setPrice}
              bedrooms={bedrooms}
              setBedrooms={setBedrooms}
              bathrooms={bathrooms}
              setBathrooms={setBathrooms}
              images={images}
              onAddImage={handleAddImage}
              onUpdateImage={handleUpdateImage}
              onRemoveImage={handleRemoveImage}
            />
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-between w-full">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="px-6"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              form="job-form"
              disabled={isSubmitting}
              className="px-6 gap-2 bg-sholom-primary hover:bg-sholom-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  En cours...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Mettre à jour" : "Publier l'offre"}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
