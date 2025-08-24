import type { Metadata } from "next";
import "./globals.css";
import "@/lib/fontImports.css";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
import ThemeApplier from "@/components/Theme/ThemeApplier"; // Import the new component

export const metadata: Metadata = {
  title: "ULIC App",
  description: "Club management application for UnitedClub-Association",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>
        <AuthProvider>
          <ThemeApplier /> {/* Add the ThemeApplier here */}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--card-bg)', // Use theme variables
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)'
              },
            }}
          />
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}