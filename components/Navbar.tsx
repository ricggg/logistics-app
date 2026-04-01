// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Package, Phone, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Tracking", href: "/track" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");

  return (
    <nav className="w-full z-50 sticky top-0">
      {/* Top bar */}
      <div className="bg-[#D40511] text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone size={11} />
            +1 (800) 225-5345
          </span>
          <span className="flex items-center gap-1">
            <Globe size={11} />
            swiftxpress.com
          </span>
        </div>
        <span className="hidden sm:block">
          Fast · Reliable · Global Logistics
        </span>
      </div>

      {/* Main navbar */}
      <div className="bg-[#FFCC00] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-[#D40511] px-3 py-1.5 rounded">
                <span className="text-white font-black text-xl tracking-tighter leading-none">
                  SWIFT
                </span>
              </div>
              <span className="font-black text-xl tracking-tight text-[#D40511] leading-none">
                XPRESS
              </span>
            </Link>

            {/* Desktop nav */}
            {!isAdmin && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-semibold text-[#1a1a1a] hover:bg-[#e6b800] rounded transition-colors duration-150"
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
                className="flex items-center gap-2 bg-[#D40511] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#b8040e] transition-colors"
              >
                <Package size={15} />
                Track Shipment
              </Link>
              {isAdmin && (
                <Link
                  href="/"
                  className="text-sm font-semibold text-[#1a1a1a] hover:underline"
                >
                  ← Back to Site
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded hover:bg-[#e6b800] transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
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
            className="bg-[#FFCC00] border-t border-[#e6b800] md:hidden overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-[#1a1a1a] hover:bg-[#e6b800] rounded transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/track"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 bg-[#D40511] text-white px-4 py-2.5 rounded text-sm font-bold hover:bg-[#b8040e] transition-colors"
              >
                <Package size={15} />
                Track Shipment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}