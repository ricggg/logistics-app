// components/Footer.tsx
import Link from "next/link";
import { Package, ExternalLink, Mail, Phone, Clock, MapPin } from "lucide-react";

// Custom SVG social icons — no dependency on removed lucide branded icons
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: TwitterIcon, label: "Twitter / X", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-[#D40511] px-3 py-1.5 rounded">
                <span className="text-white font-black text-xl tracking-tighter">
                  SWIFT
                </span>
              </div>
              <span className="font-black text-xl tracking-tight text-[#FFCC00]">
                XPRESS
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Global logistics delivered with precision. We connect businesses
              and individuals across the world with speed and reliability.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-gray-700 hover:bg-[#FFCC00] hover:text-[#1a1a1a] text-gray-300 rounded flex items-center justify-center transition-colors duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Express Delivery",
                "International Shipping",
                "Freight Forwarding",
                "Warehousing",
                "Supply Chain",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="hover:text-[#FFCC00] transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ExternalLink size={11} className="opacity-50" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Track Shipment", href: "/track" },
                { label: "Get a Quote", href: "#" },
                { label: "Schedule Pickup", href: "#" },
                { label: "Find a Location", href: "#" },
                { label: "Contact Support", href: "#contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-[#FFCC00] transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ExternalLink size={11} className="opacity-50" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#FFCC00] shrink-0" />
                +1 (800) 225-5345
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[#FFCC00] shrink-0" />
                support@swiftxpress.com
              </li>
              <li className="flex items-center gap-2">
                <Clock size={13} className="text-[#FFCC00] shrink-0" />
                Mon–Fri: 8am – 8pm EST
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-[#FFCC00] shrink-0" />
                24/7 Online Tracking
              </li>
              <li className="flex items-center gap-2">
                <Package size={13} className="text-[#FFCC00] shrink-0" />
                All Shipment Types Covered
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 SwiftXpress Logistics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}