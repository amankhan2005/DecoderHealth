import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import logo from "../assets/autism-logo.webp"; // replace with your actual logo path

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#07251f] to-[#0f2b23] text-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top grid - 4 equal columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start pb-10">
          {/* Column 1 - Logo / About */}
          <div className="px-2 md:px-6 text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4">
              <div className="bg-white p-3 rounded-xl shadow-lg inline-block">
                <img
                  src={logo}
                  alt="Autism ABA Partners Logo"
                  className="w-36 h-auto object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-4">
              Empowering children through evidence-based ABA therapy and family
              support across the United States.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="px-2 md:px-6">
            <h4 className="text-lg font-semibold text-white mb-3 relative inline-block after:block after:w-12 after:h-1 after:bg-orange-400 after:rounded-sm after:mt-3">
              Quick Links
            </h4>

            <ul className="mt-4 space-y-3 text-gray-300 text-sm">
              <li>
                <a
                  href="/"
                  className="block hover:text-white hover:pl-2 transition-all"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  className="block hover:text-white hover:pl-2 transition-all"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="block hover:text-white hover:pl-2 transition-all"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="block hover:text-white hover:pl-2 transition-all"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="block hover:text-white hover:pl-2 transition-all"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="block hover:text-white hover:pl-2 transition-all"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Get in Touch */}
          <address className="not-italic px-2 md:px-6">
            <h4 className="text-lg font-semibold text-white mb-3 relative inline-block after:block after:w-12 after:h-1 after:bg-orange-400 after:rounded-sm after:mt-3">
              Get in Touch
            </h4>

            <ul className="mt-4 space-y-4 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-400 mt-1" aria-hidden />
                <a
                  href="https://maps.google.com/?q=849+Fairmount+Ave,+Suite+200-T8,+Towson,+MD+21286"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  849 Fairmount Ave, Suite
                  <br />
                  200-T8 Towson, MD 21286, USA
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-orange-400" aria-hidden />
                <a
                  href="tel:+14109055477"
                  className="hover:text-white transition-colors"
                >
                  (410) 905-5477
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-orange-400" aria-hidden />
                <a
                  href="mailto:info@autismabapartners.com"
                  className="hover:text-white transition-colors"
                >
                  info@autismabapartners.com
                </a>
              </li>
            </ul>
          </address>

          {/* Column 4 - Follow Us */}
          <div className="px-2 md:px-6">
            <h4 className="text-lg font-semibold text-white mb-3 relative inline-block after:block after:w-12 after:h-1 after:bg-orange-400 after:rounded-sm after:mt-3">
              Follow Us
            </h4>

            <p className="text-gray-300 text-sm mt-2 mb-4">
              Join our community for tips, success stories, and event
              announcements.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1WinbTxPSC/?mibextid=wwXIfr"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://x.com/ABAPartner"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <FaTwitter />
              </a>

              <a
                href="https://www.instagram.com/autismabapartners?igsh=dTl2a2dodWQ3anR2&utm_source=qr"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with border top */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-center gap-3 text-sm text-gray-400">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} Autism ABA Partners. All Rights
            Reserved.
          </div>
          <div className="text-center md:text-left">
            Developed by{" "}
            <a
              href="https://www.webieapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              WebieApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
