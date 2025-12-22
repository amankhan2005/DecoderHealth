 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin({ onLogin }) {
  const nav = useNavigate();

  const defaultUser = import.meta.env.VITE_ADMIN_USER || "";
  const defaultPass = import.meta.env.VITE_ADMIN_PASS || "";

  const [username, setUsername] = useState(defaultUser);
  const [password, setPassword] = useState(defaultPass);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    onLogin({ username, password });
    nav("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FF] via-white to-[#EEF4FF] flex items-center justify-center p-6">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-blue-100">

        {/* TITLE */}
        <h2 className="text-4xl font-extrabold text-[#0B5ED7] text-center mb-2">
          Admin Login
        </h2>

        <p className="text-gray-500 text-center mb-8 text-sm tracking-wide">
          Secure access to Decoder Health Dashboard
        </p>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-7">

          {/* USERNAME */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B5ED7]/70" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full bg-[#F7FAFF] text-gray-800
                  border border-blue-200
                  px-12 py-3 rounded-2xl
                  focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]
                  placeholder-gray-400 font-semibold
                "
                placeholder="Enter admin username"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B5ED7]/70" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full bg-[#F7FAFF] text-gray-800
                  border border-blue-200
                  px-12 py-3 rounded-2xl
                  focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]
                  placeholder-gray-400 font-semibold
                "
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B5ED7]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3.5 rounded-2xl
              bg-[#0B5ED7] text-white
              font-extrabold text-lg
              hover:bg-[#084298] transition-all
              shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-6 text-gray-400 text-sm">
          Secure Admin Access — Decoder Health
        </p>
      </div>
    </div>
  );
}
