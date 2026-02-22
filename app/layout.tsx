import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { CartSync } from "@/components/auth/CartSync";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spice & Delight - AI Restaurant Assistant",
  description: "Order delicious food with the help of our intelligent AI assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <CartSync />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
