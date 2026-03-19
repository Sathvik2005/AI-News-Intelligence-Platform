import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-black/5 flex flex-col transition-all hover:shadow-md", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-xl font-semibold text-white", className)}>{children}</h3>;
}
