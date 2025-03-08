
import React from 'react';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
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
import { useJobForm } from './hooks/useJobForm';

interface JobFormDialogProps {
  selectedJob?: Job | null;
  isEditing: boolean;
  onSave: (formData: Omit<Job, "id">) => void;
  onCancel: () => void;
  buttonText?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const JobFormDialog: React.FC<JobFormDialogProps> = ({
  selectedJob,
  isEditing,
  onSave,
  onCancel,
  buttonText,
  isOpen,
  setIsOpen,
}) => {
  const {
    isSubmitting,
    isUploading,
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
    isHousingOffer,
    setIsHousingOffer,
    price,
    setPrice,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    images,
    setImages,
    isPublished,
    setIsPublished,
    featuredImage,
    setFeaturedImage,
    handleOpenChange,
    resetForm,
    handleFeaturedImageUpload,
    handleAddImage,
    handleRemoveImage,
    handleSubmit,
    handleDomainChange,
    handleContractChange
  } = useJobForm({ 
    selectedJob, 
    onSave, 
    onCancel,
    isOpen,
    setIsOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {buttonText ? (
        <DialogTrigger asChild>
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
        </DialogTrigger>
      ) : null}
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
