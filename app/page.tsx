// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Globe,
  Clock,
  Shield,
  Truck,
  BarChart3,
  ArrowRight,
  Search,
  Star,
  CheckCircle,
  Plane,
  Ship,
} from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Express Delivery",
    desc: "Same-day and next-day delivery options for urgent shipments across all major cities.",
    color: "bg-red-50",
    iconColor: "text-[#D40511]",
  },
  {
    icon: Globe,
    title: "International Shipping",
    desc: "Reliable cross-border shipping to 220+ countries with full customs support.",
    color: "bg-yellow-50",
    iconColor: "text-[#FFCC00]",
  },
  {
    icon: Plane,
    title: "Air Freight",
    desc: "Time-critical airfreight solutions for businesses that can't afford delays.",
    color: "bg-red-50",
    iconColor: "text-[#D40511]",
  },
  {
    icon: Ship,
    title: "Ocean Freight",
    desc: "Cost-effective sea freight for large cargo. FCL and LCL options available.",
    color: "bg-yellow-50",
    iconColor: "text-[#FFCC00]",
  },
  {
    icon: Shield,
    title: "Secure Packaging",
    desc: "Professional packing services to ensure your cargo arrives safely every time.",
    color: "bg-red-50",
    iconColor: "text-[#D40511]",
  },
  {
    icon: BarChart3,
    title: "Supply Chain",
    desc: "End-to-end supply chain visibility and management for enterprise clients.",
    color: "bg-yellow-50",
    iconColor: "text-[#FFCC00]",
  },
];

const stats = [
  { value: "220+", label: "Countries Served" },
  { value: "2M+", label: "Shipments Monthly" },
  { value: "99.8%", label: "On-Time Delivery" },
  { value: "24/7", label: "Customer Support" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Director, RetailPlus",
    text: "SwiftXpress transformed our delivery operations. Our customers love the real-time tracking and reliability.",
    rating: 5,
  },
  {
    name: "Michael Okonkwo",
    role: "CEO, AfroTrade International",
    text: "The best logistics partner we've had. Fast, transparent, and the customer support is excellent.",
    rating: 5,
  },
  {
    name: "Emma Clarke",
    role: "Operations Manager, TechShip Co.",
    text: "International shipping made easy. Customs handling is seamless and tracking is always accurate.",
    rating: 5,
  },
];

export default function HomePage() {
  const [trackingInput, setTrackingInput] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      router.push(`/tracking-result?number=${encodeURIComponent(trackingInput.trim())}`);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Real-world background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block bg-[#FFCC00] text-[#1a1a1a] text-xs font-black px-3 py-1.5 rounded mb-5 uppercase tracking-widest">
                World-Class Logistics
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
                Delivering Your
                <span className="text-[#FFCC00]"> World,</span>
                <br />
                On Time.
              </h1>

              <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                Fast, reliable, and fully tracked shipping to 220+ countries.
                Experience logistics built for the modern world.
              </p>

              {/* Track form */}
              <form
                onSubmit={handleTrack}
                className="bg-white rounded-lg p-2 flex gap-2 max-w-xl mb-6 shadow-2xl"
              >
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter tracking number..."
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#D40511] text-white px-5 py-3 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors flex items-center gap-2 shrink-0"
                >
                  <Package size={15} />
                  Track
                </button>
              </form>

              <div className="flex items-center gap-6 text-sm text-gray-300">
                {[
                  "Real-time tracking",
                  "220+ Countries",
                  "Insured shipments",
                ].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-[#FFCC00]" />
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-[#D40511] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#FFCC00]">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold mt-1 text-red-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRACK BANNER ─── */}
      <section className="bg-[#FFCC00] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-[#1a1a1a]">
                Where is my shipment?
              </h2>
              <p className="text-sm text-gray-700 mt-1">
                Enter your tracking number to get real-time updates
              </p>
            </div>
            <form
              onSubmit={handleTrack}
              className="flex gap-2 w-full md:w-auto"
            >
              <input
                type="text"
                placeholder="e.g. SWX-2026-DEMO01"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="border-2 border-[#1a1a1a] rounded px-4 py-2.5 text-sm flex-1 md:w-72 outline-none bg-white font-medium"
              />
              <button
                type="submit"
                className="bg-[#D40511] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors flex items-center gap-2 shrink-0"
              >
                Track <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[#D40511] text-sm font-black uppercase tracking-widest">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Everything Your Business Needs
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              From local express to global freight — we handle it all with
              precision and care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              >
                <div
                  className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <service.icon size={22} className={service.iconColor} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[#D40511] text-sm font-black uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Ship in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {[
              {
                step: "01",
                title: "Book a Shipment",
                desc: "Fill in sender and receiver details, package info, and choose your service level.",
                img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
              },
              {
                step: "02",
                title: "We Pick It Up",
                desc: "Our courier collects your package and it enters our global logistics network.",
                img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
              },
              {
                step: "03",
                title: "Track & Receive",
                desc: "Track every step in real time. Your package delivered safely to the recipient.",
                img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-5 overflow-hidden rounded-xl h-48">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#D40511] text-white text-sm font-black px-3 py-1 rounded">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-black text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / IMAGE SPLIT ─── */}
      <section
        id="about"
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#D40511] text-sm font-black uppercase tracking-widest">
                About SwiftXpress
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-5">
                Trusted by Thousands of Businesses Worldwide
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Since our founding, SwiftXpress has been at the forefront of
                global logistics. We combine cutting-edge technology with a
                human touch to deliver packages safely and on time — every time.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Real-time GPS tracking on all shipments",
                  "Dedicated account managers for businesses",
                  "Full cargo insurance options",
                  "Eco-friendly shipping initiatives",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle
                      size={16}
                      className="text-[#D40511] shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#D40511] text-white px-6 py-3 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors"
              >
                Get Started <ArrowRight size={15} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80"
                alt="Logistics warehouse"
                className="rounded-xl h-48 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80"
                alt="Shipping containers"
                className="rounded-xl h-48 w-full object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80"
                alt="Delivery van"
                className="rounded-xl h-48 w-full object-cover -mt-4"
              />
              <img
                src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=600&q=80"
                alt="Air cargo"
                className="rounded-xl h-48 w-full object-cover mt-4"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[#FFCC00] text-sm font-black uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="text-[#FFCC00] fill-[#FFCC00]"
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT CTA ─── */}
      <section
        id="contact"
        className="py-20 bg-[#FFCC00]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-4">
              Ready to Ship with Confidence?
            </h2>
            <p className="text-gray-700 mb-8 text-sm">
              Join thousands of businesses who trust SwiftXpress for their
              logistics needs. Get a free quote today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:support@swiftxpress.com"
                className="bg-[#D40511] text-white px-8 py-3.5 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors"
              >
                Contact Us Today
              </a>
              <a
                href="/track"
                className="bg-[#1a1a1a] text-white px-8 py-3.5 rounded font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                Track a Shipment
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}