
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CompareButton } from "./CompareButton";
import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { id, title, location, price, rating, image, dates, host } = listing;
  const { settings } = useSiteSettings();

  // Liste d'images de secours fiables pour Lomé
  const fallbackImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", // Villa moderne
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // Maison élégante
    "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800", // Appartement contemporain
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", // Logement lumineux
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"  // Intérieur moderne
  ];

  // Amélioration de la gestion des images
  useEffect(() => {
    const processImageUrl = () => {
      // Vérification si les images dans le listing sont des tableaux vides
      if (listing.images && listing.images.length === 0) {
        console.log(`Listing ${id}: images est un tableau vide, utilisant une image de secours`);
        setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
        return;
      }

      // Si "images" existe et contient des éléments non vides, utiliser le premier
      if (listing.images && listing.images.length > 0 && listing.images[0]) {
        const firstNonEmptyImage = listing.images.find(img => img && img.length > 0);
        if (firstNonEmptyImage) {
          console.log(`Listing ${id}: utilisation de la première image non vide du tableau images`);
          setImageUrl(firstNonEmptyImage);
          return;
        }
      }

      // Vérification du type d'image principale et traitement approprié
      if (!image) {
        console.log(`Listing ${id}: pas d'image principale, utilisant une image de secours`);
        setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
      } else if (image.startsWith('blob:')) {
        // Les URLs blob ne sont pas persistantes après rafraîchissement de la page
        const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        console.log(`Listing ${id}: Image blob détectée (${image}), utilisation d'une alternative: ${randomFallback}`);
        setImageUrl(randomFallback);
      } else if (image.startsWith('http')) {
        console.log(`Listing ${id}: URL HTTP normale: ${image}`);
        setImageUrl(image);
      } else if (image.startsWith('/')) {
        // Chemin relatif - S'assurer que l'image existe
        if (image === '/placeholder.svg' || image.includes('lovable-uploads')) {
          console.log(`Listing ${id}: Chemin relatif valide: ${image}`);
          setImageUrl(image);
        } else {
          console.warn(`Listing ${id}: Image relative problématique: ${image}, utilisation d'une alternative`);
          setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
        }
      } else {
        // Type d'URL inconnu, utiliser une image de secours
        console.warn(`Listing ${id}: Format d'image non reconnu: ${image}, utilisation d'une alternative`);
        setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
      }
    };
    
    processImageUrl();
  }, [image, id, listing.images]);

  // Vérification si le logement est déjà dans les favoris
  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      const favList = JSON.parse(favorites);
      setIsFavorite(favList.includes(id));
    }
  }, [id]);

  // Gestion des favoris
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    
    let favorites: string[] = [];
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }
    
    if (isFavorite) {
      favorites = favorites.filter(favId => favId !== id);
      toast.success("Retiré des favoris");
    } else {
      favorites.push(id);
      toast.success("Ajouté aux favoris");
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Conversion du prix en FCFA
  const priceFCFA = Math.round(price * 655.957); // Conversion d'euros en FCFA

  // Extraction et affichage du quartier depuis la localisation
  const neighborhood = location ? location.split(',')[0].trim() : 'Lomé';

  // Utiliser des hôtes avec photos réelles pour un design plus authenticque comme Airbnb
  const hostName = host?.name || "Hôte";
  const hostDefaultImage = "https://a0.muscache.com/im/pictures/user/c6e8bdf0-5a52-4be9-959b-bb4357d13b4a.jpg?aki_policy=profile_medium";
  const hostImage = host?.image && !host.image.includes('placeholder') ? host.image : hostDefaultImage;

  return (
    <Link to={`/logement/${id}`} className="group relative block hover-lift transition-all duration-300 rounded-xl overflow-hidden">
      {/* Badge "Coup de coeur voyageurs" */}
      <div className="absolute top-3 left-3 z-10">
        <Badge 
          variant="outline" 
          className="px-2 py-1 bg-white text-xs font-medium text-black border-none shadow-sm flex items-center gap-1"
        >
          <span className="text-amber-400">★</span> Coup de cœur voyageurs
        </Badge>
      </div>

      <div className="aspect-square w-full overflow-hidden relative">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            console.log("Erreur de chargement d'image pour:", title);
            // Image de secours en cas d'erreur
            e.currentTarget.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
          }}
        />
        
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite
                  ? "fill-red-500 text-red-500 animate-heart-beat"
                  : "stroke-gray-600"
              }`}
            />
          </motion.button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{neighborhood}, {location.includes(',') ? location.split(',')[1].trim() : ''}</h3>
            <p className="text-sm text-gray-500 mt-1">Séjournez chez {hostName}</p>
            <p className="text-sm text-gray-500 mt-0.5">{dates}</p>
            <p className="font-medium mt-1">{priceFCFA.toLocaleString('fr-FR')} FCFA par nuit</p>
          </div>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-black fill-black mr-1" />
            <span className="text-sm font-medium">{rating || "Nouveau"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
