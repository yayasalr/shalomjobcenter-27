
export interface Reservation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingLocation: string;
  listingImage: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  notes?: string;
}
