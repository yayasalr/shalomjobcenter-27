
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  neighborhood: string;
  mapLocation: string;
  rating: number;
  dates: string;
  image: string;
  images: string[];
  host: {
    name: string;
    image: string;
  };
}
