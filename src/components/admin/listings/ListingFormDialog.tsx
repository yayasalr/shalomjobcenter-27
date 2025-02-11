
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Save } from "lucide-react";
import { Listing } from '@/types/listing';

interface ListingFormDialogProps {
  selectedListing?: Listing | null;
  isEditing: boolean;
  onSave: (formData: Omit<Listing, "id">) => Promise<void>;
  onCancel: () => void;
}

export const ListingFormDialog: React.FC<ListingFormDialogProps> = ({
  selectedListing,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: selectedListing?.title || '',
    description: selectedListing?.description || '',
    price: selectedListing?.price || 0,
    location: selectedListing?.location || '',
    images: selectedListing?.images || []
  });

  useEffect(() => {
    if (selectedListing) {
      setIsOpen(true);
      setFormData({
        title: selectedListing.title,
        description: selectedListing.description || '',
        price: selectedListing.price,
        location: selectedListing.location,
        images: selectedListing.images || []
      });
    }
  }, [selectedListing]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      location: '',
      images: []
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const { title, description, price, location, images } = formData;
    
    if (!title || !description || !price || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: Omit<Listing, "id"> = {
        title,
        description,
        price,
        location,
        images,
        rating: selectedListing?.rating || 0,
        image: images[0] || "",
        dates: new Date().toLocaleDateString(),
        host: {
          name: "Admin",
          image: "/placeholder.svg"
        }
      };

      await onSave(submitData);
      handleOpenChange(false);
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length > 10) {
        toast.error("Vous ne pouvez pas télécharger plus de 10 images");
        return;
      }
      
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
          Ajouter un logement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {isEditing ? "Modifier le logement" : "Ajouter un nouveau logement"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les informations du logement ci-dessous."
              : "Remplissez les informations pour ajouter un nouveau logement."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="listing-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="font-medium">
                Titre <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du logement"
                required
                className="border-2"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="location" className="font-medium">
                Localisation <span className="text-red-500">*</span>
              </label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Adresse du logement"
                required
                className="border-2"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description détaillée..."
                className="min-h-[200px] border-2"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="price" className="font-medium">
                Prix par nuit <span className="text-red-500">*</span>
              </label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="Prix en €"
                min="0"
                required
                className="border-2"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="images" className="font-medium">
                Images (max 10)
              </label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="border-2"
              />
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              form="listing-form"
              disabled={isSubmitting}
              className="px-6 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Appliquer les modifications" : "Publier le logement"}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
