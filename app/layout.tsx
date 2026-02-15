import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Universe",
  description: "A journey through the stars, written just for you.",
  icons: {
    icon: "/images/star.png",
    shortcut: "/images/star.png",
    apple: "/images/star.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-deep-navy text-soft-white antialiased">
        {children}
      </body>
    </html>
  );
}
