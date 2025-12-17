import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({
  rating,
  maxRating = 5,
  onRatingChange,
  readOnly = false,
  size = 24,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onRatingChange?.(starValue)}
            className={cn(
              "transition-colors focus:outline-none",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"
            )}
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-100 text-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
