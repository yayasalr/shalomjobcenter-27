
import React, { useState } from "react";
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

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
      {/* Image principale - exactement carrée */}
      <div className="relative overflow-hidden rounded-lg md:col-span-8 aspect-square">
        <img
          src={images[selectedImageIndex] || images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm"
          onClick={() => setSelectedImageIndex(0)}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Grille d'images secondaires - toutes carrées */}
      <div className="grid grid-cols-2 gap-4 md:col-span-4">
        {images
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
              />
              {index === 3 && images.length > 5 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-60 transition-all">
                      <span className="text-base font-semibold">
                        +{images.length - 5} photos
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 sm:p-2 md:p-3">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {images.map((image, i) => (
                          <CarouselItem key={i}>
                            <div className="aspect-square w-full overflow-hidden rounded-xl">
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

export default ImageGallery;
