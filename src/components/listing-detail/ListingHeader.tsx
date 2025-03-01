
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ListingTitle from "./ListingTitle";

interface ListingHeaderProps {
  title: string;
  location: string;
  rating?: number;
}

const ListingHeader = ({ title, location, rating }: ListingHeaderProps) => {
  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        <span>Retour aux logements</span>
      </Link>

      <ListingTitle title={title} location={location} rating={rating} />
    </>
  );
};

export default ListingHeader;
