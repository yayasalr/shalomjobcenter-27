
export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  dates: string;
  description?: string;
  images?: string[];
  host: {
    name: string;
    image: string;
  };
}
