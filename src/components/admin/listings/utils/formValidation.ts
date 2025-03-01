
import { ValidationErrors } from "../form/BasicInfoSection";

export const validateListingForm = (formState: {
  title: string;
  description: string;
  price: string;
  location: string;
  neighborhood: string;
  mapLocation: string;
}, imagePreviews: string[], isEditing: boolean): ValidationErrors => {
  const newErrors: ValidationErrors = {};
  
  if (!formState.title.trim()) {
    newErrors.title = "Le titre est obligatoire";
  } else if (formState.title.length < 3) {
    newErrors.title = "Le titre doit contenir au moins 3 caractères";
  } else if (formState.title.length > 100) {
    newErrors.title = "Le titre ne doit pas dépasser 100 caractères";
  }
  
  if (formState.description && formState.description.length < 10) {
    newErrors.description = "La description doit contenir au moins 10 caractères";
  }
  
  if (!formState.price) {
    newErrors.price = "Le prix est obligatoire";
  } else {
    const priceValue = parseFloat(formState.price);
    if (isNaN(priceValue)) {
      newErrors.price = "Le prix doit être un nombre valide";
    } else if (priceValue <= 0) {
      newErrors.price = "Le prix doit être supérieur à 0";
    } else if (priceValue > 10000000) {
      newErrors.price = "Le prix semble trop élevé";
    }
  }
  
  if (!formState.location.trim()) {
    newErrors.location = "La localisation est obligatoire";
  }
  
  if (!formState.neighborhood.trim()) {
    newErrors.neighborhood = "Le quartier est obligatoire";
  }
  
  if (!isEditing && imagePreviews.length === 0) {
    newErrors.images = "Au moins une image est requise";
  }
  
  return newErrors;
};
