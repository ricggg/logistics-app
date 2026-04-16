// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "ClearRoute Global Logistics — Fast & Reliable Global Shipping Solutions",
  description:
    "Professional logistics services to 220+ countries. Express delivery, international shipping, air & ocean freight. Real-time tracking, 24/7 support, 99.8% on-time delivery.",
  keywords:
    "logistics, shipping, freight, international delivery, express courier, supply chain, ClearRoute Global Logistics",
  openGraph: {
    title: "ClearRoute Global Logistics — Global Shipping Experts",
    description:
      "Fast, reliable shipping to 220+ countries. Track shipments in real-time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}