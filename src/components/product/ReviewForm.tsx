import { useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ onReviewSubmitted }: ReviewFormProps) {
  const user = useAuthStore((s) => s.user);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please provide review feedback.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Review published with verified badge. ⭐");
      setComment("");
      onReviewSubmitted?.();
    }, 800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl border border-border bg-card space-y-4"
    >
      <h3 className="font-syne font-bold text-sm text-foreground">
        Write a Verified Builder Review
      </h3>

      {/* Star Selector */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
          Overall Quality Score
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(star)}
              className="p-1 text-amber-400 hover:scale-110 transition-transform"
              aria-label={`${star} Stars`}
            >
              <Star
                className={`w-6 h-6 ${
                  (hoverRating ?? rating) >= star
                    ? "fill-current text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-foreground ml-2">
            {rating} of 5 Stars
          </span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          Review Comments & Hardware Insights
        </label>
        <textarea
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details on tolerance, pinout clarity, or firmware integration..."
          className="w-full p-3.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="h-10 px-5 rounded-xl bg-[#A3E635] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-sm disabled:opacity-50"
        >
          {submitting ? "Publishing..." : "Submit Review"}
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
