
import React from 'react';
import { Listing } from '@/types/listing';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validateImage, convertToFCFA } from './utils/listingTableUtils';

interface ListingDetailsDialogProps {
  listing: Listing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ListingDetailsDialog: React.FC<ListingDetailsDialogProps> = ({
  listing,
  open,
  onOpenChange
}) => {
  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails du logement</DialogTitle>
          <DialogDescription>
            {listing.title}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="details">Informations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos">
            {listing.images && listing.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {listing.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                        <img 
                          src={validateImage(img)} 
                          alt={`${listing.title} - Vue ${idx + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                <img 
                  src={validateImage(listing.image)} 
                  alt={listing.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
                  }}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Titre</h3>
                <p className="mt-1">{listing.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Localisation</h3>
                <p className="mt-1">{listing.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prix</h3>
                <p className="mt-1">
                  {convertToFCFA(listing.price)} FCFA ({listing.price}€)
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Note</h3>
                <p className="mt-1 flex items-center">
                  <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {listing.rating}
                </p>
              </div>
              {listing.description && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{listing.description}</p>
                </div>
              )}
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Hôte</h3>
                <div className="mt-1 flex items-center">
                  <img 
                    src={listing.host.image || "/placeholder.svg"} 
                    alt={listing.host.name}
                    className="h-8 w-8 rounded-full mr-2"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <span>{listing.host.name}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
