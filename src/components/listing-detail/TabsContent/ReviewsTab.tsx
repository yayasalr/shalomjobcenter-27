
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Star, Info } from "lucide-react";
import ReviewForm from "../ReviewForm";
import ReviewItem from "../ReviewItem";
import { useNavigate } from "react-router-dom";

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
}: ReviewsTabProps) => {
  const navigate = useNavigate();

  return (
    <TabsContent value="reviews" className="animate-fade-in space-y-8 pt-4">
      {/* En-tête des avis */}
      <div className="flex items-center mb-6">
        <div className="flex items-center mr-4">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-gray-600">·</span>
        <span className="ml-4 text-airbnb-gray-300">{reviewCount} avis</span>
      </div>

      {/* Formulaire d'avis */}
      <div className="transition-all duration-300 hover:shadow-md">
        <ReviewForm
          onSubmit={handleSubmitReview}
          reviewText={reviewText}
          setReviewText={setReviewText}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          isAuthenticated={isAuthenticated}
        />
      </div>

      {/* Liste des avis */}
      <div className="space-y-6 mt-8">
        {listingReviews.length > 0 ? (
          listingReviews.map((review, index) => (
            <div 
              key={review.id} 
              className="transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ReviewItem review={review} />
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 duration-300">
            <Info className="h-12 w-12 mx-auto text-airbnb-red/70 mb-2 animate-bounce-sm" />
            <p className="text-airbnb-gray-300">
              Aucun avis pour le moment. {isAuthenticated ? "Soyez le premier à donner votre avis !" : "Connectez-vous pour laisser un avis !"}
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default ReviewsTab;
