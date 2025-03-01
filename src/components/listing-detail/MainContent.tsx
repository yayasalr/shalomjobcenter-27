
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostInfo from "./HostInfo";
import DescriptionTab from "./TabsContent/DescriptionTab";
import EquipmentTab from "./TabsContent/EquipmentTab";
import LocationTab from "./TabsContent/LocationTab";
import ReviewsTab from "./TabsContent/ReviewsTab";

interface MainContentProps {
  host?: {
    name?: string;
    image?: string;
  };
  description?: string;
  mapLocation?: string;
  averageRating: number;
  reviewCount: number;
  listingReviews: any[];
  reviewText: string;
  setReviewText: (text: string) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  isAuthenticated: boolean;
  handleSubmitReview: () => void;
}

const MainContent = ({
  host,
  description,
  mapLocation,
  averageRating,
  reviewCount,
  listingReviews,
  reviewText,
  setReviewText,
  reviewRating,
  setReviewRating,
  isAuthenticated,
  handleSubmitReview,
}: MainContentProps) => {
  return (
    <div className="lg:col-span-2">
      <HostInfo host={host} />

      <Tabs defaultValue="description" className="space-y-6">
        <TabsList className="w-full grid grid-cols-4 sm:w-auto md:inline-flex">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="location">Localisation</TabsTrigger>
          <TabsTrigger value="reviews">Avis ({reviewCount})</TabsTrigger>
        </TabsList>

        <DescriptionTab description={description} />
        <EquipmentTab />
        <LocationTab mapLocation={mapLocation} />
        <ReviewsTab
          averageRating={averageRating}
          reviewCount={reviewCount}
          listingReviews={listingReviews}
          reviewText={reviewText}
          setReviewText={setReviewText}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          isAuthenticated={isAuthenticated}
          handleSubmitReview={handleSubmitReview}
        />
      </Tabs>
    </div>
  );
};

export default MainContent;
