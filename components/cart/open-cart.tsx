import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
  label,
}: {
  className?: string;
  quantity?: number;
  label?: string;
}) {
  return (
    <div
      className={clsx(
        "relative flex h-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white",
        label ? "gap-2 px-3" : "w-11",
      )}
    >
      <ShoppingCartIcon
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
      {label ? (
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      ) : null}

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm bg-blue-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
