 import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function ContactUs() {
  const { settings } = useSettings();

  const CONTACT_EMAIL = settings?.email || "info@decoderhealth.com";
  const CONTACT_PHONE = settings?.phone || "+1 (571) 530-9004";
  const CONTACT_ADDRESS =
    settings?.address || " Arlington, WA";
  const MAP_LINK =
    settings?.mapLink ||
    `https://maps.google.com/?q=${encodeURIComponent(CONTACT_ADDRESS)}`;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    }, 1200);
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-[#F5F9FF] via-white to-[#EEF4FF] py-28">
      {/* soft glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#1E63D9]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-[#3F7FEF]/10 rounded-full blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#E7F0FF] text-[#1E63D9] rounded-full text-sm font-semibold mb-6">
            Contact Us
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Let’s Start a
            <span className="block text-[#1E63D9]">Conversation</span>
          </h1>

          <p className="text-lg text-gray-600">
            Have questions or need support? Our team is ready to help you every
            step of the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-14 items-start">
          {/* ================= CONTACT INFO ================= */}
          <div className="space-y-6">
            {[ 
              {
                icon: Mail,
                label: "Email Us",
                value: CONTACT_EMAIL,
                link: `mailto:${CONTACT_EMAIL}`,
              },
              {
                icon: Phone,
                label: "Call Us",
                value: CONTACT_PHONE,
                link: `tel:${CONTACT_PHONE}`,
              },
              {
                icon: MapPin,
                label: "Visit Us",
                value: CONTACT_ADDRESS,
                link: MAP_LINK,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.link}
                  target={i === 2 ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group block bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E63D9] to-[#3F7FEF] rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-semibold text-gray-900 leading-snug">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* ================= FORM ================= */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200">
            {success && (
              <div className="mb-8 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
                <CheckCircle className="w-6 h-6" />
                <span>Thank you! We’ll get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="input"
              />

              <textarea
                rows="5"
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="input resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1E63D9] to-[#3F7FEF] text-white py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* INPUT STYLE */}
      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #D1D5DB;
            border-radius: 0.75rem;
            padding: 1rem;
            font-size: 0.95rem;
            outline: none;
            background: #fff;
          }
          .input:focus {
            border-color: #1E63D9;
            box-shadow: 0 0 0 3px rgba(30,99,217,0.15);
          }
        `}
      </style>
    </main>
  );
}
