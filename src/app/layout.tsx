import type { Metadata } from "next";
import "./globals.css";
import "@/lib/fontImports.css"; // Correct path to the new CSS file
import Navbar from "@/components/Navbar/Navbar"; // Import the new Navbar component
import Script from "next/script";

export const metadata: Metadata = {
  title: "ULIC App",
  description: "Club management application for UnitedClub-Association",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- Icon Library Imports from CDN --- */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>

        {/* --- Feather Icons Script --- */}
        <Script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js" strategy="afterInteractive" />
        <Script id="feather-replace" strategy="afterInteractive">
          {`
            // Ensure feather is available before calling replace
            if (typeof feather !== 'undefined') {
              feather.replace();
            }
          `}
        </Script>
      </body>
    </html>
  );
}