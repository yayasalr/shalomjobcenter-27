
import { Star } from "lucide-react";
import { Listing } from "@/types/listing";

interface ListingCardContentProps {
  listing: Listing;
}

export const ListingCardContent = ({ listing }: ListingCardContentProps) => {
  const { location, rating, dates, price, host } = listing;

  // Conversion du prix en FCFA
  const priceFCFA = Math.round(price * 655.957); // Conversion d'euros en FCFA

  // Extraction et affichage du quartier depuis la localisation
  const neighborhood = location ? location.split(',')[0].trim() : 'Lomé';
  
  // Utiliser des hôtes avec photos réelles pour un design plus authentique
  const hostName = host?.name || "Contacter l'hôte";

  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <h3 className="font-medium text-base text-gray-800">{neighborhood}</h3>
          <span className="text-gray-500 mx-1">·</span>
          <span className="text-gray-500 text-sm">{location.includes(',') ? location.split(',')[1].trim() : ''}</span>
        </div>
        <div className="flex items-center">
          <Star className="h-3.5 w-3.5 text-black fill-black mr-1" />
          <span className="text-sm font-medium">{rating || "Aujourd'hui"}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500">Séjour chez {hostName}</p>
      <p className="text-sm text-gray-500">{dates}</p>
      <p className="font-medium text-base mt-1">{priceFCFA.toLocaleString('fr-FR')} FCFA <span className="font-normal">par mois</span></p>
    </div>
  );
};
