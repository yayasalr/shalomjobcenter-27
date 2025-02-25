
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Star, Heart, Share2, Users } from "lucide-react";
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
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { listings, isLoading } = useListings();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([
    {
      id: "1",
      author: "Michel Dupont",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "Mars 2024",
      text: "Superbe logement, très bien situé. Le propriétaire est très accueillant. Je recommande vivement !",
    },
    {
      id: "2",
      author: "Sophie Martin",
      avatar: "/placeholder.svg",
      rating: 4,
      date: "Février 2024",
      text: "Appartement conforme aux photos, propre et fonctionnel. Un peu bruyant le soir mais globalement un bon séjour.",
    },
  ]);

  const listing = listings?.find((listing) => listing.id === id);

  const handleReservation = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour réserver");
      return;
    }
    
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner des dates");
      return;
    }
    
    // Calcul du nombre de jours
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * (listing?.price || 0);
    
    toast.success("Réservation enregistrée avec succès !");
    // Ici, nous simulons une réservation réussie
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
    
    const newReview = {
      id: Math.random().toString(36).substring(7),
      author: user.name,
      avatar: user.avatar || "/placeholder.svg",
      rating: reviewRating,
      date: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      text: reviewText,
    };
    
    setReviews([newReview, ...reviews]);
    setReviewText("");
    toast.success("Avis publié avec succès !");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Skeleton className="h-[400px] rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-[195px] rounded-lg" />
                <Skeleton className="h-[195px] rounded-lg" />
                <Skeleton className="h-[195px] rounded-lg" />
                <Skeleton className="h-[195px] rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-8" />
              </div>
              <div>
                <Skeleton className="h-[300px] rounded-lg" />
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Titre et localisation */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{listing.location}</span>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={listing.images?.[selectedImageIndex] || listing.image}
              alt={listing.title}
              className="w-full h-[400px] object-cover"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 bg-white"
              onClick={() => setSelectedImageIndex(0)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {listing.images
              ?.slice(1, 5)
              .map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => setSelectedImageIndex(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${listing.title} - ${index + 1}`}
                    className="w-full h-[195px] object-cover"
                  />
                  {index === 3 && listing.images && listing.images.length > 5 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                          <span className="text-lg font-semibold">
                            +{listing.images.length - 5} photos
                          </span>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {listing.images.map((image, i) => (
                              <CarouselItem key={i}>
                                <div className="aspect-video w-full overflow-hidden rounded-xl">
                                  <img
                                    src={image}
                                    alt={`${listing.title} - Image ${i + 1}`}
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

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations et description */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Hébergé par {listing.host.name}
                </h2>
                <p className="text-gray-600">{listing.dates}</p>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={listing.host.image} />
                <AvatarFallback>{listing.host.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="equipment">Équipements</TabsTrigger>
                <TabsTrigger value="location">Localisation</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description">
                <div className="prose max-w-none">
                  <p className="text-gray-700">{listing.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="equipment">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>4 voyageurs maximum</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>Disponible toute l'année</span>
                  </div>
                  {/* Autres équipements */}
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <div className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Carte de localisation</p>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="space-y-8">
                  {/* Formulaire d'avis */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Laisser un avis</h3>
                    <div className="flex items-center mb-4">
                      <div className="flex mr-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewRating(rating)}
                            className="focus:outline-none"
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
                      placeholder="Partagez votre expérience..."
                      className="mb-4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <Button onClick={handleSubmitReview}>Publier</Button>
                  </div>
                  
                  {/* Liste des avis */}
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
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
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Carte de réservation */}
          <div className="sticky top-24">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold">{listing.price}€</span>
                  <span className="text-gray-600"> / nuit</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-sm">
                    {listing.rating || "Nouveau"} · {reviews.length} avis
                  </span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <label className="block text-xs text-gray-500 mb-1">ARRIVÉE</label>
                    <input
                      type="date"
                      className="w-full focus:outline-none text-sm"
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                    />
                  </div>
                  <div className="p-4">
                    <label className="block text-xs text-gray-500 mb-1">DÉPART</label>
                    <input
                      type="date"
                      className="w-full focus:outline-none text-sm"
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
                <Separator />
                <div className="p-4">
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

              <Button className="w-full mb-4" onClick={handleReservation}>
                Réserver
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isFavorite ? "fill-airbnb-red text-airbnb-red" : ""
                  }`}
                />
                {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </Button>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{listing.price}€ x 7 nuits</span>
                  <span>{listing.price * 7}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de service</span>
                  <span>{Math.round(listing.price * 7 * 0.12)}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{listing.price * 7 + Math.round(listing.price * 7 * 0.12)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logements similaires */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Logements similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings
              .filter((item) => item.id !== listing.id)
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/logement/${item.id}`}
                  className="group block"
                >
                  <div className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.location}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{item.rating || "Nouveau"}</span>
                      </div>
                    </div>
                    <p className="text-gray-500">{item.title}</p>
                    <p className="font-medium mt-1">{item.price}€ / nuit</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
