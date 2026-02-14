// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "Our Universe",
//   description: "An immersive romantic journey through the stars",
//   viewport: "width=device-width, initial-scale=1, maximum-scale=1",
//   themeColor: "#0a0e1a",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body className="bg-deep-navy text-soft-white antialiased">
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Universe",
  description: "A journey through the stars, written just for you.",
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
