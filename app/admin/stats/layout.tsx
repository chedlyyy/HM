import { Suspense, ReactNode } from "react";

export default function AdminStatsLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}