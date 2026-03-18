import { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800">{children}</span>;
}
