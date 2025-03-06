
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ListingCard } from '@/components/listing-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, AlertCircle, FolderPlus, Compare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useListings } from '@/hooks/useListings';
import useAuth from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

const Favorites = () => {
  const { listings } = useListings();
  const { user } = useAuth();
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  
  // Dans une application réelle, vous récupéreriez les favoris depuis une API
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      // Simuler des favoris avec 3 annonces aléatoires
      const randomListings = [...listings]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      return randomListings;
    },
    enabled: !!listings.length,
  });

  const [collections, setCollections] = useState([
    { id: '1', name: 'Appartements', items: [] },
    { id: '2', name: 'Maisons', items: [] }
  ]);

  const toggleListingSelection = (listingId: string) => {
    setSelectedListings(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Mes favoris</h1>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Nouvelle collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Nom de la collection" />
                  <Button className="w-full">Créer</Button>
                </div>
              </DialogContent>
            </Dialog>

            {selectedListings.length > 1 && (
              <Button 
                variant="default"
                className="flex items-center gap-2"
                onClick={() => {/* Implement comparison logic */}}
              >
                <Compare className="h-4 w-4" />
                Comparer ({selectedListings.length})
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="logements">
          <TabsList className="mb-8">
            <TabsTrigger value="logements">Logements</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="emplois">Offres d'emploi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logements">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((listing) => (
                  <div key={listing.id} className="relative group">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full bg-white/80 backdrop-blur-sm hover:bg-white ${
                          selectedListings.includes(listing.id) ? 'text-primary' : ''
                        }`}
                        onClick={() => toggleListingSelection(listing.id)}
                      >
                        <Compare className="h-4 w-4" />
                      </Button>
                    </div>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas encore ajouté de logements à vos favoris.
                </p>
                <Button asChild>
                  <a href="/">Découvrir des logements</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="collections">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map(collection => (
                <div key={collection.id} className="p-6 border rounded-lg bg-white shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {collection.items.length} éléments
                  </p>
                  <Button variant="outline" className="w-full">
                    Voir la collection
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="emplois">
            <div className="text-center p-12 border border-dashed rounded-lg">
              <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune offre d'emploi sauvegardée</h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore ajouté d'offres d'emploi à vos favoris.
              </p>
              <Button asChild>
                <a href="/emplois">Voir les offres d'emploi</a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Favorites;
