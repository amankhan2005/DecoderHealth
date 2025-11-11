 import React, { useState } from "react";
import { Upload, CheckCircle, Briefcase, XCircle, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import careerBeach from "../assets/carrer.webp"; // ✅ Imported image

export default function CareerPage({ apiEndpoint = "/api/career/apply" }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim() || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    zip: "",
    city: "",
    state: "",
    credential: "",
    interested: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });

  // 🎊 Confetti Animation
  const launchConfetti = () => {
    const duration = 1.5 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 6,
        startVelocity: 25,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  // 💬 Popup
  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 3000);
  };

  // 🧠 USA Standard Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit U.S. phone number.";
    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip))
      newErrors.zip = "Enter a valid U.S. ZIP code (e.g. 21286 or 21286-1234).";
    if (!formData.credential)
      newErrors.credential = "Please select credentialing status.";
    if (!formData.interested)
      newErrors.interested = "Please select your role of interest.";
    if (!formData.resume) newErrors.resume = "Please upload your resume file.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📝 Handle Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // 🚀 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const url = `${BACKEND_URL}${apiEndpoint}`.replace(/([^:]\/)\/+/g, "$1");
      const response = await fetch(url, { method: "POST", body: data });
      const result = await response.json();

      if (response.ok) {
        showPopup("success", "✅ Application submitted successfully!");
        launchConfetti();
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          zip: "",
          city: "",
          state: "",
          credential: "",
          interested: "",
          resume: null,
        });
        setErrors({});
      } else {
        showPopup("error", result.message || "❌ Failed to submit application.");
      }
    } catch (error) {
      console.error("Error:", error);
      showPopup("error", "Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white text-gray-800 min-h-screen relative">
      {/* 🌟 Popup */}
   {popup.show && (
  <div className="fixed inset-0 flex items-center justify-center z-[200] px-4">
    <div
      className={`flex items-center gap-4 px-8 py-5 rounded-2xl shadow-2xl text-white text-base font-medium transform transition-all duration-300 max-w-md ${
        popup.type === "success"
          ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600"
          : "bg-gradient-to-br from-red-500 via-rose-500 to-pink-600"
      }`}
      style={{
        animation: 'slideIn 0.3s ease-out',
        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset'
      }}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
        popup.type === "success" 
          ? "bg-white/25" 
          : "bg-white/25"
      }`}>
        {popup.type === "success" ? (
          <CheckCircle className="w-7 h-7 text-white drop-shadow-lg" />
        ) : (
          <XCircle className="w-7 h-7 text-white drop-shadow-lg" />
        )}
      </div>
      <span className="tracking-wide flex-1">{popup.message}</span>
    </div>
  </div>
)}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Briefcase className="w-4 h-4" />
                <span>We’re Hiring ABA Professionals!</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Build a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  Rewarding Career in Autism Care
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Join{" "}
                <span className="font-semibold text-orange-600">
                  Autism ABA Partners
                </span>{" "}
                — where compassion meets science. Help children with autism reach
                their full potential through dedicated Applied Behavior Analysis
                (ABA) therapy.
              </p>
            </div>

            {/* Right Form */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Start Your Application
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name + ZIP */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full name *"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="ZIP Code (e.g. 21286)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400"
                      />
                      {errors.zip && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.zip}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email + City */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address *"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  {/* Phone + State */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number (10 digits) *"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.phone}
                        </p>
                      )}
                    </div>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  {/* Credential + Interest */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <select
                        name="credential"
                        value={formData.credential}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="">Credentialing Status *</option>
                        <option value="RBT Certified">I’m RBT certified</option>
                        <option value="In Process">In process of RBT certification</option>
                        <option value="BCBA Certified">I’m BCBA certified</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.credential && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.credential}
                        </p>
                      )}
                    </div>

                    <div>
                      <select
                        name="interested"
                        value={formData.interested}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="">I’m interested in *</option>
                        <option value="BCBA Roles">BCBA Roles</option>
                        <option value="RBT Roles">RBT Roles</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.interested && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.interested}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="relative">
                    <label className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 cursor-pointer transition-all bg-gray-50 hover:bg-orange-50 group">
                      <Upload className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 font-medium">
                        {formData.resume ? formData.resume.name : "Upload Your Resume *"}
                      </span>
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    {errors.resume && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1 justify-center">
                        <AlertCircle className="w-4 h-4" /> {errors.resume}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      PDF, DOC, DOCX – Max 10MB
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Make a Real Difference in the Autism Community
              </h2>
              <p className="text-lg text-gray-600">
                Autism ABA Partners is dedicated to helping children and families
                thrive through evidence-based ABA therapy. Join our compassionate
                and skilled team today.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Professional Development", desc: "Continuous training and growth opportunities" },
                  { title: "Work-Life Balance", desc: "Flexible hours to fit your lifestyle" },
                  { title: "Supportive Culture", desc: "Collaborate with experts who care about your success" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold transition-all shadow-md"
              >
                <Briefcase className="w-5 h-5" /> Apply Now
              </button>
            </div>

            {/* Imported Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur-2xl opacity-20"></div>
                <img
                  src={careerBeach}
                  alt="Family enjoying the beach together after ABA therapy progress"
                  className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
