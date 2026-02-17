import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-dark text-gray-400 mt-20">
      {/* Top gradient accent line */}
      <div className="h-1 w-full gradient-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Shop<span className="text-[oklch(0.78_0.16_75)]">Mart</span>
              </span>
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your one-stop destination for the latest technology, fashion, and lifestyle products.
              Quality guaranteed with fast shipping and excellent customer service.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-500 text-sm group">
                <MapPin className="w-4 h-4 mr-2.5 text-gray-600 group-hover:text-[oklch(0.78_0.16_75)] transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">20 Shop Street, DOKI, DC 12345</span>
              </div>

              <div className="flex items-center text-gray-500 text-sm group">
                <Phone className="w-4 h-4 mr-2.5 text-gray-600 group-hover:text-[oklch(0.78_0.16_75)] transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">(+20)010131888460</span>
              </div>

              <div className="flex items-center text-gray-500 text-sm group">
                <Mail className="w-4 h-4 mr-2.5 text-gray-600 group-hover:text-[oklch(0.78_0.16_75)] transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">ahmedsmir200@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "Products" },
                { href: "/categories", label: "Categories" },
                { href: "/brands", label: "Brands" },
                { href: "/profile", label: "Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-3">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/help", label: "Help Center" },
                { href: "/track-order", label: "Track Your Order" },
                { href: "/returns", label: "Returns & Exchanges" },
                { href: "/size-guide", label: "Size Guide" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">About</h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/careers", label: "Careers" },
                { href: "/press", label: "Press & Media" },
                { href: "/investor-relations", label: "Investor Relations" },
                { href: "/sustainability", label: "Sustainability" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Policies</h3>
            <ul className="space-y-3">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/cookie-policy", label: "Cookie Policy" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} ShopMart. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-600 text-xs hover:text-gray-400 transition-colors cursor-pointer">English (US)</span>
              <span className="text-gray-600 text-xs hover:text-gray-400 transition-colors cursor-pointer">EGP (£)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;