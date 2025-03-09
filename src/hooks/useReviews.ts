
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
    author: "Michel Dupont",
    rating: 4,
    comment: "Très bon séjour, appartement propre et bien situé",
    date: "2024-02-15",
    status: "approved"
  },
  {
    id: "2",
    listingId: "1",
    author: "Sophie Martin",
    rating: 5,
    comment: "Excellent accueil, je recommande vivement",
    date: "2024-02-16",
    status: "approved"
  },
];

export const useReviews = () => {
  const { loadData, saveData, getItem, setItem, hasItem } = useLocalStorage();
  const queryClient = useQueryClient();

  // Stocker la clé pour les avis dans une constante pour éviter les erreurs de frappe
  const REVIEWS_STORAGE_KEY = 'reviews';

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews'],
    queryFn: async (): Promise<Review[]> => {
      // Vérifier si des avis sont déjà stockés
      if (!hasItem(REVIEWS_STORAGE_KEY)) {
        console.log("Initialisation des avis avec les données par défaut");
        // Si c'est la première fois, enregistrer les avis initiaux
        setItem(REVIEWS_STORAGE_KEY, INITIAL_REVIEWS);
        return INITIAL_REVIEWS;
      }
      
      const storedReviews = getItem<Review[]>(REVIEWS_STORAGE_KEY, INITIAL_REVIEWS);
      console.log(`Chargement de ${storedReviews.length} avis depuis le localStorage`);
      return storedReviews;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false // Changé à false pour éviter de réinitialiser au focus
  });

  const updateReviewStatus = useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: Review['status'] }) => {
      // Récupérer les avis actuels directement depuis le stockage local
      const currentReviews = getItem<Review[]>(REVIEWS_STORAGE_KEY, []);
      
      const updatedReviews = currentReviews.map(review =>
        review.id === reviewId ? { ...review, status } : review
      );
      
      // Sauvegarder les avis mis à jour
      setItem(REVIEWS_STORAGE_KEY, updatedReviews);
      console.log(`Statut de l'avis ${reviewId} mis à jour: ${status}`);
      
      return { reviewId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Statut de l'avis mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut de l'avis");
    },
  });

  const updateReviewContent = useMutation({
    mutationFn: async (updatedReview: Review) => {
      // Récupérer les avis actuels directement depuis le stockage local
      const currentReviews = getItem<Review[]>(REVIEWS_STORAGE_KEY, []);
      
      const updatedReviews = currentReviews.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      );
      
      // Sauvegarder les avis mis à jour
      setItem(REVIEWS_STORAGE_KEY, updatedReviews);
      console.log(`Contenu de l'avis ${updatedReview.id} mis à jour`);
      
      return updatedReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Avis mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'avis");
    },
  });

  const addReview = useMutation({
    mutationFn: async (newReview: Omit<Review, "id" | "status" | "date">) => {
      // Récupérer les avis actuels directement depuis le stockage local
      const currentReviews = getItem<Review[]>(REVIEWS_STORAGE_KEY, []);
      
      const review = {
        ...newReview,
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const
      };
      
      // Ajouter le nouvel avis au début du tableau
      const updatedReviews = [review, ...currentReviews];
      
      // Sauvegarder les avis mis à jour
      setItem(REVIEWS_STORAGE_KEY, updatedReviews);
      console.log(`Nouvel avis ajouté pour l'annonce ${review.listingId}`);
      
      return review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Avis ajouté avec succès et en attente de modération");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'avis");
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      // Récupérer les avis actuels directement depuis le stockage local
      const currentReviews = getItem<Review[]>(REVIEWS_STORAGE_KEY, []);
      
      const updatedReviews = currentReviews.filter(review => review.id !== reviewId);
      
      // Sauvegarder les avis mis à jour
      setItem(REVIEWS_STORAGE_KEY, updatedReviews);
      console.log(`Avis ${reviewId} supprimé`);
      
      return reviewId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Avis supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'avis");
    },
  });

  return {
    reviews,
    isLoading,
    error,
    updateReviewStatus,
    updateReviewContent,
    addReview,
    deleteReview,
  };
};
