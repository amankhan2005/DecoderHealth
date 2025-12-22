 import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCog,
  FaEnvelope,
  FaBriefcase,
  FaBars,
  FaTimes,
  FaMapMarkerAlt,
  FaImages,
} from "react-icons/fa";
import Logo from "../assets/autism-logo.webp";

const SIDEBAR_WIDTH = {
  mobile: "w-64",
  tablet: "md:w-72",
  collapsed: "lg:w-20",
  expanded: "lg:w-64",
};

export default function AdminSidebar({
  isOpen,
  setIsOpen,
  isExpanded,
  setIsExpanded,
}) {
  const sidebarRef = useRef(null);
  const firstNavLinkRef = useRef(null);

  const links = useMemo(
    () => [
      { name: "Dashboard", path: "/admin", icon: <FaHome /> },
      { name: "Global Settings", path: "/admin/settings", icon: <FaCog /> },
      { name: "Contacts", path: "/admin/contacts", icon: <FaEnvelope /> },
      { name: "Careers", path: "/admin/careers", icon: <FaBriefcase /> },

      // ⭐ MAP SETTINGS ADDED HERE
      { name: "Map Settings", path: "/admin/map-settings", icon: <FaMapMarkerAlt /> },
      { name: "Hero Images", path: "/admin/hero-images", icon: <FaImages /> },
    ],
    []
  );

  // ESC close
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") setIsOpen(false);
    },
    [setIsOpen]
  );

  // Outside click (mobile only)
  const handleClickOutside = useCallback(
    (e) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        window.innerWidth < 1024
      ) {
        setIsOpen(false);
      }
    },
    [isOpen, setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleEscape, handleClickOutside]);

  // Focus first link on open
  useEffect(() => {
    if (isOpen && firstNavLinkRef.current) {
      firstNavLinkRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") return;

    const navLinks = Array.from(
      sidebarRef.current?.querySelectorAll("nav a") || []
    );
    const currentIndex = navLinks.indexOf(document.activeElement);

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex =
        e.key === "ArrowDown"
          ? (currentIndex + 1) % navLinks.length
          : (currentIndex - 1 + navLinks.length) % navLinks.length;

      navLinks[nextIndex]?.focus();
    }
  };

  return (
    <>
      {/* Mobile trigger button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[100] p-3 rounded-full bg-yellow-500 text-white shadow-lg hover:scale-110 active:scale-95 transition"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars className="w-5 h-5" />
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-[100]
          bg-green-600
          text-white shadow-xl border-r border-green-700/40
          transform transition-all duration-300
          flex flex-col overflow-hidden

          ${isOpen ? `${SIDEBAR_WIDTH.mobile} md:${SIDEBAR_WIDTH.tablet}` : "-translate-x-full lg:translate-x-0"}
          ${isExpanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed}
        `}
        onMouseEnter={() => window.innerWidth >= 1024 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 1024 && setIsExpanded(false)}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b border-green-700/40 ${
            isExpanded ? "" : "lg:justify-center"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl border border-black/10 shadow-sm">
              <img
                src={Logo}
                alt="Autism ABA Logo"
                className="h-9 w-9 lg:h-9 lg:w-9 object-contain"
              />
            </div>
            {isExpanded && (
              <span className="text-lg font-semibold text-white tracking-wide">
                Admin Panel
              </span>
            )}
          </div>

          {/* Close button (mobile) */}
          <button
            className="lg:hidden p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {links.map((link, i) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  ref={i === 0 ? firstNavLinkRef : null}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center w-full transition-all px-4 py-3 rounded-xl
                    ${
                      isActive
                        ? "bg-yellow-500 shadow text-white"
                        : "hover:bg-green-600 active:bg-green-600/70"
                    }
                    ${isExpanded ? "justify-start gap-3" : "lg:justify-center"}
                    `
                  }
                >
                  <span className="text-xl">{link.icon}</span>
                  {isExpanded && (
                    <span className="text-sm font-medium">{link.name}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {isExpanded && (
          <div className="p-4 border-t border-green-700/40 bg-green-900/30 text-xs text-green-200">
            <p>© {new Date().getFullYear()} Autism ABA</p>
            <p className="mt-1 text-green-300">Version 1.0.0</p>
          </div>
        )}
      </aside>
    </>
  );
}
