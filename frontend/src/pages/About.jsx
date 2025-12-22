 import React, { useEffect, useState } from "react";

import {
  FaHeart,
  FaHandsHelping,
  FaBrain,
  FaStar,
  FaSeedling,
  FaCheckCircle,
} from "react-icons/fa";

 import familyCard from "../assets/Home/EveryChild.webp";
import evidenceCard from "../assets/Home/evidence.webp";

export default function About() {
  const [mapAddress, setMapAddress] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/map`)
      .then((res) => res.json())
      .then((data) => setMapAddress(data?.mapAddress || ""));
  }, []);

  const finalAddress =
    mapAddress || "Arlington, WA";

  return (
    <div className="bg-white text-gray-800">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-r from-[#0B5ED7] via-[#1E6EEB] to-[#3B82F6] py-24 px-6 overflow-hidden">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#93C5FD]/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-[#BFDBFE]/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2.5 rounded-full text-sm font-medium mb-6">
            <FaHeart />
            Our Story
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            About Our <span className="text-white/90">Journey</span>
          </h1>

          <div className="w-20 h-1.5 bg-white mx-auto mb-8 rounded-full" />

          <p className="text-lg max-w-3xl mx-auto">
            Empowering children and families through compassionate,
            evidence-based ABA therapy
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="inline-flex items-center gap-2 border border-[#D6E4FF] text-[#0B5ED7] px-5 py-2.5 rounded-full text-sm font-medium mb-6">
              <FaHeart /> Our Mission
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Every Child Deserves to{" "}
              <span className="text-[#0B5ED7]">Shine</span>
            </h2>

            <div className="w-20 h-1.5 bg-[#0B5ED7] rounded-full mb-8" />

            <p className="text-lg text-gray-700 mb-6">
              <strong>DECODER Health</strong> is a minority woman-owned practice
              providing evidence-based ABA services to children with autism in
              their natural environments across Northern Virginia.
            </p>

            <p className="text-gray-600">
              Our Board-Certified Behavior Analysts design individualized
              programs centered around daily routines, cultural values, and
              real-life family priorities.
            </p>
          </div>

          <div className="relative">
            <img
              src={familyCard}
              alt="Family Centered Care"
              className="rounded-3xl shadow-2xl object-cover w-full h-[650px]"
            />
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#F5F9FF] via-white to-[#EEF4FF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 border border-[#D6E4FF] text-[#0B5ED7] px-5 py-2.5 rounded-full text-sm font-medium mb-6">
              <FaStar /> What Drives Us
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Core Values
            </h2>

            <div className="w-20 h-1.5 bg-[#0B5ED7] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Compassion",
                icon: <FaHeart />,
                text: "We lead with empathy and dignity in every interaction.",
              },
              {
                title: "Collaboration",
                icon: <FaHandsHelping />,
                text: "Working together with families and caregivers.",
              },
              {
                title: "Growth",
                icon: <FaSeedling />,
                text: "Celebrating every milestone, big or small.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-10 border border-[#E5EEFF] hover:shadow-xl transition"
              >
                <div className="w-16 h-16 bg-[#0B5ED7] rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APPROACH ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <img
            src={evidenceCard}
            alt="Evidence Based Care"
            className="rounded-3xl shadow-2xl h-[650px] object-cover"
          />

          <div>
            <span className="inline-flex items-center gap-2 border border-[#D6E4FF] text-[#0B5ED7] px-5 py-2.5 rounded-full text-sm font-medium mb-6">
              <FaBrain /> Our Approach
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Evidence-Based Care
            </h2>

            <div className="w-20 h-1.5 bg-[#0B5ED7] rounded-full mb-8" />

            <p className="text-lg text-gray-700 mb-8">
              Our therapy integrates research-driven ABA techniques with
              compassionate, culturally responsive care.
            </p>

            {[
              "Communication & language development",
              "Social & peer interaction",
              "Emotional regulation",
              "Daily living & independence skills",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 mb-4">
                <div className="bg-[#0B5ED7] p-2.5 rounded-xl text-white">
                  <FaCheckCircle />
                </div>
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      {/* <section className="py-12 px-6 bg-white">
        <iframe
          title="Decoder Health Location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            finalAddress
          )}&z=13&output=embed`}
          width="100%"
          height="450"
          className="rounded-2xl shadow-lg"
          loading="lazy"
        />
      </section> */}

     </div>
  );
}
