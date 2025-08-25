import type { Metadata } from "next";
import "./globals.css";
// The old fontImports.css is no longer needed.
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
import ThemeApplier from "@/components/Theme/ThemeApplier";
import FloatingActionButton from "@/components/FloatingActionButton/FloatingActionButton";

export const metadata: Metadata = {
  title: "ULIC App",
  description: "Club management application for UnitedClub-Association",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        {/* --- THE FIX: Use <link> tags for fonts --- */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        
        {/* Default CDNFonts */}
        <link href="https://fonts.cdnfonts.com/css/azonix" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/molgan" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/xeroda" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/a-astro-space" rel="stylesheet" />

        {/* Consolidated Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Slabo+27px&family=Raleway:wght@400;700&family=Merriweather:wght@400;700&family=PT+Sans:wght@400;700&family=Ubuntu:wght@400;700&display=swap" rel="stylesheet" />

        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>
        <AuthProvider>
          <ThemeApplier />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)'
              },
            }}
          />
          <Navbar />
          <main>{children}</main>
          <FloatingActionButton />
        </AuthProvider>
      </body>
    </html>
  );
}