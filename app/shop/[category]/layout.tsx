import { Suspense, ReactNode } from "react";

export default function ShopCategoryLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}