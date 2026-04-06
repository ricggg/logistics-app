// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Globe,
  Shield,
  Truck,
  BarChart3,
  ArrowRight,
  Search,
  Star,
  CheckCircle,
  Plane,
  Ship,
  Headphones,
  Lock,
  RefreshCw,
  PhoneCall,
  Mail,
  Clock,
  Send,
  AlertCircle,
  Plus,
  Minus,
  Award,
} from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

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
    desc: "Reliable cross-border shipping to 220+ countries with full customs support included.",
    color: "bg-yellow-50",
    iconColor: "text-[#e6b800]",
  },
  {
    icon: Plane,
    title: "Air Freight",
    desc: "Time-critical airfreight solutions for businesses that cannot afford delays.",
    color: "bg-red-50",
    iconColor: "text-[#D40511]",
  },
  {
    icon: Ship,
    title: "Ocean Freight",
    desc: "Cost-effective sea freight for large cargo. FCL and LCL options available.",
    color: "bg-yellow-50",
    iconColor: "text-[#e6b800]",
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
    iconColor: "text-[#e6b800]",
  },
];

const stats = [
  { value: "220+", label: "Countries Served" },
  { value: "2M+", label: "Shipments Monthly" },
  { value: "99.8%", label: "On-Time Delivery" },
  { value: "24/7", label: "Customer Support" },
];

const partners = [
  { abbr: "DHL" },
  { abbr: "FedEx" },
  { abbr: "Amazon" },
  { abbr: "Shopify" },
  { abbr: "Maersk" },
  { abbr: "UPS" },
];

const howItWorks = [
  {
    step: "01",
    title: "Book Your Shipment",
    desc: "Enter package details, choose your service level, and get instant pricing. No hidden fees, no surprises.",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop&q=80",
    alt: "Booking a shipment online",
  },
  {
    step: "02",
    title: "We Pick It Up",
    desc: "Our courier collects your package from your door and it enters our secure global logistics network.",
    img: "https://images.unsplash.com/photo-1609750422604-de4f59e87d58?w=800&h=500&fit=crop&q=80",
    alt: "Courier picking up package",
  },
  {
    step: "03",
    title: "Track & Receive",
    desc: "Real-time GPS tracking every step of the way. Delivered safely, on time, every time.",
    img: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&h=500&fit=crop&q=80",
    alt: "Package delivered to recipient",
  },
];

const aboutImages = [
  {
    src: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&h=400&fit=crop&q=80",
    alt: "Modern distribution warehouse",
  },
  {
    src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&h=400&fit=crop&q=80",
    alt: "Shipping containers at port",
  },
  {
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop&q=80",
    alt: "Delivery truck on highway",
  },
  {
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&q=80",
    alt: "Air cargo plane on tarmac",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Director, RetailPlus",
    text: "SwiftXpress transformed our delivery operations. Delivery complaints dropped by 80% in the first month alone.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&q=80",
  },
  {
    name: "Michael Okonkwo",
    role: "CEO, AfroTrade International",
    text: "The best logistics partner we have had in 10 years. Fast, transparent, and the team genuinely cares about our business.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&q=80",
  },
  {
    name: "Emma Clarke",
    role: "Operations Manager, TechShip Co.",
    text: "International shipping made easy. Customs handling is seamless and tracking is always accurate. A true game-changer.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&q=80",
  },
];

const guarantees = [
  {
    icon: Shield,
    title: "100% Insured",
    desc: "Every shipment fully protected",
  },
  {
    icon: RefreshCw,
    title: "Money-Back Guarantee",
    desc: "Late delivery means full refund",
  },
  {
    icon: Lock,
    title: "Secure Handling",
    desc: "ISO 9001 certified processes",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Real humans, always available",
  },
];

const faqs = [
  {
    question: "How do I track my shipment?",
    answer:
      "Enter your tracking number on our tracking page or homepage search bar. You will get real-time updates on location, estimated delivery time, and status — updated every few minutes.",
  },
  {
    question: "What countries do you ship to?",
    answer:
      "We ship to 220+ countries worldwide, covering all major markets across North America, Europe, Asia, Africa, and South America. Contact us for specific country availability.",
  },
  {
    question: "How long does international shipping take?",
    answer:
      "Standard international shipping takes 5–10 business days. Express international arrives in 2–4 business days. Actual times vary by destination and customs clearance.",
  },
  {
    question: "Are my packages insured?",
    answer:
      "Yes. All shipments include basic insurance up to $100. Additional coverage is available for high-value items. We also offer signature confirmation and enhanced tracking.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, bank transfers, and net-30 terms for approved business accounts.",
  },
  {
    question: "Can I schedule a pickup?",
    answer:
      "Absolutely. Schedule a pickup through our website, mobile app, or by calling our team. Same-day pickup is available in most major cities.",
  },
  {
    question: "What if my package is damaged or lost?",
    answer:
      "We maintain a 99.8% successful delivery rate. In the rare event of damage or loss, file a claim within 30 days and we will resolve it promptly. All shipments are insured.",
  },
  {
    question: "Do you offer business or enterprise solutions?",
    answer:
      "Yes. We provide dedicated account managers, volume discounts, API integration, custom reporting, and fully tailored logistics solutions for businesses of all sizes.",
  },
];

