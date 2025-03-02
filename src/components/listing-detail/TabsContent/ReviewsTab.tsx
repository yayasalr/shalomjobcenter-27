
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Star, Info } from "lucide-react";
import ReviewForm from "../ReviewForm";
import ReviewItem from "../ReviewItem";

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  status?: string;
}

export interface ReviewsTabProps {
  averageRating: number;
  reviewCount: number;
  listingReviews: Review[];
  reviewText: string;
  setReviewText: (text: string) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  isAuthenticated: boolean;
  handleSubmitReview: () => void;
}

const ReviewsTab = ({
  averageRating,
  reviewCount,
  listingReviews,
  reviewText,
  setReviewText,
  reviewRating,
  setReviewRating,
  isAuthenticated,
  handleSubmitReview,
}: ReviewsTabProps) => (
  <TabsContent value="reviews" className="animate-fade-in space-y-8 pt-4">
    {/* En-tête des avis */}
    <div className="flex items-center mb-6">
      <div className="flex items-center mr-4">
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
        <span className="font-semibold">{averageRating.toFixed(1)}</span>
      </div>
      <span className="text-gray-600">·</span>
      <span className="ml-4 text-gray-700">{reviewCount} avis</span>
    </div>

    {/* Formulaire d'avis */}
    <ReviewForm
      onSubmit={handleSubmitReview}
      reviewText={reviewText}
      setReviewText={setReviewText}
      reviewRating={reviewRating}
      setReviewRating={setReviewRating}
      isAuthenticated={isAuthenticated}
    />

    {/* Liste des avis */}
    <div className="space-y-6 mt-8">
      {listingReviews.length > 0 ? (
        listingReviews.map((review) => <ReviewItem key={review.id} review={review} />)
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">
            Aucun avis pour le moment. Soyez le premier à donner votre avis !
          </p>
        </div>
      )}
    </div>
  </TabsContent>
);

export default ReviewsTab;
