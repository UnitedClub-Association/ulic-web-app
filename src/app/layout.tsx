import type { Metadata } from "next";
import "./globals.css";
import "@/lib/fontImports.css";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext"; // Import the provider

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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <AuthProvider> {/* Wrap everything with the AuthProvider */}
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}