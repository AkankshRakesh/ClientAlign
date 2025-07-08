import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientAlign",
  description: "Client and Creator, Collaborating and Creating Together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
