
import { Heart, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Listing } from "@/types/listing";

interface ListingCardImageProps {
  listing: Listing;
  imageUrl: string;
  title: string;
  isHovered: boolean;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  fallbackImages: string[];
}

export const ListingCardImage = ({ 
  listing, 
  imageUrl, 
  title, 
  isHovered, 
  isFavorite, 
  setIsFavorite,
  fallbackImages
}: ListingCardImageProps) => {
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

  // Gestion des favoris
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    
    let favorites: string[] = [];
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }
    
    if (isFavorite) {
      favorites = favorites.filter(favId => favId !== listing.id);
      toast.success("Retiré des favoris");
    } else {
      favorites.push(listing.id);
      toast.success("Ajouté aux favoris");
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
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
  );
};
