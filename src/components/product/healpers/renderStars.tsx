
import { 
  
  Star, 
  StarHalf,
 
} from "lucide-react";

export function RenderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-pink-500 text-pink-500" />
      ))}
      {hasHalfStar && <StarHalf className="w-5 h-5 fill-pink-500 text-pink-500" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-gray-300" />
      ))}
    </>
  );
}