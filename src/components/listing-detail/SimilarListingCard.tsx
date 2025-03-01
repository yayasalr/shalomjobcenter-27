
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface SimilarListingCardProps {
  item: {
    id: string;
    title: string;
    location: string;
    image: string;
    price: number;
    rating?: number;
  };
  formatPriceFCFA: (price: number) => string;
}

const SimilarListingCard = ({ item, formatPriceFCFA }: SimilarListingCardProps) => (
  <Link to={`/logement/${item.id}`} className="group block m-2">
    <div className="aspect-video overflow-hidden rounded-xl">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
        }}
      />
    </div>
    <div className="mt-4 px-2">
      <div className="flex justify-between">
        <h3 className="font-medium line-clamp-1 minimal-text">{item.location}</h3>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span>{item.rating || "Nouveau"}</span>
        </div>
      </div>
      <p className="text-gray-500 text-sm line-clamp-1 minimal-text mt-1">{item.title}</p>
      <p className="font-medium mt-2">{formatPriceFCFA(item.price)} FCFA</p>
    </div>
  </Link>
);

export default SimilarListingCard;
