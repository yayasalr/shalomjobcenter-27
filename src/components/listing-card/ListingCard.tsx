
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Listing } from "@/types/listing";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ListingCardImage from "./ListingCardImage"; // Fixed import
import { ListingCardContent } from "./ListingCardContent";
import { ListingCardBadge } from "./ListingCardBadge";
import { getFallbackImage } from "./utils";

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const { id, title } = listing;
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
        setImageUrl(getFallbackImage(fallbackImages));
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
      if (!listing.image) {
        setImageUrl(getFallbackImage(fallbackImages));
      } else if (listing.image.startsWith('blob:')) {
        const randomFallback = getFallbackImage(fallbackImages);
        setImageUrl(randomFallback);
      } else if (listing.image.startsWith('http')) {
        setImageUrl(listing.image);
      } else if (listing.image.startsWith('/')) {
        if (listing.image === '/placeholder.svg' || listing.image.includes('lovable-uploads')) {
          setImageUrl(listing.image);
        } else {
          setImageUrl(getFallbackImage(fallbackImages));
        }
      } else {
        setImageUrl(getFallbackImage(fallbackImages));
      }
    };
    
    processImageUrl();
  }, [listing.image, id, listing.images, fallbackImages]);

  // Vérification si le logement est déjà dans les favoris
  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      const favList = JSON.parse(favorites);
      setIsFavorite(favList.includes(id));
    }
  }, [id]);

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
        <ListingCardBadge type={badgeType} />
      </div>

      <ListingCardImage 
        listing={listing}
        imageUrl={imageUrl}
        title={title}
        isHovered={isHovered}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        fallbackImages={fallbackImages}
      />

      <ListingCardContent listing={listing} />
    </Link>
  );
};
