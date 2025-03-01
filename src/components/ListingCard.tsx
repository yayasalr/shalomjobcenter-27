
import { Heart, Star, BookOpen, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const { id, title, location, price, rating, image, dates, host } = listing;
  const { settings } = useSiteSettings();

  // Liste d'images de secours fiables
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
        setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
        return;
      }

      // Si "images" existe et contient des éléments non vides, utiliser le premier
      if (listing.images && listing.images.length > 0 && listing.images[0]) {
        const firstNonEmptyImage = listing.images.find(img => img && img.length > 0);
        if (firstNonEmptyImage) {
          setImageUrl(firstNonEmptyImage);
          return;
        }
      }

      // Vérification du type d'image principale et traitement approprié
      if (!image) {
        setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
      } else if (image.startsWith('blob:')) {
        const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        setImageUrl(randomFallback);
      } else if (image.startsWith('http')) {
        setImageUrl(image);
      } else if (image.startsWith('/')) {
        if (image === '/placeholder.svg' || image.includes('lovable-uploads')) {
          setImageUrl(image);
        } else {
          setImageUrl(fallbackImages[Math.floor(Math.random() * fallbackImages.length)]);
        }
      } else {
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

  // Utiliser des hôtes avec photos réelles pour un design plus authentique comme Airbnb
  const hostName = host?.name || "Hôte";
  
  // Effet de livre ouvert lors du survol
  const bookOpenEffect = {
    closed: { 
      rotateY: 0,
      transition: { duration: 0.4 }
    },
    open: { 
      rotateY: 180,
      transition: { duration: 0.4 }
    }
  };

  // Badge aléatoire (soit "Coup de cœur voyageurs" soit "SHALOM JOB CENTER")
  const badgeType = Math.random() > 0.5 ? "favorite" : "jobcenter";

  return (
    <Link 
      to={`/logement/${id}`} 
      className="group block relative rounded-xl overflow-hidden h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        {badgeType === "favorite" ? (
          <Badge 
            variant="favorite" 
            className="px-3 py-1 text-sm shadow-sm flex items-center gap-1"
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            Coup de cœur voyageurs
          </Badge>
        ) : (
          <Badge 
            variant="jobcenter" 
            className="px-3 py-1 text-sm shadow-sm flex items-center gap-1"
          >
            <BookOpen className="h-3.5 w-3.5" />
            SHALOM JOB CENTER
          </Badge>
        )}
      </div>

      <div className="aspect-square w-full overflow-hidden relative rounded-xl">
        <motion.div
          className="h-full w-full"
          initial="closed"
          animate={isHovered ? "open" : "closed"}
          variants={bookOpenEffect}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Image principale */}
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover absolute backface-hidden transition-transform duration-500 group-hover:scale-110 rounded-xl"
            onError={(e) => {
              // Image de secours en cas d'erreur
              e.currentTarget.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
            }}
          />
          
          {/* Image verso (effet livre ouvert) */}
          {listing.images && listing.images.length > 1 ? (
            <img
              src={listing.images[1]}
              alt={`${title} - autre vue`}
              className="h-full w-full object-cover absolute backface-hidden transition-transform duration-500 rounded-xl"
              style={{ transform: "rotateY(180deg)" }}
              onError={(e) => {
                e.currentTarget.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
              }}
            />
          ) : (
            <div 
              className="h-full w-full object-cover absolute backface-hidden flex items-center justify-center bg-gray-100 rounded-xl"
              style={{ transform: "rotateY(180deg)" }}
            >
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </motion.div>
        
        <div className="absolute top-4 right-4 flex gap-2 z-10">
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

      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <h3 className="font-medium text-base">{neighborhood}</h3>
            <span className="text-gray-500 mx-1">·</span>
            <span className="text-gray-500 text-sm">{location.includes(',') ? location.split(',')[1].trim() : ''}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 text-black fill-black mr-1" />
            <span className="text-sm font-medium">{rating || "Nouveau"}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">Séjournez chez {hostName}</p>
        <p className="text-sm text-gray-500">{dates}</p>
        <p className="font-medium text-base mt-1">{priceFCFA.toLocaleString('fr-FR')} FCFA <span className="font-normal">par nuit</span></p>
      </div>
    </Link>
  );
};
