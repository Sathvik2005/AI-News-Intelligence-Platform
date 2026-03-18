import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold tracking-wide text-slate-800">{children}</h3>;
}
