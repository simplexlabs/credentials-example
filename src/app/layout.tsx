import type { Metadata } from "next";

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
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#0a0a0a", color: "#ededed" }}>
        {children}
      </body>
    </html>
  );
}
