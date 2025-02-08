
import { Navbar } from "@/components/Navbar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ListingCard } from "@/components/ListingCard";

const listings = [
  {
    id: 1,
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
    id: 2,
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
  // Add more listings as needed
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CategoryFilters />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
