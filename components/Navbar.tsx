// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Package, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Tracking", href: "/track" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");

  return (
    <nav className="w-full z-50 sticky top-0 shadow-sm">
      {/* Top bar */}
      <div className="bg-[#D40511] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+18002255345" className="flex items-center gap-1.5 hover:text-[#FFCC00] transition-colors">
              <Phone size={12} />
              <span className="hidden sm:inline">+1 (800) 225-5345</span>
            </a>
            <a href="mailto:support@tracgloballogistics.com" className="flex items-center gap-1.5 hover:text-[#FFCC00] transition-colors">
              <Mail size={12} />
              <span className="hidden md:inline">support@tracgloballogistics.com</span>
            </a>
          </div>
          <span className="hidden md:block font-semibold">
            🌍 Shipping to 220+ Countries | 24/7 Support
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-[#D40511] px-3 py-1.5 rounded shadow-md">
                <span className="text-white font-black text-xl tracking-tighter leading-none">
                  TRAC
                </span>
              </div>
              <span className="font-black text-xl tracking-tight text-[#D40511] leading-none">
                GLOBAL LOGISTICS
              </span>
            </Link>

            {/* Desktop nav */}
            {!isAdmin && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#D40511] hover:bg-gray-50 rounded transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/track"
                className="flex items-center gap-2 bg-[#FFCC00] text-[#1a1a1a] px-5 py-2.5 rounded-md text-sm font-bold hover:bg-[#e6b800] transition-colors shadow-sm"
              >
                <Package size={16} />
                Track Shipment
              </Link>
              {isAdmin && (
                <Link
                  href="/"
                  className="text-sm font-semibold text-gray-700 hover:text-[#D40511]"
                >
                  ← Back to Site
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white border-b border-gray-200 md:hidden overflow-hidden shadow-lg"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#D40511] rounded transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/track"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 bg-[#FFCC00] text-[#1a1a1a] px-4 py-3 rounded-md text-sm font-bold hover:bg-[#e6b800] transition-colors"
              >
                <Package size={16} />
                Track Shipment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}