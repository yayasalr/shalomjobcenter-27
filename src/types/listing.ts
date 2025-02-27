
export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  image: string;
  images?: string[];
  rating: number;
  dates: string;
  host: {
    name: string;
    image: string;
  };
  mapLocation?: string; // Ajout du champ pour l'URL de la carte
}
