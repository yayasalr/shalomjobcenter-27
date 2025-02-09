
import React, { useState } from 'react';
import { toast } from "sonner";
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
import { Plus, Image as ImageIcon } from "lucide-react";
import { Listing } from '@/types/listing';

interface ListingFormDialogProps {
  selectedListing?: Listing | null;
  isEditing: boolean;
  onSave: (formData: Omit<Listing, "id">) => void;
  onCancel: () => void;
}

export const ListingFormDialog: React.FC<ListingFormDialogProps> = ({
  selectedListing,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(selectedListing?.title || '');
  const [description, setDescription] = useState(selectedListing?.description || '');
  const [price, setPrice] = useState(selectedListing?.price || 0);
  const [location, setLocation] = useState(selectedListing?.location || '');
  const [images, setImages] = useState<string[]>(selectedListing?.images || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !price || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const formData: Omit<Listing, "id"> = {
      title,
      description,
      price,
      location,
      images,
      rating: 0,
      image: images[0] || "",
      dates: new Date().toLocaleDateString(),
      host: {
        name: "Admin",
        image: "/placeholder.svg"
      }
    };

    onSave(formData);
    setOpen(false);
    resetForm();
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
      
      // Simuler l'upload d'images
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {isEditing ? "Modifier le logement" : "Ajouter un logement"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le logement" : "Ajouter un nouveau logement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="title">Titre</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du logement"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="location">Localisation</label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Adresse du logement"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
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
            <label htmlFor="images">Images (max 10)</label>
            <div className="flex items-center gap-4">
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="price">Prix par nuit</label>
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
