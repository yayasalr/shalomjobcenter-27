
import React, { useState, useEffect } from 'react';
import { Job, JobDomain, JobContract } from '@/types/job';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { FormFields } from './FormFields';
import { ImageManagementSection } from './ImageManagementSection';
import { PublishSettingsSection } from './PublishSettingsSection';
import { JobDialogFooter } from './JobDialogFooter';
import { AddItemButton } from '../shared/AddItemButton';

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
  const [domain, setDomain] = useState<JobDomain>(selectedJob?.domain || 'residential_security');
  const [description, setDescription] = useState(selectedJob?.description || '');
  const [requirements, setRequirements] = useState(selectedJob?.requirements || '');
  const [contract, setContract] = useState<JobContract>(selectedJob?.contract || 'full_time');
  const [location, setLocation] = useState(selectedJob?.location || '');
  const [salary, setSalary] = useState(selectedJob?.salary?.amount || 0);
  const [positions, setPositions] = useState(selectedJob?.positions || 1);
  const [deadline, setDeadline] = useState(selectedJob?.deadline || '');
  const [isHousingOffer, setIsHousingOffer] = useState(selectedJob?.isHousingOffer || false);
  const [price, setPrice] = useState(selectedJob?.price || 0);
  const [bedrooms, setBedrooms] = useState(selectedJob?.bedrooms || 1);
  const [bathrooms, setBathrooms] = useState(selectedJob?.bathrooms || 1);
  const [images, setImages] = useState<string[]>(selectedJob?.images || []);
  const [isPublished, setIsPublished] = useState(selectedJob?.status === 'active');
  const [featuredImage, setFeaturedImage] = useState(selectedJob?.image || '');
  const [isUploading, setIsUploading] = useState(false);

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
      setIsPublished(selectedJob.status === 'active');
      setFeaturedImage(selectedJob.image || '');
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
    setIsPublished(true);
    setFeaturedImage('');
  };

  // Simulate image upload
  const simulateImageUpload = (callback: (url: string) => void) => {
    setIsUploading(true);
    // Simulate delay for upload
    setTimeout(() => {
      // Generate a random image URL from Unsplash
      const imageUrl = `https://source.unsplash.com/random/800x600/?${isHousingOffer ? 'apartment,house' : 'office,work'}&${Date.now()}`;
      callback(imageUrl);
      setIsUploading(false);
    }, 1500);
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = () => {
    simulateImageUpload((url) => {
      setFeaturedImage(url);
      toast.success("Image principale téléchargée avec succès");
    });
  };

  // Fonctions pour gérer les images
  const handleAddImage = () => {
    simulateImageUpload((url) => {
      setImages([...images, url]);
      toast.success("Nouvelle image ajoutée");
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    toast.success("Image supprimée");
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
      status: isPublished ? "active" : "draft"
    };

    // Add featured image if available
    if (featuredImage) {
      formData.image = featuredImage;
    }

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

  // Fonction pour convertir les types pour les props de FormFields
  const handleDomainChange = (value: string) => {
    setDomain(value as JobDomain);
  };

  const handleContractChange = (value: string) => {
    setContract(value as JobContract);
  };

  return (
    <Dialog open={isOpen || isEditing} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {buttonText ? (
          <Button 
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }} 
            className="gap-2 bg-sholom-primary hover:bg-sholom-primary/90"
          >
            <Plus className="h-4 w-4" />
            {buttonText}
          </Button>
        ) : (
          <AddItemButton
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }}
            label={isEditing ? "Modifier l'offre" : "Ajouter une offre"}
          />
        )}
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
            <PublishSettingsSection
              isHousingOffer={isHousingOffer}
              setIsHousingOffer={setIsHousingOffer}
              isPublished={isPublished}
              setIsPublished={setIsPublished}
            />
            
            <ImageManagementSection
              featuredImage={featuredImage}
              setFeaturedImage={setFeaturedImage}
              images={images}
              isUploading={isUploading}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              onFeaturedImageUpload={handleFeaturedImageUpload}
            />
            
            <FormFields
              title={title}
              setTitle={setTitle}
              domain={domain}
              setDomain={handleDomainChange}
              description={description}
              setDescription={setDescription}
              requirements={requirements}
              setRequirements={setRequirements}
              contract={contract}
              setContract={handleContractChange}
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
              onUpdateImage={(index, url) => {
                const newImages = [...images];
                newImages[index] = url;
                setImages(newImages);
              }}
              onRemoveImage={handleRemoveImage}
              isUploading={isUploading}
            />
          </form>
        </ScrollArea>

        <JobDialogFooter
          isSubmitting={isSubmitting}
          onCancel={() => handleOpenChange(false)}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};
