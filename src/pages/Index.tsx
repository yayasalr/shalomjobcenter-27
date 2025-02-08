
import { Navbar } from "@/components/Navbar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ListingCard } from "@/components/ListingCard";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  dates: string;
  host: {
    name: string;
    image: string;
  };
}

// Mock API function - in a real app, this would fetch from your backend
const fetchListings = async (): Promise<Listing[]> => {
  // Simulating an API call
  return [
    {
      id: "1",
      title: "Superbe villa avec vue",
      location: "Sant Miquel de Balansat, Espagne",
      price: 67,
      rating: 5.0,
      image: "/lovable-uploads/00196f15-e8ff-48fb-bf68-e133fa5e4064.png",
      dates: "15-20 févr.",
      host: {
        name: "Bas",
        image: "/placeholder.svg",
      },
    },
    {
      id: "2",
      title: "Appartement moderne",
      location: "San Miguel, Pérou",
      price: 94,
      rating: 4.94,
      image: "https://a0.muscache.com/im/pictures/miso/Hosting-51809333/original/0da70267-d9da-4efb-9123-2714b651c9fd.jpeg",
      dates: "17-22 févr.",
      host: {
        name: "Enrique",
        image: "/placeholder.svg",
      },
    },
  ];
};

const Index = () => {
  const { data: listings = [], isLoading, error } = useQuery<Listing[], Error>({
    queryKey: ['listings'],
    queryFn: fetchListings,
  });

  if (error) {
    toast.error("Erreur lors du chargement des logements");
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CategoryFilters />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing: Listing) => (
              <ListingCard 
                key={listing.id} 
                id={listing.id}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                rating={listing.rating}
                image={listing.image}
                dates={listing.dates}
                host={listing.host}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucun logement disponible</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
