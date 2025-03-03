
import React, { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MagicBook } from "@/components/ui/magic-book";
import { toast } from "sonner";
import { getValidImageUrl, getRandomFallbackImage } from "@/utils/imageUtils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  
  // Traiter et valider toutes les images lors du montage du composant
  useEffect(() => {
    // S'assurer que nous avons au moins une image valide
    if (!images || images.length === 0) {
      setProcessedImages([getRandomFallbackImage()]);
      return;
    }
    
    // Traiter chaque image pour s'assurer qu'elle est valide
    const validImages = images.map((img, index) => getValidImageUrl(img, index));
    setProcessedImages(validImages);
  }, [images]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
      {/* Image principale - exactement carrée */}
      <div className="relative overflow-hidden rounded-lg md:col-span-8 aspect-square">
        <img
          src={processedImages[selectedImageIndex] || processedImages[0] || getRandomFallbackImage()}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            console.log("Erreur de chargement d'image:", e);
            e.currentTarget.src = getRandomFallbackImage();
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm"
          onClick={() => {
            // Create a temporary input element to copy the URL
            const input = document.createElement('input');
            input.value = window.location.href;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            toast.success("Lien copié!", {
              description: "Vous pouvez maintenant partager ce logement"
            });
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        
        {/* Livre "Coup de cœur voyageurs" */}
        <div className="absolute top-2 left-2 scale-75 md:scale-100 origin-top-left">
          <MagicBook 
            onClick={() => toast.success("Coup de cœur voyageurs!", {
              description: "Ce logement est particulièrement apprécié des voyageurs pour son confort et son emplacement."
            })}
          />
        </div>
      </div>
      
      {/* Grille d'images secondaires - toutes carrées */}
      <div className="grid grid-cols-2 gap-4 md:col-span-4">
        {processedImages
          .slice(1, 5)
          .map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg cursor-pointer aspect-square hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImageIndex(index + 1)}
            >
              <img
                src={image}
                alt={`${title} - ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = getRandomFallbackImage();
                }}
              />
              {index === 3 && processedImages.length > 5 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-60 transition-all">
                      <span className="text-base font-semibold">
                        +{processedImages.length - 5} photos
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 sm:p-2 md:p-3">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {processedImages.map((image, i) => (
                          <CarouselItem key={i}>
                            <div className="aspect-square w-full overflow-hidden rounded-xl">
                              <img
                                src={image}
                                alt={`${title} - Image ${i + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = getRandomFallbackImage();
                                }}
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

export default ImageGallery;
