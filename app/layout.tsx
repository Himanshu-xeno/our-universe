import type { Metadata, Viewport } from "next";
import "./globals.css";

// ✅ Updated metadata with PWA manifest
export const metadata: Metadata = {
  title: "Our Universe",
  description: "A journey through the stars, written just for you.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/star.png",
    shortcut: "/images/star.png",
    apple: "/images/star.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Our Universe",
  },
};

// ✅ Updated viewport with PWA theme color
export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA - Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Our Universe" />
        <link rel="apple-touch-icon" href="/images/star.png" />
      </head>
      <body className="bg-deep-navy text-soft-white antialiased">
        {children}

        {/* ✅ PWA - Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
