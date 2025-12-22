 import {
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaRegEnvelope, // ✅ WORKING MAIL ICON
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

import defaultLogo from "../assets/svgviewer-output.svg";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  // -------- STATIC LOGO --------
  const logoUrl = defaultLogo;

  // -------- DEFAULT VALUES --------
  const defaultEmail = "info@decoderhealth.com";
  const defaultPhone = "+1 (571) 530-9004";
  const defaultAddress = "Arlington, WA";
  const defaultAddressLink = "https://maps.app.goo.gl/Hd9ZWFgmg6h2tHdv8";

  const address = settings?.address || defaultAddress;
  const addressLink = settings?.address
    ? `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`
    : defaultAddressLink;

  const phone = settings?.phone || defaultPhone;
  const phoneHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  const email = settings?.email || defaultEmail;
  const cleanedEmail = email.replace(/(<([^>]+)>)/gi, "").trim();

  const facebook = settings?.facebook || settings?.fb || "";
  const instagram = settings?.instagram || settings?.ig || "";
  const twitter = settings?.twitter || settings?.x || settings?.x_url || "";
  const tiktok =
    settings?.tiktok || settings?.tikTok || settings?.tiktok_url || "";

  return (
    <footer className="bg-[#0B5ED7] text-white relative pt-24 pb-10">

      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/80" />

      {/* MAIN GRID */}
      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-16">

        {/* LOGO + TAGLINE */}
        <div>
          <div className="bg-white p-4 rounded-xl shadow-md inline-block mb-4">
            <img src={logoUrl} alt="Footer Logo" className="w-32 h-auto" />
          </div>

          <p className="text-sm text-white/85 leading-relaxed">
            Empowering children through evidence-based ABA therapy and family support.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-10 after:h-1 after:bg-white after:mt-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-white/85">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about-us" className="hover:text-white">About Us</a></li>
            <li><a href="/team" className="hover:text-white">Team</a></li>
            <li><a href="/careers" className="hover:text-white">Career</a></li>
             <li><a href="/faq" className="hover:text-white">FAQs</a></li>
            <li><a href="/contact-us" className="hover:text-white">Contact</a></li>
            
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-10 after:h-1 after:bg-white after:mt-2">
            Services
          </h3>
          <ul className="space-y-2 text-sm text-white/85">
            <li><a href="/services/culturally-responsive-care" className="hover:text-white">Culturally Responsive Care</a></li>
            <li><a href="/services/compassion-respect" className="hover:text-white">Compassion & Respect</a></li>
            <li><a href="/services/evidence-based-aba" className="hover:text-white">Evidence-Based ABA</a></li>
             <li><a href="/services/flexible-support" className="hover:text-white">Flexible Support</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-10 after:h-1 after:bg-white after:mt-2">
            Get in Touch
          </h3>

          <ul className="space-y-4 text-sm text-white/85">
            <li className="flex gap-3">
              <FaMapMarkerAlt className="text-white text-lg flex-shrink-0 mt-0.5" />
              <a href={addressLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {address}
              </a>
            </li>

            <li className="flex gap-3">
              <FaPhone className="text-white text-lg scale-x-[-1] flex-shrink-0" />
              <a href={phoneHref} className="hover:text-white">
                {phone}
              </a>
            </li>

            <li className="flex gap-3">
              <FaRegEnvelope className="text-white text-lg flex-shrink-0 mt-0.5" />
              <a href={`mailto:${cleanedEmail}`} className="hover:text-white">
                {cleanedEmail}
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-10 after:h-1 after:bg-white after:mt-2">
            Follow Us
          </h3>

          <p className="text-sm text-white/85 mb-4">
            Join our community for tips, stories, and updates.
          </p>

          <div className="flex gap-3">
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-md hover:bg-white hover:text-[#0B5ED7] transition"
              >
                <FaFacebookF />
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-md hover:bg-white hover:text-[#0B5ED7] transition"
              >
                <FaInstagram />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-md hover:bg-white hover:text-[#0B5ED7] transition"
              >
                <FaTwitter />
              </a>
            )}
            {tiktok && (
              <a
                href={tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-md hover:bg-white hover:text-[#0B5ED7] transition"
              >
                <SiTiktok />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/20 mt-16 pt-6 text-center text-sm text-white/70">
        © {new Date().getFullYear()} Decoder Health. All Rights Reserved.{" "}
        <br className="md:hidden" />
        Developed by{" "}
        <a
          href="https://www.webieapp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-90"
        >
          WebieApp
        </a>
      </div>
    </footer>
  );
}
