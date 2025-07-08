import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";

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
      <Suspense fallback={<div>Loading...</div>}>
      <body>{children}</body>
      </Suspense>
    </html>
  );
}
