
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Wifi, Tv, Car, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockListing = {
  id: "1",
  title: "Superbe villa avec vue",
  description: "Une magnifique villa moderne avec vue panoramique sur la mer. Profitez d'un séjour luxueux dans un cadre exceptionnel.",
  location: "Sant Miquel de Balansat, Espagne",
  price: 67,
  priceTotal: 335,
  rating: 5.0,
  reviews: [
    {
      id: 1,
      author: "Marie L.",
      rating: 5,
      comment: "Séjour parfait ! La vue est exceptionnelle et la villa est très bien équipée.",
      date: "février 2024"
    },
    {
      id: 2,
      author: "Pierre D.",
      rating: 4,
      comment: "Très belle propriété, calme et reposante. Petit bémol sur la propreté de la piscine.",
      date: "janvier 2024"
    }
  ],
  amenities: ["Wifi", "TV", "Parking", "Café"],
  images: [
    "/lovable-uploads/00196f15-e8ff-48fb-bf68-e133fa5e4064.png",
    "https://a0.muscache.com/im/pictures/miso/Hosting-51809333/original/0da70267-d9da-4efb-9123-2714b651c9fd.jpeg",
  ],
};

const ListingDetail = () => {
  const { id } = useParams();
  const [selectedDates, setSelectedDates] = useState({ start: "", end: "" });

  const handleReservation = () => {
    toast.success("Réservation effectuée avec succès !");
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-airbnb-red stroke-airbnb-red"
            : "stroke-gray-300"
        }`}
      />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "Wifi":
        return <Wifi className="h-5 w-5" />;
      case "TV":
        return <Tv className="h-5 w-5" />;
      case "Parking":
        return <Car className="h-5 w-5" />;
      case "Café":
        return <Coffee className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {mockListing.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <img
                  src={image}
                  alt={`Vue ${index + 1} du logement`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            {mockListing.title}
          </h1>
          <p className="text-gray-500 mt-2">{mockListing.location}</p>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600">{mockListing.description}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Équipements</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {mockListing.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Commentaires ({mockListing.reviews.length})
            </h2>
            <div className="mt-4 space-y-4">
              {mockListing.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    <span className="text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-8 border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-semibold">
                  {mockListing.price}€
                </span>
                <span className="text-gray-500"> / nuit</span>
              </div>
              <div className="flex items-center">
                {renderStars(mockListing.rating)}
              </div>
            </div>

            <div className="mt-6">
              <div className="font-medium">Prix total</div>
              <div className="text-2xl font-semibold mt-1">
                {mockListing.priceTotal}€
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Pour 5 nuits
              </p>
            </div>

            <Button
              onClick={handleReservation}
              className="w-full mt-6 bg-airbnb-red hover:bg-airbnb-red/90"
            >
              Réserver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
