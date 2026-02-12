import Link from "next/link";

export const metadata = {
  description:
    "Hamdi Shop – merch and gym nutrition with a clean, focused experience.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src="/hamdi.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-300">
            Welcome to
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Hamdi Shop
          </h1>
          <p className="max-w-xl text-sm text-neutral-300 sm:text-base">
            Merch and gym nutrition essentials. Clean, focused, and ready for your next PR.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-2.5 text-sm font-medium text-black shadow-sm transition hover:bg-neutral-100"
          >
            Shop
          </Link>
          <Link
            href="/train"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition hover:border-white hover:text-white"
          >
            Train
          </Link>
        </div>
      </div>
    </div>
  );
}
