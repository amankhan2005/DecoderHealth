 import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";

const LOGOUT_DELAY = 1500;

export default function AdminHeader({
  isOpen,
  isExpanded,
  setIsOpen,
  onLogout,
  user,
}) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dontAsk, setDontAsk] = useState(false);

  const menuRef = useRef(null);
  const modalRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ESC key */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
        setShowModal(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const startLogout = useCallback(() => {
    setShowModal(false);
    setLoading(true);

    setTimeout(() => {
      onLogout?.();
      setLoading(false);
    }, LOGOUT_DELAY);
  }, [onLogout]);

  const handleLogout = useCallback(() => {
    dontAsk ? startLogout() : setShowModal(true);
  }, [dontAsk, startLogout]);

  return (
    <header
      className={`
        fixed top-0 right-0 h-20 md:h-24 w-full z-[900]
        bg-blue-600 shadow-xl
        flex items-center justify-between text-white
        px-4 sm:px-6 md:px-8 transition-all duration-300
        ${isOpen ? "lg:left-64" : isExpanded ? "lg:left-64" : "lg:left-20"}
      `}
    >
      {/* SIDEBAR TOGGLE — MOBILE */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2.5 bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition"
      >
        <FaBars className="text-xl" />
      </button>

      {/* BRAND */}
      <h1 className="font-bold text-xl sm:text-2xl md:text-3xl tracking-wide">
        Decoder Health
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        
        {/* DESKTOP LOGOUT */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 
            bg-white/20 px-4 py-2 rounded-xl border border-white/30 
            hover:bg-white/30 transition"
        >
          <FaSignOutAlt />
          <span className="font-semibold">Logout</span>
        </button>

        {/* USER MENU */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center hover:bg-white/20 rounded-full p-1 transition"
          >
            <FaUserCircle className="h-10 w-10" />
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-gray-200 text-gray-700 text-sm">
                <div className="font-semibold">
                  {user?.name || "Admin"}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex md:hidden items-center space-x-2 
                  text-red-600 font-medium hover:bg-red-50 px-4 py-2 text-sm"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TOP PROGRESS BAR */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-white/20 z-[999]">
          <div className="h-full bg-blue-300 animate-[progress_1.5s_linear_forwards]" />
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => setShowModal(false)}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to log out?
            </p>

            <div className="flex items-center justify-center mb-4">
              <input
                id="dontAsk"
                type="checkbox"
                checked={dontAsk}
                onChange={() => setDontAsk(!dontAsk)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="dontAsk" className="text-sm text-gray-600">
                Don't ask again
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={startLogout}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes progress { 0%{width:0;} 100%{width:100%;} }
        @keyframes fadeIn { from { opacity:0; transform:scale(.95); } to { opacity:1; transform:scale(1); } }
        .animate-fadeIn { animation: fadeIn .25s ease-out; }
      `}</style>
    </header>
  );
}
