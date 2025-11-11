 import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/autism-logo.webp";

export default function MainNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const navLinkClasses = ({ isActive }) =>
    `relative px-3 py-2 font-medium transition-all duration-300 ${
      isActive
        ? "text-[#F57C00]"
        : "text-gray-700 hover:text-[#2E7D32]"
    } group`;

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg py-2" : "shadow-md py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with hover effect */}
          <NavLink
            to="/"
            aria-label="Home"
            className="flex items-center transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={logo}
              alt="Autism ABA Partners logo"
              className={`object-contain transition-all duration-300 ${
                scrolled ? "h-16" : "h-20"
              }`}
            />
          </NavLink>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
            <li>
              <NavLink to="/" className={navLinkClasses}>
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F57C00] to-[#2E7D32] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/about-us" className={navLinkClasses}>
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F57C00] to-[#2E7D32] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={navLinkClasses}>
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F57C00] to-[#2E7D32] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className={navLinkClasses}>
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F57C00] to-[#2E7D32] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/careers" className={navLinkClasses}>
                Career
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F57C00] to-[#2E7D32] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </li>
          </ul>

          {/* Contact CTA Button - Enhanced */}
          <NavLink
            to="/contact-us"
            className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-[#F57C00] to-[#FF8A33] text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-xl hover:from-[#2E7D32] hover:to-[#388E3C] transform hover:scale-105 transition-all duration-300"
          >
            <span>Contact Us</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </NavLink>

          {/* Mobile Menu Button - Enhanced */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            <div className="relative w-6 h-5">
              <span
                className={`absolute w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  menuOpen ? "top-2 rotate-45" : "top-0"
                }`}
              ></span>
              <span
                className={`absolute top-2 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`absolute w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  menuOpen ? "top-2 -rotate-45" : "top-4"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Enhanced with overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl lg:hidden animate-slideIn">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Close menu"
                >
                  <FaTimes className="text-gray-700 text-xl" />
                </button>
              </div>

              {/* Navigation Links */}
              <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about-us", label: "About Us" },
                  { to: "/services", label: "Services" },
                  { to: "/faq", label: "FAQ" },
                  { to: "/careers", label: "Career" },
                ].map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#F57C00]/10 to-[#FF8A33]/10 text-[#F57C00] border-l-4 border-[#F57C00]"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#2E7D32]"
                        }`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Contact Button */}
              <div className="p-6 border-t border-gray-200">
                <NavLink
                  to="/contact-us"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#F57C00] to-[#FF8A33] text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-[#2E7D32] hover:to-[#388E3C] transform hover:scale-105 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Contact Us</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Add animation styles */}
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
            .animate-slideIn {
              animation: slideIn 0.3s ease-out;
            }
          `}</style>
        </>
      )}
    </nav>
  );
}