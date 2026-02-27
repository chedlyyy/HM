import { Suspense, ReactNode } from "react";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}