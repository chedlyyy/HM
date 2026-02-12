interface CommentItem {
  id: string;
  text: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface CommentsListProps {
  comments: CommentItem[];
}

export function CommentsList({ comments }: CommentsListProps) {
  if (!comments.length) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        No comments yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="rounded-xl border border-neutral-200 bg-white/80 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-950/80"
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-50">
              {comment.user.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              ★ {comment.rating} / 5
            </p>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            {comment.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

