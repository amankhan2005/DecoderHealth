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
    <div className="min-h-screen bg-[#0A3F24] flex items-center justify-center p-6">
      {/* CARD */}
      <div className="w-full max-w-md bg-[#23B14D] rounded-3xl shadow-2xl p-10 border border-green-900">
        
        {/* TITLE */}
        <h2 className="text-4xl font-extrabold text-white text-center mb-2">
          Admin Login
        </h2>

        <p className="text-white/80 text-center mb-8 text-sm tracking-wide">
          Compassion in Every Sense.
        </p>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-7">

          {/* USERNAME */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-green-700/40 text-white placeholder-white/70 border border-green-200 px-12 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white font-semibold"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-green-700/40 text-white placeholder-white/70 border border-green-200 px-12 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white font-semibold"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
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
              bg-white text-green-800 font-extrabold text-lg 
              hover:bg-yellow-300 transition-all 
              shadow-xl hover:shadow-2xl
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-6 text-white/70 text-sm">
          Secure Admin Access — PR5-Hearts Network
        </p>
      </div>
    </div>
  );
}
