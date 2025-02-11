
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(selectedListing?.title || '');
  const [description, setDescription] = useState(selectedListing?.description || '');
  const [price, setPrice] = useState(selectedListing?.price || 0);
  const [location, setLocation] = useState(selectedListing?.location || '');
  const [images, setImages] = useState<string[]>(selectedListing?.images || []);

  // Mettre à jour le formulaire quand selectedListing change
  useEffect(() => {
    if (selectedListing) {
      setTitle(selectedListing.title);
      setDescription(selectedListing.description || '');
      setPrice(selectedListing.price);
      setLocation(selectedListing.location);
      setImages(selectedListing.images || []);
    }
  }, [selectedListing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !price || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: Omit<Listing, "id"> = {
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

      await onSave(formData);
      toast.success(isEditing ? "Logement modifié avec succès" : "Logement ajouté avec succès");
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice(0);
    setLocation('');
    setImages([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length > 10) {
        toast.error("Vous ne pouvez pas télécharger plus de 10 images");
        return;
      }
      
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  return (
    <Dialog open={open || isEditing} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        setOpen(newOpen);
        if (!newOpen) {
          onCancel();
          resetForm();
        }
      }
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un logement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le logement" : "Ajouter un nouveau logement"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les informations du logement ci-dessous."
              : "Remplissez les informations pour ajouter un nouveau logement."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="title">Titre <span className="text-red-500">*</span></label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du logement"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="location">Localisation <span className="text-red-500">*</span></label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Adresse du logement"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description <span className="text-red-500">*</span></label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée..."
              className="min-h-[200px]"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="price">Prix par nuit <span className="text-red-500">*</span></label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Prix en €"
              min="0"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="images">Images (max 10)</label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setOpen(false);
                onCancel();
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                isEditing ? "Mettre à jour" : "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
