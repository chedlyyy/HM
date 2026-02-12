interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6 space-y-2">
      {eyebrow ? (
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

