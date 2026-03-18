import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant Rush Academy",
  description: "A browser-based classroom restaurant simulation for culinary and FCS students."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
