// components/Footer.tsx
import Link from "next/link";
import { Mail, Phone, Clock, MapPin, Award } from "lucide-react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-[#D40511] px-3 py-1.5 rounded shadow-md">
                <span className="text-white font-black text-xl tracking-tighter">
                  TRAC
                </span>
              </div>
              <span className="font-black text-xl tracking-tight text-[#FFCC00]">
                GLOBAL LOGISTICS
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Trusted global logistics partner connecting businesses worldwide
              with speed, reliability, and precision since 2010.
            </p>

            <div className="flex items-center gap-2 mb-5">
              <Award size={16} className="text-[#FFCC00]" />
              <span className="text-xs text-gray-400">ISO 9001 Certified</span>
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-[#FFCC00] hover:text-[#1a1a1a] text-gray-400 rounded-md flex items-center justify-center transition-all duration-200"
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
            <ul className="space-y-2.5 text-sm">
              {[
                "Express Delivery",
                "International Shipping",
                "Air Freight",
                "Ocean Freight",
                "Warehousing Solutions",
                "Supply Chain Management",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="hover:text-[#FFCC00] transition-colors duration-200"
                  >
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
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Track Shipment", href: "/track" },
                { label: "Get a Quote", href: "#contact" },
                { label: "Schedule Pickup", href: "#contact" },
                { label: "Customer Support", href: "#contact" },
                { label: "Careers", href: "#" },
                { label: "Partner With Us", href: "#contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-[#FFCC00] transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#FFCC00] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Klarabergsviadukten 63<br />
                  101 23 Stockholm<br />
                  Sweden
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#FFCC00] shrink-0" />
                <a
                  href="tel:+46766920874"
                  className="hover:text-[#FFCC00] transition-colors"
                >
                  +46 766 920 874
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#FFCC00] shrink-0" />
                <a
                  href="mailto:support@tracgloballogistics.com"
                  className="hover:text-[#FFCC00] transition-colors"
                >
                  support@tracgloballogistics.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-[#FFCC00] shrink-0 mt-0.5" />
                <div>
                  <p>Mon–Fri: 8am – 8pm CET</p>
                  <span className="text-xs text-gray-500">24/7 Online Support</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Trac Global Logistics. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}