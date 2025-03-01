
import { Star, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ListingCardBadgeProps {
  type: "favorite" | "jobcenter";
}

export const ListingCardBadge = ({ type }: ListingCardBadgeProps) => {
  if (type === "favorite") {
    return (
      <Badge 
        variant="favorite" 
        className="px-3 py-1 text-sm shadow-sm flex items-center gap-1"
      >
        <Star className="h-3.5 w-3.5 fill-current" />
        Coup de cœur voyageurs
      </Badge>
    );
  }
  
  return (
    <Badge 
      variant="jobcenter" 
      className="px-3 py-1 text-sm shadow-sm flex items-center gap-1"
    >
      <BookOpen className="h-3.5 w-3.5" />
      SHALOM JOB CENTER
    </Badge>
  );
};
