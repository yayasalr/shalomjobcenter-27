
import { toast } from "sonner";
import { Listing } from '@/types/listing';

// Validate image URL and return a fallback if needed
export const validateImage = (imageUrl: string): string => {
  // Liste d'images de secours
  const fallbackImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", // Villa moderne
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // Maison élégante
    "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800", // Appartement contemporain
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", // Logement lumineux
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"  // Intérieur moderne
  ];
  
  // Si l'URL est vide ou commence par blob:
  if (!imageUrl || imageUrl.startsWith('blob:')) {
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }
  
  // Autres cas, retourner l'URL d'origine
  return imageUrl;
};

// Conversion du prix en FCFA
export const convertToFCFA = (euroAmount: number): string => {
  const fcfaAmount = Math.round(euroAmount * 655.957);
  return fcfaAmount.toLocaleString('fr-FR');
};

// Vérifier les images d'un logement avant édition
export const checkInvalidImages = (listing: Listing): boolean => {
  // Vérifier si les images blob sont présentes
  return listing.images?.some(img => img.startsWith('blob:')) || false;
};

export const showImageWarning = () => {
  toast.warning(
    "Ce logement contient des images temporaires qui ne seront pas sauvegardées correctement. Veuillez télécharger de nouvelles images.",
    { duration: 5000 }
  );
};
