import type { Metadata } from "next";
import "./globals.css";
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
        {/* --- Custom Font Imports from CDN --- */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @import url('https://fonts.cdnfonts.com/css/azonix');
              @import url('https://fonts.cdnfonts.com/css/molgan');
              @import url('https://fonts.cdnfonts.com/css/xeroda');
              @import url('https://fonts.cdnfonts.com/css/a-astro-space');
            `,
          }}
        />
        {/* --- Icon Library Imports from CDN --- */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          xintegrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>

        {/* --- Feather Icons Script --- */}
        {/* This script finds data-feather attributes and replaces them with SVG icons */}
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
