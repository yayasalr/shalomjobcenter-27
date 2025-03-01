
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useReviews } from "@/hooks/useReviews";

// Imported components
import ListingNotFound from "@/components/listing-detail/ListingNotFound";
import ImageGallery from "@/components/listing-detail/ImageGallery";
import ListingTitle from "@/components/listing-detail/ListingTitle";
import HostInfo from "@/components/listing-detail/HostInfo";
import ReservationCard from "@/components/listing-detail/ReservationCard";
import SimilarListingCard from "@/components/listing-detail/SimilarListingCard";
import LoadingSkeleton from "@/components/listing-detail/LoadingSkeleton";
import DescriptionTab from "@/components/listing-detail/TabsContent/DescriptionTab";
import EquipmentTab from "@/components/listing-detail/TabsContent/EquipmentTab";
import LocationTab from "@/components/listing-detail/TabsContent/LocationTab";
import ReviewsTab from "@/components/listing-detail/TabsContent/ReviewsTab";

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

  // Traitement des images
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

  // Vérifier si le logement est dans les favoris
  useEffect(() => {
    if (id) {
      const favorites = localStorage.getItem("favorites");
      if (favorites) {
        const favList = JSON.parse(favorites);
        setIsFavorite(favList.includes(id));
      }
    }
  }, [id]);

  // Charger les avis pour ce logement
  useEffect(() => {
    if (id && reviews) {
      const filteredReviews = reviews.filter(
        (review) => review.listingId === id && review.status === "approved"
      );

      // Si aucun avis n'est trouvé, ajouter des avis fictifs pour la démo
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

    // Convertir les dates en objets Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérifier si les dates sont valides
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Dates invalides");
      return;
    }

    // Vérifier si la date de début est avant la date de fin
    if (start >= end) {
      toast.error("La date de départ doit être après la date d'arrivée");
      return;
    }

    // Calcul du nombre de jours
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!listing) return;

    // Créer l'objet de réservation
    const reservation = {
      listingId: listing.id,
      userId: user.id,
      startDate,
      endDate,
      guestCount,
      totalPrice: diffDays * listing.price,
      status: "pending",
    };

    // Envoyer la réservation
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

        // Ajouter temporairement l'avis à la liste locale
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

  // Affichage du prix en FCFA
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString("fr-FR");
  };

  // Calcul de la note moyenne
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
      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Bouton retour */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux logements</span>
        </Link>

        {/* Titre et localisation */}
        <ListingTitle title={listing.title} location={listing.location} />

        {/* Galerie d'images */}
        <ImageGallery images={processedImages} title={listing.title} />

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations et description */}
          <div className="lg:col-span-2">
            <HostInfo host={listing.host} />

            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="w-full grid grid-cols-4 sm:w-auto md:inline-flex">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="equipment">Équipements</TabsTrigger>
                <TabsTrigger value="location">Localisation</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({listingReviews.length})</TabsTrigger>
              </TabsList>

              <DescriptionTab description={listing.description} />
              <EquipmentTab />
              <LocationTab mapLocation={listing.mapLocation} />
              <ReviewsTab
                averageRating={averageRating}
                reviewCount={listingReviews.length}
                listingReviews={listingReviews}
                reviewText={reviewText}
                setReviewText={setReviewText}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                isAuthenticated={!!user}
                handleSubmitReview={handleSubmitReview}
              />
            </Tabs>
          </div>

          {/* Carte de réservation */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ReservationCard
              price={formatPriceFCFA(listing.price)}
              averageRating={averageRating}
              reviewCount={listingReviews.length}
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
            />
          </div>
        </div>

        {/* Logements similaires */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Logements similaires</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {listings
              .filter((item) => item.id !== listing.id)
              .slice(0, 4)
              .map((item) => (
                <SimilarListingCard
                  key={item.id}
                  item={item}
                  formatPriceFCFA={formatPriceFCFA}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
