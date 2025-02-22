
import { Navbar } from "@/components/Navbar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ListingCard } from "@/components/ListingCard";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";

const Index = () => {
  const { listings, isLoading, error } = useListings();

  console.log("Listings sur la page d'accueil:", listings); // Ajout d'un log pour debug

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CategoryFilters />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-20">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trouvez votre prochain logement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des milliers de logements vous attendent, trouvez celui qui vous correspond.
          </p>
        </div>

        {/* Featured Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button variant="outline" className="rounded-full">
            <MapPin className="mr-2 h-4 w-4" />
            Toutes les villes
          </Button>
          <Button variant="outline" className="rounded-full">
            <Calendar className="mr-2 h-4 w-4" />
            Toutes les dates
          </Button>
          <Button variant="outline" className="rounded-full">
            <Users className="mr-2 h-4 w-4" />
            Nombre de voyageurs
          </Button>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Une erreur est survenue lors du chargement des annonces.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
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
            <p className="text-gray-500">Aucune annonce disponible pour le moment</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                À propos
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Qui sommes-nous
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Comment ça marche
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Contactez-nous
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Légal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