// ─────────────────────────────────────────
// FAQ ITEM COMPONENT
// ─────────────────────────────────────────

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-[#D40511] transition-colors cursor-pointer"
      >
        <span className="font-bold text-gray-900 pr-4 text-sm sm:text-base">
          {question}
        </span>
        <div className="shrink-0">
          {isOpen ? (
            <Minus size={18} className="text-[#D40511]" />
          ) : (
            <Plus size={18} className="text-gray-400" />
          )}
        </div>
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-sm text-gray-600 pb-5 leading-relaxed">
            {answer}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────

export default function HomePage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      router.push(
        `/tracking-result?number=${encodeURIComponent(trackingInput.trim())}`
      );
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setTimeout(() => {
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      setTimeout(() => setFormStatus("idle"), 6000);
    }, 1500);
  };

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO
          Busy premium warehouse interior —
          industrial, powerful, trustworthy
      ══════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">

        {/* Background: high-volume warehouse interior */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1800&h=1000&fit=crop&q=90')",
          }}
        />

        {/* Left-heavy dark overlay so headline reads perfectly */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/30" />

        {/* Bottom fade into stats bar */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#D40511] to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="inline-block bg-[#FFCC00] text-[#1a1a1a] text-xs font-black px-3 py-1.5 rounded uppercase tracking-widest">
                  Trusted by 10,000+ Businesses
                </span>
                <span className="inline-block bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded backdrop-blur-sm">
                  ⭐ 4.9 / 5 Trustpilot Rating
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
              >
                Industrial Power.
                <br />
                <span className="text-[#FFCC00]">Global Reach.</span>
                <br />
                On-Time. Every Time.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-gray-200 text-lg mb-8 leading-relaxed max-w-xl"
              >
                From our high-volume distribution centres to your customer's
                door — SwiftXpress delivers with speed, precision, and full
                cargo visibility across 220+ countries.
              </motion.p>

              {/* Tracking form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                onSubmit={handleTrack}
                className="bg-white rounded-lg p-2 flex gap-2 max-w-xl mb-6 shadow-2xl"
              >
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter tracking number (e.g. SWX-2024-001)..."
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#D40511] text-white px-5 py-3 rounded font-bold text-sm hover:bg-[#b8040e] transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Package size={15} />
                  Track Now
                </button>
              </motion.form>

              {/* Trust microcopy */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="flex flex-wrap items-center gap-5 text-sm text-gray-300"
              >
                {[
                  "Real-time GPS tracking",
                  "220+ Countries covered",
                  "Fully insured shipments",
                ].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-[#FFCC00]" />
                    {f}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section className="bg-[#D40511] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-black text-[#FFCC00] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-red-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST / PARTNER LOGOS
      ══════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
              Trusted by Leading Global Brands &amp; Logistics Networks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {partners.map((p) => (
                <div
                  key={p.abbr}
                  className="flex items-center justify-center px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg min-w-[100px] text-sm font-black text-gray-500 tracking-tight hover:border-[#FFCC00] hover:text-gray-700 transition-all"
                >
                  {p.abbr}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-5">
              * Partner logos shown for demonstration purposes
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════ */}
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
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-3">
              Everything Your Business Needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From local express delivery to global freight forwarding — we
              handle it all with precision, full cargo insurance, and guaranteed
              delivery times.
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
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#FFCC00] transition-all cursor-pointer"
              >
                <div
                  className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <service.icon size={24} className={service.iconColor} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-5 overflow-hidden rounded-xl h-56 shadow-md">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 bg-[#D40511] text-white text-lg font-black px-4 py-1.5 rounded-lg shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-black text-xl text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GUARANTEES
      ══════════════════════════════════════ */}
      <section className="py-16 bg-[#FFCC00]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-black text-[#1a1a1a] mb-2">
              Our Guarantee to You
            </h2>
            <p className="text-gray-700">
              We stand behind every shipment with industry-leading protections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-[#D40511] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <item.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section id="about" className="py-20 bg-gray-50">
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
                Trusted by 10,000+ Businesses Worldwide
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Since 2010, SwiftXpress has been at the forefront of global
                logistics innovation. We combine cutting-edge technology with a
                human touch to deliver packages safely and on time — every
                single time.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Real-time GPS tracking on every shipment",
                  "Dedicated account managers for all business clients",
                  "Full cargo insurance up to $10,000 included",
                  "Carbon-neutral shipping options available",
                  "ISO 9001 certified quality management",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-gray-700"
                  >
                    <CheckCircle
                      size={18}
                      className="text-[#D40511] shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Award size={32} className="text-[#FFCC00] shrink-0" />
                <div>
                  <p className="text-sm font-black text-gray-900">
                    ISO 9001 Certified
                  </p>
                  <p className="text-xs text-gray-500">
                    International quality management standard
                  </p>
                </div>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#D40511] text-white px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors shadow-md"
              >
                Get Started Today <ArrowRight size={16} />
              </a>
            </motion.div>

            {/* Image grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {aboutImages.map((img, i) => (
                <img
                  key={img.alt}
                  src={img.src}
                  alt={img.alt}
                  className={`rounded-xl w-full h-48 object-cover shadow-md ${
                    i === 1
                      ? "mt-8"
                      : i === 2
                      ? "-mt-4"
                      : i === 3
                      ? "mt-4"
                      : ""
                  }`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[#FFCC00] text-sm font-black uppercase tracking-widest">
              Client Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3">
              What Our Clients Say
            </h2>
            <p className="text-gray-400">
              Real feedback from real businesses we have helped grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-[#FFCC00] transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="text-[#FFCC00] fill-[#FFCC00]"
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                  />
                  <div>
                    <div className="text-white font-bold text-sm">
                      {t.name}
                    </div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              ⭐ Rated 4.9 / 5 from 3,200+ verified reviews on Trustpilot
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT FORM
      ══════════════════════════════════════ */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#D40511] text-sm font-black uppercase tracking-widest">
                Get in Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">
                Ready to Ship Smarter?
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Tell us about your shipping needs and our logistics experts will
                get back to you within 24 hours with a tailored, no-obligation
                quote.
              </p>

              {/* Contact image */}
              <div className="rounded-xl overflow-hidden mb-8 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=400&fit=crop&q=80"
                  alt="Logistics operations team"
                  className="w-full h-56 object-cover"
                />
              </div>

              {/* Contact details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-[#D40511] rounded-lg flex items-center justify-center shrink-0">
                    <PhoneCall size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Call Us Directly</p>
                    <a
                      href="tel:+18002255345"
                      className="text-[#D40511] font-semibold hover:underline"
                    >
                      +1 (800) 225-5345
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-[#D40511] rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email Support</p>
                    <a
                      href="mailto:support@swiftxpress.com"
                      className="text-[#D40511] font-semibold hover:underline"
                    >
                      support@swiftxpress.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-[#D40511] rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Business Hours</p>
                    <p className="text-gray-600">
                      Mon – Fri: 8am – 8pm EST &nbsp;|&nbsp; 24/7 Online
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6">
                Get a Free Quote
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="John Smith"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john@company.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Service Needed *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Select a service</option>
                    <option value="express">Express Delivery</option>
                    <option value="international">
                      International Shipping
                    </option>
                    <option value="air">Air Freight</option>
                    <option value="ocean">Ocean Freight</option>
                    <option value="warehousing">Warehousing</option>
                    <option value="supply-chain">
                      Supply Chain Solutions
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Tell Us More
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Describe your shipment — origin, destination, volume, frequency..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {formStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg text-sm border border-green-200">
                    <CheckCircle size={18} />
                    <span>
                      Message sent! We will contact you within 24 hours.
                    </span>
                  </div>
                )}
                {formStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-lg text-sm border border-red-200">
                    <AlertCircle size={18} />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  className="w-full bg-[#D40511] text-white px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-[#b8040e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                >
                  {formStatus === "loading" ? (
                    "Sending your request..."
                  ) : (
                    <>
                      <Send size={16} />
                      Get My Free Quote
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  No spam. No obligation. We respond within 24 hours.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#D40511] text-sm font-black uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-sm">
              Got questions? We have answers. Can not find what you are looking
              for?{" "}
              <a
                href="#contact"
                className="text-[#D40511] font-semibold hover:underline"
              >
                Contact us
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl p-6 md:p-8"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#FFCC00] text-[#1a1a1a] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#e6b800] transition-colors"
            >
              Still have questions? Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&h=700&fit=crop&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-[#D40511]/90" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to Ship with Confidence?
            </h2>
            <p className="text-red-100 mb-8 text-lg max-w-2xl mx-auto">
              Join 10,000+ businesses who trust SwiftXpress for their global
              logistics needs. Get your free quote in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="bg-white text-[#D40511] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Get Free Quote
              </a>
              <a
                href="/track"
                className="bg-[#FFCC00] text-[#1a1a1a] px-8 py-4 rounded-lg font-bold hover:bg-[#e6b800] transition-colors shadow-lg"
              >
                Track a Shipment
              </a>
            </div>
            <p className="text-red-100 text-sm mt-6">
              ✓ No credit card required &nbsp;·&nbsp; ✓ Free quote in 24
              hours &nbsp;·&nbsp; ✓ Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}