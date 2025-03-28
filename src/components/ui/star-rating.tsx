import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
}: StarRatingProps) {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  return (
    <div className="flex">
      {Array(maxRating)
        .fill(0)
        .map((_, i) => (
          <Star
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
            className={`${sizeClass} ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
    </div>
  );
}
