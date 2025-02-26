
import React, { useState, useEffect } from 'react';
import { Listing } from '@/types/listing';
import { X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useListings } from '@/hooks/useListings';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const CompareListings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedListings, setSelectedListings] = useState<Listing[]>([]);
  const { listings } = useListings();
  const { settings } = useSiteSettings();
  
  // Chargement des listings à comparer depuis le localStorage
  useEffect(() => {
    const compareIds = localStorage.getItem('compareListings');
    if (compareIds && listings.length > 0) {
      try {
        const ids = JSON.parse(compareIds);
        const selectedItems = listings.filter(listing => ids.includes(listing.id));
        setSelectedListings(selectedItems);
        
        // Ouvrir automatiquement le panel s'il y a des éléments à comparer
        if (selectedItems.length > 0) {
          setIsOpen(true);
        }
      } catch (e) {
        console.error("Erreur lors du chargement des logements à comparer:", e);
      }
    }
  }, [listings]);
  
  // Sauvegarder les changements dans le localStorage
  useEffect(() => {
    const ids = selectedListings.map(listing => listing.id);
    localStorage.setItem('compareListings', JSON.stringify(ids));
  }, [selectedListings]);
  
  // Fonction pour supprimer un logement de la comparaison
  const removeListing = (id: string) => {
    setSelectedListings(prev => prev.filter(item => item.id !== id));
    if (selectedListings.length <= 1) {
      setIsOpen(false);
    }
    toast.success("Logement retiré de la comparaison");
  };
  
  // Fonction pour supprimer tous les logements de la comparaison
  const clearAll = () => {
    setSelectedListings([]);
    setIsOpen(false);
    toast.success("Comparaison vidée");
  };
  
  // Conversion du prix en FCFA
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString('fr-FR');
  };
  
  // Vérification d'une image
  const validateImage = (imageUrl: string): string => {
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
    }
    return imageUrl;
  };
  
  // S'il n'y a pas de logements à comparer, ne rien afficher
  if (selectedListings.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Bandeau replié */}
      {!isOpen && (
        <div 
          className="cursor-pointer p-3 text-white flex items-center justify-between"
          style={{ backgroundColor: settings.primaryColor }}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center">
            <span className="font-medium">Comparer ({selectedListings.length})</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </div>
      )}
      
      {/* Panel de comparaison ouvert */}
      {isOpen && (
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="p-3 border-b flex items-center justify-between"  
               style={{ borderColor: settings.primaryColor }}>
            <h3 className="font-bold text-lg">Comparer les logements</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
              >
                Tout supprimer
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 overflow-x-auto">
            <div className="flex space-x-4 min-w-max">
              {selectedListings.map(listing => (
                <div key={listing.id} className="w-64 flex-shrink-0 border rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={validateImage(listing.image)} 
                      alt={listing.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                      }}
                    />
                    <button 
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                      onClick={() => removeListing(listing.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 truncate">{listing.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{listing.location}</p>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Prix:</span>
                        <p className="font-medium">{formatPriceFCFA(listing.price)} FCFA</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Note:</span>
                        <p className="font-medium flex items-center">
                          <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {listing.rating}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Link to={`/logement/${listing.id}`}>
                        <Button className="w-full text-white" style={{ backgroundColor: settings.primaryColor }}>
                          Voir les détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
