
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useReviews } from "@/hooks/useReviews";

// Imported components
import ListingNotFound from "@/components/listing-detail/ListingNotFound";
import ListingDetailContainer from "@/components/listing-detail/ListingDetailContainer";
import LoadingSkeleton from "@/components/listing-detail/LoadingSkeleton";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { listings, isLoading, addReservation } = useListings();
  const { settings } = useSiteSettings();
  const { reviews, addReview } = useReviews();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [guestCount, setGuestCount] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [listingReviews, setListingReviews] = useState<any[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);

  const listing = listings?.find((listing) => listing.id === id);

  // Process images
  useEffect(() => {
    if (listing) {
      const fallbackImages = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800",
      ];

      const validateImage = (url: string, index: number) => {
        if (!url || url.startsWith("blob:")) {
          return fallbackImages[index % fallbackImages.length];
        }
        return url;
      };

      if (listing.images && listing.images.length > 0) {
        const processed = listing.images.map((img, idx) => validateImage(img, idx));
        setProcessedImages(processed);
      } else if (listing.image) {
        setProcessedImages([validateImage(listing.image, 0)]);
      } else {
        setProcessedImages([fallbackImages[0]]);
      }
    }
  }, [listing]);

  // Check if listing is in favorites
  useEffect(() => {
    if (id) {
      const favorites = localStorage.getItem("favorites");
      if (favorites) {
        const favList = JSON.parse(favorites);
        setIsFavorite(favList.includes(id));
      }
    }
  }, [id]);

  // Load reviews for this listing
  useEffect(() => {
    if (id && reviews) {
      const filteredReviews = reviews.filter(
        (review) => review.listingId === id && review.status === "approved"
      );

      // Add demo reviews if none found
      if (filteredReviews.length === 0) {
        setListingReviews([
          {
            id: "demo1",
            author: "Michel Dupont",
            avatar: "/placeholder.svg",
            rating: 5,
            date: "Mars 2024",
            comment:
              "Superbe logement, très bien situé. Le propriétaire est très accueillant. Je recommande vivement !",
          },
          {
            id: "demo2",
            author: "Sophie Martin",
            avatar: "/placeholder.svg",
            rating: 4,
            date: "Février 2024",
            comment:
              "Appartement conforme aux photos, propre et fonctionnel. Un peu bruyant le soir mais globalement un bon séjour.",
          },
        ]);
      } else {
        setListingReviews(filteredReviews);
      }
    }
  }, [id, reviews]);

  const handleReservation = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour réserver");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner des dates");
      return;
    }

    // Convert dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Dates invalides");
      return;
    }

    // Ensure start date is before end date
    if (start >= end) {
      toast.error("La date de départ doit être après la date d'arrivée");
      return;
    }

    // Calculate number of days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!listing) return;

    // Create reservation object
    const reservation = {
      listingId: listing.id,
      userId: user.id,
      startDate,
      endDate,
      guestCount,
      totalPrice: diffDays * listing.price,
      status: "pending",
    };

    // Submit reservation
    addReservation.mutate(reservation, {
      onSuccess: () => {
        toast.success("Réservation effectuée avec succès !");
      },
      onError: () => {
        toast.error("Erreur lors de la réservation");
      },
    });
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour laisser un avis");
      return;
    }

    if (reviewText.trim() === "") {
      toast.error("Veuillez écrire un commentaire");
      return;
    }

    if (!id) return;

    const newReview = {
      listingId: id,
      author: user.name,
      rating: reviewRating,
      comment: reviewText,
    };

    addReview.mutate(newReview, {
      onSuccess: () => {
        toast.success("Votre avis a été soumis pour modération");
        setReviewText("");

        // Add review temporarily to local list
        setListingReviews((prev) => [
          {
            id: Math.random().toString(36).substring(7),
            author: user.name,
            avatar: user.avatar || "/placeholder.svg",
            rating: reviewRating,
            date: new Date().toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            }),
            comment: reviewText,
            status: "pending",
          },
          ...prev,
        ]);
      },
    });
  };

  // Toggle favorite
  const toggleFavorite = () => {
    if (!id) return;

    let favorites: string[] = [];
    const storedFavorites = localStorage.getItem("favorites");

    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }

    if (isFavorite) {
      favorites = favorites.filter((favId) => favId !== id);
      toast.success("Retiré des favoris");
    } else {
      favorites.push(id);
      toast.success("Ajouté aux favoris");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Format price in FCFA
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString("fr-FR");
  };

  // Calculate average rating
  const averageRating =
    listingReviews.reduce((acc, review) => acc + review.rating, 0) /
    (listingReviews.length || 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ListingNotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ListingDetailContainer
        listing={listing}
        processedImages={processedImages}
        listings={listings}
        averageRating={averageRating}
        listingReviews={listingReviews}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        handleReservation={handleReservation}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        primaryColor={settings.primaryColor}
        reviewText={reviewText}
        setReviewText={setReviewText}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        isAuthenticated={!!user}
        handleSubmitReview={handleSubmitReview}
        formatPriceFCFA={formatPriceFCFA}
      />
    </div>
  );
};

export default ListingDetail;
