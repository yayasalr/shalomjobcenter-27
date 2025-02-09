
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Review {
  id: string;
  listingId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const useReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async (): Promise<Review[]> => {
      // Mock data with proper typing
      return [
        {
          id: "1",
          listingId: "1",
          author: "John Doe",
          rating: 4,
          comment: "Très bon séjour, appartement propre et bien situé",
          date: "2024-02-15",
          status: "pending" as const
        },
        {
          id: "2",
          listingId: "2",
          author: "Jane Smith",
          rating: 5,
          comment: "Excellent accueil, je recommande vivement",
          date: "2024-02-16",
          status: "approved" as const
        },
      ];
    },
  });

  const updateReviewStatus = useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: 'approved' | 'rejected' }) => {
      // Simulation de l'API
      console.log(`Updating review ${reviewId} to ${status}`);
      return { reviewId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success("Statut de l'avis mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut de l'avis");
    },
  });

  const updateReviewContent = useMutation({
    mutationFn: async (updatedReview: Review) => {
      // Simulation de l'API
      console.log('Updating review content:', updatedReview);
      return updatedReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success("Avis mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'avis");
    },
  });

  return {
    reviews,
    isLoading,
    error,
    updateReviewStatus,
    updateReviewContent,
  };
};
