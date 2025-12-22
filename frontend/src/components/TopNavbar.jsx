 import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube, // ✅ YOUTUBE
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSettings } from "../context/SettingsContext";

export default function TopNavbar() {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();

  const address = settings?.address || "Aldie, Virginia ";
  const phone = settings?.phone || "+1 (571) 530-9004";
  const email = settings?.email || "info@decoderhealth.com";

  const facebook = settings?.facebook || "";
  const instagram = settings?.instagram || "";
  const x = settings?.twitter || settings?.x || "";
  const tiktok = settings?.tiktok || "";

  // ✅ STATIC YOUTUBE LINK
  const youtube = "https://www.youtube.com/@DecoderHealth";

  return (
    <div className="bg-[#0B5ED7] text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4">

        {/* ===== DESKTOP ===== */}
        <div className="hidden md:flex justify-center items-center py-3">
          <div className="flex flex-wrap items-center justify-center gap-10 text-sm font-medium">

            {/* Address */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#EAF2FF] transition"
            >
              <FaMapMarkerAlt />
              <span>{address}</span>
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-2 hover:text-[#EAF2FF] transition"
            >
              <FaPhoneAlt />
              <span>{phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-[#EAF2FF] transition"
            >
              <FaEnvelope />
              <span>{email}</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-4 ml-2">
              {facebook && (
                <a href={facebook} target="_blank" rel="noreferrer" className="hover:text-[#EAF2FF]">
                  <FaFacebookF />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-[#EAF2FF]">
                  <FaInstagram />
                </a>
              )}
              {x && (
                <a href={x} target="_blank" rel="noreferrer" className="hover:text-[#EAF2FF]">
                  <FaXTwitter />
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noreferrer" className="hover:text-[#EAF2FF]">
                  <FaTiktok />
                </a>
              )}

              {/* ✅ YOUTUBE */}
              <a
                href={youtube}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#EAF2FF]"
              >
                <FaYoutube />
              </a>
            </div>

          </div>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="md:hidden flex justify-between items-center py-3">
          <span className="text-sm font-semibold">
            {address.split(",")[0]}
          </span>

          <button
            onClick={() => setOpen(!open)}
            className="text-white text-lg"
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-[#0A58CA] rounded-lg mb-3 py-4 px-3 flex flex-col gap-3 text-sm">

            <a href={`tel:${phone}`} className="flex gap-2 items-center">
              <FaPhoneAlt /> {phone}
            </a>

            <a href={`mailto:${email}`} className="flex gap-2 items-center">
              <FaEnvelope /> {email}
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              className="flex gap-2 items-center"
            >
              <FaMapMarkerAlt /> {address}
            </a>

            {/* Mobile Social */}
            <div className="flex gap-4 pt-2">
              {facebook && (
                <a href={facebook} target="_blank" rel="noreferrer">
                  <FaFacebookF />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noreferrer">
                  <FaInstagram />
                </a>
              )}
              {x && (
                <a href={x} target="_blank" rel="noreferrer">
                  <FaXTwitter />
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noreferrer">
                  <FaTiktok />
                </a>
              )}

              {/* ✅ YOUTUBE */}
              <a
                href={youtube}
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
