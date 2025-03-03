
import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ReviewFormProps {
  onSubmit: () => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  isAuthenticated: boolean;
}

const ReviewForm = ({
  onSubmit,
  reviewText,
  setReviewText,
  reviewRating,
  setReviewRating,
  isAuthenticated,
}: ReviewFormProps) => {
  const navigate = useNavigate();

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour laisser un avis");
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    onSubmit();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Laisser un avis</h3>
      <div className="flex items-center mb-4">
        <div className="flex mr-4">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => isAuthenticated && setReviewRating(rating)}
              className={`focus:outline-none transition-transform ${isAuthenticated ? 'hover:scale-110' : 'cursor-not-allowed opacity-80'}`}
              disabled={!isAuthenticated}
            >
              <Star
                className={`h-5 w-5 ${
                  rating <= reviewRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500">{reviewRating} sur 5</span>
      </div>
      <Textarea
        placeholder={
          isAuthenticated ? "Partagez votre expérience..." : "Connectez-vous pour laisser un avis"
        }
        className="mb-4 border-gray-300 focus:border-primary"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        disabled={!isAuthenticated}
      />
      <Button
        onClick={handleSubmitReview}
        disabled={!isAuthenticated || reviewText.trim() === ""}
        className="w-full sm:w-auto bg-airbnb-red hover:bg-airbnb-red/90"
      >
        {isAuthenticated ? "Publier" : "Connectez-vous pour publier"}
      </Button>
    </div>
  );
};

export default ReviewForm;
