
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CompareButton } from "./CompareButton";

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
    <Link to={`/logement/${id}`} className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.log("Erreur de chargement d'image pour:", title);
            // Image de secours en cas d'erreur
            e.currentTarget.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
          }}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <CompareButton listingId={id} />
          <button
            onClick={toggleFavorite}
            className="p-2 rounded-full bg-white hover:bg-gray-100/90"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite
                  ? "fill-airbnb-red stroke-airbnb-red animate-heart-beat"
                  : "stroke-gray-600"
              }`}
            />
          </button>
        </div>
        
        {/* Badge de prix en FCFA */}
        <div 
          className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-white font-medium text-sm"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {priceFCFA.toLocaleString('fr-FR')} FCFA
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{location}</h3>
            <p className="text-sm text-gray-500">
              Séjournez chez {host?.name || "l'hôte"}
            </p>
            <p className="text-sm text-gray-500">{dates}</p>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              className="h-4 w-4 text-yellow-400 fill-yellow-400"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">{rating || "Nouveau"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
