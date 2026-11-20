import { useState } from "react";
import { Star, CheckCircle2, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  likes?: number;
}

const SAMPLE_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Karan Patel",
    rating: 5,
    date: "2 days ago",
    verified: true,
    comment:
      "Remarkable build quality. Pinouts and header pins were perfectly straight, and the firmware flashed on the first attempt using Arduino IDE 2.3. Highly recommended for any serious lab setup.",
    likes: 14,
  },
  {
    id: "rev-2",
    author: "Dr. Elena Vance",
    rating: 5,
    date: "1 week ago",
    verified: true,
    comment:
      "Integrated smoothly with our Python ROS node. The tolerances on the aluminum bracket are within 0.05mm. Arrived in ESD-safe packaging within 48 hours.",
    likes: 29,
  },
  {
    id: "rev-3",
    author: "Alex Morgan",
    rating: 4,
    date: "2 weeks ago",
    verified: true,
    comment:
      "Very solid module. The step-by-step schematics provided in the download package saved a ton of debugging time. Only knocked off 1 star because the USB-C cable was slightly short.",
    likes: 6,
  },
];

interface ReviewsListProps {
  productId: string;
  avgRating?: number;
  totalReviews?: number;
}

export function ReviewsList({
  avgRating = 4.9,
  totalReviews = 48,
}: ReviewsListProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const distribution = [
    { stars: 5, count: 42, pct: 88 },
    { stars: 4, count: 5, pct: 10 },
    { stars: 3, count: 1, pct: 2 },
    { stars: 2, count: 0, pct: 0 },
    { stars: 1, count: 0, pct: 0 },
  ];

  const filtered = filterRating
    ? SAMPLE_REVIEWS.filter((r) => r.rating === filterRating)
    : SAMPLE_REVIEWS;

  return (
    <div className="space-y-8">
      {/* Rating Breakdown Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 rounded-2xl bg-muted/20 border border-border">
        {/* Overall score */}
        <div className="md:col-span-4 text-center md:text-left space-y-1">
          <div className="text-5xl font-black font-syne text-foreground tracking-tight">
            {avgRating}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {totalReviews} verified customer reviews
          </p>
        </div>

        {/* Breakdown bars */}
        <div className="md:col-span-8 space-y-2">
          {distribution.map((d) => (
            <button
              key={d.stars}
              onClick={() =>
                setFilterRating(filterRating === d.stars ? null : d.stars)
              }
              className="w-full flex items-center gap-3 text-xs group hover:opacity-80 transition-opacity"
            >
              <span className="w-10 text-left font-medium text-muted-foreground group-hover:text-foreground">
                {d.stars}★
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[#A3E635] rounded-full transition-all duration-500"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground font-mono">
                {d.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl border border-border bg-card space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center font-bold text-xs font-syne">
                  {rev.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold font-syne text-xs sm:text-sm text-foreground">
                    {rev.author}
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#A3E635] font-sans font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {rev.date}
                  </span>
                </div>
              </div>

              <div className="flex text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {rev.comment}
            </p>

            {rev.likes && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                <ThumbsUp className="w-3 h-3" />
                <span>{rev.likes} builders found this helpful</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
