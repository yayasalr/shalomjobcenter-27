
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ListingTitle from "./ListingTitle";
import { BackButton } from "@/components/shared/BackButton";

interface ListingHeaderProps {
  title: string;
  location: string;
  rating?: number;
}

const ListingHeader = ({ title, location, rating }: ListingHeaderProps) => {
  return (
    <>
      <BackButton />
      <ListingTitle title={title} location={location} rating={rating} />
    </>
  );
};

export default ListingHeader;
