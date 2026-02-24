import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simplex Credentials Manager",
  description: "Store and manage encrypted credentials with the Simplex SDK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
