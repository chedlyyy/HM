"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RatingStars } from "./RatingStars";

interface CommentFormProps {
  productId: string;
}

export function CommentForm({ productId }: CommentFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session?.user) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!rating) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, text, rating }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to submit comment.");
        setSubmitting(false);
        return;
      }

      setText("");
      setRating(0);
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Your rating
        </p>
        <RatingStars initialRating={rating} onChange={setRating} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Comment
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          placeholder="Share how this fits into your training, sizing notes, or flavor feedback."
        />
      </div>
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-neutral-900 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
      >
        {submitting ? "Submitting..." : "Post comment"}
      </button>
    </form>
  );
}

