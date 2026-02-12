"use client";

import { useState } from "react";

interface RatingStarsProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

export function RatingStars({
  initialRating = 0,
  onChange,
  readOnly,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState(initialRating);

  const effective = hovered ?? selected;

  if (readOnly) {
    return (
      <div className="flex items-center gap-1 text-xs">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>{index < Math.round(initialRating) ? "★" : "☆"}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-base">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        return (
          <button
            key={value}
            type="button"
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              setSelected(value);
              onChange?.(value);
            }}
            className="text-yellow-400"
          >
            {value <= effective ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}

