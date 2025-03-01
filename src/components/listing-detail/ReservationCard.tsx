
import React from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface ReservationCardProps {
  price: string;
  averageRating: number;
  reviewCount: number;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  handleReservation: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
  primaryColor: string;
}

const ReservationCard = ({
  price,
  averageRating,
  reviewCount,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  guestCount,
  setGuestCount,
  handleReservation,
  isFavorite,
  toggleFavorite,
  primaryColor,
}: ReservationCardProps) => (
  <Card className="border shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold">{price} FCFA</span>
          <span className="text-gray-600"> / nuit</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-sm">
            {averageRating.toFixed(1)} · {reviewCount} avis
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x">
          <div className="p-3">
            <label className="block text-xs text-gray-500 mb-1">ARRIVÉE</label>
            <input
              type="date"
              className="w-full focus:outline-none text-sm"
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="p-3">
            <label className="block text-xs text-gray-500 mb-1">DÉPART</label>
            <input
              type="date"
              className="w-full focus:outline-none text-sm"
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <Separator />
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">VOYAGEURS</label>
          <select
            className="w-full focus:outline-none text-sm"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} voyageur{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        className="w-full rounded-md"
        onClick={handleReservation}
        style={{ backgroundColor: primaryColor }}
      >
        Réserver
      </Button>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center rounded-md"
        onClick={toggleFavorite}
      >
        <Heart
          className={`mr-2 h-4 w-4 ${
            isFavorite ? "fill-airbnb-red text-airbnb-red" : ""
          }`}
        />
        {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      </Button>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{price} FCFA x 7 nuits</span>
          <span>{parseInt(price.replace(/\s/g, "")) * 7} FCFA</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frais de service</span>
          <span>{Math.round(parseInt(price.replace(/\s/g, "")) * 7 * 0.12)} FCFA</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold pt-2">
          <span>Total</span>
          <span>
            {parseInt(price.replace(/\s/g, "")) * 7 +
              Math.round(parseInt(price.replace(/\s/g, "")) * 7 * 0.12)}{" "}
            FCFA
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ReservationCard;
