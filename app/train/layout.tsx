import { Suspense, ReactNode } from "react";

export default function TrainLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}