import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "blue" | "purple" | "zinc" | "emerald";
  className?: string;
}

export function Badge({ children, variant = "zinc", className }: BadgeProps) {
  const variants = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)}>
      {children}
    </span>
  );
}
