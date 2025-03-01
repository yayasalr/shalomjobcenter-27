
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
  Users, 
  ChevronLeft,
  Check,
  Info,
  ExternalLink
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useReviews } from "@/hooks/useReviews";

// Composants extraits pour améliorer la lisibilité
const ListingNotFound = () => (
  <div className="text-center py-16">
    <h2 className="text-2xl font-bold text-gray-900">
      Logement non trouvé
    </h2>
    <p className="mt-2 text-gray-600">
      Le logement que vous recherchez n'existe pas ou a été supprimé.
    </p>
    <Link to="/">
      <Button className="mt-6">Retour à l'accueil</Button>
    </Link>
  </div>
);

const ImageGallery = ({ images, title }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-8">
      <div className="relative overflow-hidden rounded-lg md:col-span-8 h-[300px] md:h-[450px]">
        <img
          src={images[selectedImageIndex] || images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm"
          onClick={() => setSelectedImageIndex(0)}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 md:col-span-4">
        {images
          .slice(1, 5)
          .map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg cursor-pointer h-[120px] md:h-[110px] hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImageIndex(index + 1)}
            >
              <img
                src={image}
                alt={`${title} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 3 && images.length > 5 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-60 transition-all">
                      <span className="text-lg font-semibold">
                        +{images.length - 5} photos
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {images.map((image, i) => (
                          <CarouselItem key={i}>
                            <div className="aspect-video w-full overflow-hidden rounded-xl">
                              <img
                                src={image}
                                alt={`${title} - Image ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const ListingTitle = ({ title, location }) => (
  <div className="mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <div className="flex items-center text-gray-600">
      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
      <span className="truncate">{location}</span>
    </div>
  </div>
);

const HostInfo = ({ host }) => (
  <div className="flex justify-between items-start mb-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Hébergé par {host?.name || "l'hôte"}
      </h2>
      <p className="text-gray-600 text-sm">Membre depuis 2022</p>
    </div>
    <Avatar className="h-12 w-12 border-2 border-primary shadow-sm hover:scale-105 transition-transform">
      <AvatarImage src={host?.image || "/placeholder.svg"} />
      <AvatarFallback>{(host?.name || "Hôte")[0]}</AvatarFallback>
    </Avatar>
  </div>
);

const ReviewForm = ({ onSubmit, reviewText, setReviewText, reviewRating, setReviewRating, isAuthenticated }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <h3 className="text-lg font-medium mb-4">Laisser un avis</h3>
    <div className="flex items-center mb-4">
      <div className="flex mr-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setReviewRating(rating)}
            className="focus:outline-none transition-transform hover:scale-110"
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
      <span className="text-sm text-gray-500">
        {reviewRating} sur 5
      </span>
    </div>
    <Textarea
      placeholder={isAuthenticated ? "Partagez votre expérience..." : "Connectez-vous pour laisser un avis"}
      className="mb-4 border-gray-300 focus:border-primary"
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      disabled={!isAuthenticated}
    />
    <Button 
      onClick={onSubmit} 
      disabled={!isAuthenticated || reviewText.trim() === ""}
      className="w-full sm:w-auto"
    >
      {isAuthenticated ? "Publier" : "Connectez-vous pour publier"}
    </Button>
  </div>
);

const ReviewItem = ({ review }) => (
  <div className="border-b pb-6 last:border-b-0">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={review.avatar || "/placeholder.svg"} />
          <AvatarFallback>{review.author?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{review.author}</h4>
          <p className="text-sm text-gray-500">{review.date}</p>
        </div>
      </div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star
            key={rating}
            className={`h-4 w-4 ${
              rating <= review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
    <p className="text-gray-700">{review.comment}</p>
  </div>
);

const ReservationCard = ({ 
  price, 
  averageRating, 
  reviewCount, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  guestCount, 
  setGuestCount,
  handleReservation,
  isFavorite,
  toggleFavorite,
  primaryColor
}) => (
  <Card className="border shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold">{price} FCFA</span>
          <span className="text-gray-600"> / nuit</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-sm">
            {averageRating.toFixed(1)} · {reviewCount} avis
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x">
          <div className="p-3">
            <label className="block text-xs text-gray-500 mb-1">ARRIVÉE</label>
            <input
              type="date"
              className="w-full focus:outline-none text-sm"
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="p-3">
            <label className="block text-xs text-gray-500 mb-1">DÉPART</label>
            <input
              type="date"
              className="w-full focus:outline-none text-sm"
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <Separator />
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">VOYAGEURS</label>
          <select
            className="w-full focus:outline-none text-sm"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} voyageur{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button 
        className="w-full rounded-md" 
        onClick={handleReservation}
        style={{ backgroundColor: primaryColor }}
      >
        Réserver
      </Button>
      
      <Button
        variant="outline"
        className="w-full flex items-center justify-center rounded-md"
        onClick={toggleFavorite}
      >
        <Heart
          className={`mr-2 h-4 w-4 ${
            isFavorite ? "fill-airbnb-red text-airbnb-red" : ""
          }`}
        />
        {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      </Button>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{price} FCFA x 7 nuits</span>
          <span>{price * 7} FCFA</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frais de service</span>
          <span>{Math.round(price * 7 * 0.12)} FCFA</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold pt-2">
          <span>Total</span>
          <span>{price * 7 + Math.round(price * 7 * 0.12)} FCFA</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SimilarListingCard = ({ item, formatPriceFCFA }) => (
  <Link
    to={`/logement/${item.id}`}
    className="group block"
  >
    <div className="aspect-square overflow-hidden rounded-xl">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
        }}
      />
    </div>
    <div className="mt-3">
      <div className="flex justify-between">
        <h3 className="font-medium line-clamp-1">{item.location}</h3>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span>{item.rating || "Nouveau"}</span>
        </div>
      </div>
      <p className="text-gray-500 text-sm line-clamp-1">{item.title}</p>
      <p className="font-medium mt-1">{formatPriceFCFA(item.price)} FCFA</p>
    </div>
  </Link>
);

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
        "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800"
      ];

      const validateImage = (url: string, index: number) => {
        if (!url || url.startsWith('blob:')) {
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
      const favorites = localStorage.getItem('favorites');
      if (favorites) {
        const favList = JSON.parse(favorites);
        setIsFavorite(favList.includes(id));
      }
    }
  }, [id]);

  // Charger les avis pour ce logement
  useEffect(() => {
    if (id && reviews) {
      const filteredReviews = reviews.filter(review => 
        review.listingId === id && review.status === 'approved'
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
            comment: "Superbe logement, très bien situé. Le propriétaire est très accueillant. Je recommande vivement !",
          },
          {
            id: "demo2",
            author: "Sophie Martin",
            avatar: "/placeholder.svg",
            rating: 4,
            date: "Février 2024",
            comment: "Appartement conforme aux photos, propre et fonctionnel. Un peu bruyant le soir mais globalement un bon séjour.",
          }
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
      status: 'pending'
    };
    
    // Envoyer la réservation
    addReservation.mutate(reservation, {
      onSuccess: () => {
        toast.success("Réservation effectuée avec succès !");
      },
      onError: () => {
        toast.error("Erreur lors de la réservation");
      }
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
      comment: reviewText
    };
    
    addReview.mutate(newReview, {
      onSuccess: () => {
        toast.success("Votre avis a été soumis pour modération");
        setReviewText("");
        
        // Ajouter temporairement l'avis à la liste locale
        setListingReviews(prev => [
          {
            id: Math.random().toString(36).substring(7),
            author: user.name,
            avatar: user.avatar || "/placeholder.svg",
            rating: reviewRating,
            date: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
            comment: reviewText,
            status: 'pending'
          },
          ...prev
        ]);
      }
    });
  };
  
  // Toggle favorite
  const toggleFavorite = () => {
    if (!id) return;
    
    let favorites: string[] = [];
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }
    
    if (isFavorite) {
      favorites = favorites.filter(favId => favId !== id);
      toast.success("Retiré des favoris");
    } else {
      favorites.push(id);
      toast.success("Ajouté aux favoris");
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Affichage du prix en FCFA
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString('fr-FR');
  };

  // Calcul de la note moyenne
  const averageRating = listingReviews.reduce((acc, review) => acc + review.rating, 0) / 
                        (listingReviews.length || 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <Skeleton className="h-8 w-2/3 sm:w-1/3 mb-4" />
            <Skeleton className="h-4 w-1/2 sm:w-1/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <Skeleton className="h-[300px] md:h-[450px] rounded-lg md:col-span-8" />
              <div className="grid grid-cols-2 gap-4 md:col-span-4">
                <Skeleton className="h-[150px] rounded-lg" />
                <Skeleton className="h-[150px] rounded-lg" />
                <Skeleton className="h-[150px] rounded-lg" />
                <Skeleton className="h-[150px] rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex space-x-4">
                  <Skeleton className="h-10 w-20 rounded" />
                  <Skeleton className="h-10 w-20 rounded" />
                  <Skeleton className="h-10 w-20 rounded" />
                </div>
              </div>
              <div>
                <Skeleton className="h-[380px] rounded-lg" />
              </div>
            </div>
          </div>
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
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group transition-colors">
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
              
              <TabsContent value="description" className="animate-fade-in pt-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{listing.description || "Aucune description disponible."}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="equipment" className="animate-fade-in pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>4 voyageurs maximum</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>Disponible toute l'année</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
                    <Check className="h-5 w-5 text-gray-500" />
                    <span>Wifi gratuit</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
                    <Check className="h-5 w-5 text-gray-500" />
                    <span>Climatisation</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
                    <Check className="h-5 w-5 text-gray-500" />
                    <span>TV écran plat</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors">
                    <Check className="h-5 w-5 text-gray-500" />
                    <span>Cuisine équipée</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="animate-fade-in pt-4">
                <div className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                  {listing.mapLocation ? (
                    <iframe 
                      src={listing.mapLocation} 
                      width="100%" 
                      height="450" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg w-full h-full"
                    ></iframe>
                  ) : (
                    <div className="text-gray-500 text-center p-8">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">Carte de localisation non disponible</p>
                      <p className="mt-2">Le propriétaire n'a pas encore ajouté d'emplacement précis.</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Voir le quartier
                  </Button>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ouvrir dans Google Maps
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="animate-fade-in space-y-8 pt-4">
                {/* En-tête des avis */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-600">·</span>
                  <span className="ml-4 text-gray-700">{listingReviews.length} avis</span>
                </div>
                
                {/* Formulaire d'avis */}
                <ReviewForm 
                  onSubmit={handleSubmitReview}
                  reviewText={reviewText}
                  setReviewText={setReviewText}
                  reviewRating={reviewRating}
                  setReviewRating={setReviewRating}
                  isAuthenticated={!!user}
                />
                
                {/* Liste des avis */}
                <div className="space-y-6 mt-8">
                  {listingReviews.length > 0 ? (
                    listingReviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
                    </div>
                  )}
                </div>
              </TabsContent>
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
