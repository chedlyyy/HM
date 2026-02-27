import { Suspense, ReactNode } from "react";

export default function SearchCollectionLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}