
import React from "react";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ListingTitleProps {
  title: string;
  location: string;
  rating?: number;
}

const ListingTitle = ({ title, location, rating }: ListingTitleProps) => (
  <div className="mb-8 w-full">
    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 font-serif leading-tight">
      {title}
    </h1>
    <div className="flex flex-wrap items-center gap-4 text-gray-600">
      <div className="flex items-center">
        <MapPin className="h-5 w-5 mr-1.5 flex-shrink-0 text-sholom-primary" />
        <span className="text-base">{location}</span>
      </div>
      
      {rating && (
        <div className="flex items-center">
          <Star className="h-5 w-5 mr-1.5 flex-shrink-0 text-amber-500 fill-amber-500" />
          <span className="text-base font-medium">{rating.toFixed(1)}</span>
        </div>
      )}
      
      <Badge variant="outline" className="bg-sholom-secondary text-sholom-primary border-none">
        Logement vérifié
      </Badge>
    </div>
  </div>
);

export default ListingTitle;
