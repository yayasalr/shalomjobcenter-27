
import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewItemProps {
  review: {
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    date: string;
    comment: string;
  };
}

const ReviewItem = ({ review }: ReviewItemProps) => (
  <div className="border-b pb-6 last:border-b-0">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={review.avatar || "/placeholder.svg"} />
          <AvatarFallback>{review.author?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{review.author}</h4>
          <p className="text-sm text-gray-500">{review.date}</p>
        </div>
      </div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star
            key={rating}
            className={`h-4 w-4 ${
              rating <= review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
    <p className="text-gray-700">{review.comment}</p>
  </div>
);

export default ReviewItem;
