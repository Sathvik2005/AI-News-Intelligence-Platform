import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "AI News Intelligence",
  description: "Aggregation and broadcasting dashboard for AI news"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
