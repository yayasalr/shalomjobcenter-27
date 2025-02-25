
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useLocalStorage from "./useLocalStorage";

export interface Review {
  id: string;
  listingId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Données initiales pour les avis
const INITIAL_REVIEWS: Review[] = [
  {
    id: "1",
    listingId: "1",
    author: "John Doe",
    rating: 4,
    comment: "Très bon séjour, appartement propre et bien situé",
    date: "2024-02-15",
    status: "pending"
  },
  {
    id: "2",
    listingId: "2",
    author: "Jane Smith",
    rating: 5,
    comment: "Excellent accueil, je recommande vivement",
    date: "2024-02-16",
    status: "approved"
  },
];

export const useReviews = () => {
  const { loadData, saveData } = useLocalStorage();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async (): Promise<Review[]> => {
      return loadData('reviews', INITIAL_REVIEWS);
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const updateReviewStatus = useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: Review['status'] }) => {
      const currentReviews = loadData('reviews', INITIAL_REVIEWS);
      const updatedReviews = currentReviews.map(review =>
        review.id === reviewId ? { ...review, status } : review
      );
      saveData('reviews', updatedReviews);
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
      const currentReviews = loadData('reviews', INITIAL_REVIEWS);
      const updatedReviews = currentReviews.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      );
      saveData('reviews', updatedReviews);
      return up