
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
  onSave: () => void;
  onCancel: () => void;
}

export const ListingFormDialog: React.FC<ListingFormDialogProps> = ({
  selectedListing,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [newImages, setNewImages] = useState<FileList | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length > 10) {
        toast.error("Vous ne pouvez pas télécharger plus de 10 images");
        return;
      }
      setNewImages(files);
    }
  };

  return (
    <Dialog>
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
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Titre</label>
            <Input 
              id="title" 
              placeholder="Titre du logement"
              defaultValue={selectedListing?.title}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Textarea 
              id="description" 
              placeholder="Description détaillée..."
              className="min-h-[200px]"
              defaultValue={selectedListing?.description}
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
              <Button variant="outline" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Ajouter des images
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <label>Prix par nuit</label>
            <Input 
              type="number" 
              placeholder="Prix en €"
              defaultValue={selectedListing?.price}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
