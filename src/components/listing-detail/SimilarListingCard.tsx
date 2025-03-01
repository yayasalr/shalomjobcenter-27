
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  <Link to={`/logement/${item.id}`} className="block h-full">
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
          }}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className="font-medium line-clamp-1 minimal-text">{item.location}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{item.rating || "Nouveau"}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-1 minimal-text mt-1">{item.title}</p>
        <p className="font-medium mt-1">{formatPriceFCFA(item.price)} FCFA</p>
      </CardContent>
    </Card>
  </Link>
);

export default SimilarListingCard;
