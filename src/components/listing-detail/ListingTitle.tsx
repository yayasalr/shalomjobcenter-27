
import React from "react";
import { MapPin } from "lucide-react";

interface ListingTitleProps {
  title: string;
  location: string;
}

const ListingTitle = ({ title, location }: ListingTitleProps) => (
  <div className="mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <div className="flex items-center text-gray-600">
      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
      <span className="truncate">{location}</span>
    </div>
  </div>
);

export default ListingTitle;
