
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from "@/hooks/useListings";
import { toast } from "sonner";

interface ListingFormDialogProps {
  selectedListing: Listing | null;
  isEditing: boolean;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

export const ListingFormDialog = ({
  selectedListing,
  isEditing,
  onSave,
  onCancel,
}: ListingFormDialogProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [mapLocation, setMapLocation] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // Charger les données du logement sélectionné
  useEffect(() => {
    if (selectedListing && isEditing) {
      setTitle(selectedListing.title);
      setDescription(selectedListing.description || "");
      setPrice(selectedListing.price.toString());
      setLocation(selectedListing.location);
      
      // Extraire le quartier de la localisation
      const parts = selectedListing.location.split(',');
      if (parts.length > 0) {
        setNeighborhood(parts[0].trim());
      }
      
      // Si un mapLocation existe, le charger
      if (selectedListing.mapLocation) {
        setMapLocation(selectedListing.mapLocation);
      }
      
      // Réinitialiser les images
      setImages([]);
      
      // Afficher les images existantes comme prévisualisations
      if (selectedListing.images && selectedListing.images.length > 0) {
        setImagePreviews(selectedListing.images.filter(img => !img.startsWith('blob:')));
      } else if (selectedListing.image && !selectedListing.image.startsWith('blob:')) {
        setImagePreviews([selectedListing.image]);
      } else {
        setImagePreviews([]);
      }
      
      setOpen(true);
    } else if (!isEditing) {
      resetForm();
      setOpen(false);
    }
  }, [selectedListing, isEditing]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setNeighborhood("");
    setMapLocation("");
    setImages([]);
    setImagePreviews([]);
  };

  // Gérer l'upload d'images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  // Supprimer une image
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Révoquer l'URL de l'aperçu pour éviter les fuites de mémoire
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  // Mettre à jour la localisation lorsque le quartier change
  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNeighborhood = e.target.value;
    setNeighborhood(newNeighborhood);
    setLocation(`${newNeighborhood}, Lomé, Togo`);
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (!title || !price || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      toast.error("Le prix doit être un nombre positif");
      return;
    }

    const formData: any = {
      title,
      description,
      price: parseFloat(price),
      location,
      mapLocation: mapLocation // Nouveau champ pour la localisation sur la carte
    };

    // Si on modifie un logement existant
    if (selectedListing && isEditing) {
      formData.id = selectedListing.id;
      formData.rating = selectedListing.rating;
      formData.dates = selectedListing.dates;
      formData.host = selectedListing.host;
      
      // Conserver les images existantes si aucune nouvelle image n'a été ajoutée
      if (images.length === 0) {
        formData.image = selectedListing.image;
        formData.images = selectedListing.images;
      }
    }

    // Traiter les nouvelles images
    if (images.length > 0) {
      const imageUrls = images.map(file => URL.createObjectURL(file));
      formData.image = imageUrls[0]; // La première image comme image principale
      formData.images = imageUrls; // Toutes les images dans un tableau
    }

    onSave(formData);
    resetForm();
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) onCancel();
      }}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            Ajouter un logement
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier un logement" : "Ajouter un logement"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Mettez à jour les informations du logement"
                : "Remplissez le formulaire pour ajouter un nouveau logement"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre du logement"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix (en €)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Prix par nuit en euros"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du logement"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Quartier</Label>
                <select
                  id="neighborhood"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={neighborhood}
                  onChange={handleNeighborhoodChange}
                  required
                >
                  <option value="">Sélectionnez un quartier</option>
                  {LOME_NEIGHBORHOODS.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation complète</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Tokoin, Lomé, Togo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapLocation">Lien de la carte Google Maps</Label>
              <Input
                id="mapLocation"
                value={mapLocation}
                onChange={(e) => setMapLocation(e.target.value)}
                placeholder="Ex: https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-sm text-gray-500">
                Comment obtenir un lien d'intégration Google Maps:
                <ol className="list-decimal pl-5 mt-1 text-xs">
                  <li>Recherchez le lieu sur Google Maps</li>
                  <li>Cliquez sur "Partager"</li>
                  <li>Sélectionnez "Intégrer une carte"</li>
                  <li>Copiez le lien qui commence par "https://www.google.com/maps/embed"</li>
                </ol>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Vous pouvez sélectionner plusieurs images. La première image sera utilisée comme aperçu.
              </p>
            </div>

            {/* Prévisualisation des images */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => removeImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
