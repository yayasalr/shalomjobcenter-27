
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CompareButton } from "./CompareButton";
import { Star, MapPin, Award } from "lucide-react";
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
      // Vérification du type d'image et traitement approprié
      if (!image) {
        // Pas d'image => utiliser une image de secours
        setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
      } else if (image.startsWith('blob:')) {
        // Les URLs blob ne sont pas persistantes après rafraîchissement de la page
        const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        console.log(`Image blob détectée (${image}), utilisation d'une alternative: ${randomFallback}`);
        setImageUrl(randomFallback);
      } else if (image.startsWith('http')) {
        // URL HTTP normale
        setImageUrl(image);
      } else if (image.startsWith('/')) {
        // Chemin relatif - S'assurer que l'image existe
        if (image === '/placeholder.svg' || image.includes('lovable-uploads')) {
          setImageUrl(image);
        } else {
          console.warn(`Image relative problématique: ${image}, utilisation d'une alternative`);
          setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
        }
      } else {
        // Type d'URL inconnu, utiliser une image de secours
        console.warn(`Format d'image non reconnu: ${image}, utilisation d'une alternative`);
        setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
      }
    };
    
    processImageUrl();
  }, [image]);

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

  return (
    <Link to={`/logement/${id}`} className="group relative block hover-lift hover-shadow transition-all duration-300 rounded-xl overflow-hidden bg-white">
      <div className="aspect-square w-full overflow-hidden bg-gray-200 relative">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge "Coup de cœur" */}
        <div className="absolute top-3 left-3 z-10">
          <Badge 
            variant="favorite" 
            className="px-3 py-1.5 flex items-center shadow-md"
          >
            <Award className="h-3.5 w-3.5 mr-1 fill-white" />
            Coup de cœur voyageurs
          </Badge>
        </div>
        
        {/* Badge "SHALOM JOB CENTER" */}
        <div className="absolute top-12 left-3 z-10">
          <Badge 
            variant="jobcenter" 
            className="px-3 py-1.5 shadow-md"
          >
            SHALOM JOB CENTER
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CompareButton listingId={id} />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite
                  ? "fill-sholom-primary text-sholom-primary animate-heart-beat"
                  : "stroke-gray-600"
              }`}
            />
          </motion.button>
        </div>
        
        {/* Badge de prix en FCFA */}
        <div 
          className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-white font-medium text-sm bg-sholom-primary shadow-md backdrop-blur-sm"
        >
          {priceFCFA.toLocaleString('fr-FR')} FCFA
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center text-sholom-muted mb-1">
              <MapPin className="h-4 w-4 mr-1 text-sholom-primary" />
              <span className="text-sm">{location}</span>
            </div>
            <h3 className="text-lg font-medium text-sholom-dark transition-colors group-hover:text-sholom-primary">{title}</h3>
            <p className="text-sm text-sholom-muted mt-1">
              Séjournez chez {host?.name || "l'hôte"}
            </p>
            <p className="text-sm text-sholom-muted mt-0.5">{dates}</p>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-sholom-dark">{rating || "Nouveau"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
