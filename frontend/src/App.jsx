 import React from "react";
import { Routes, Route } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import FAQ from "./pages/faq"; // Make sure filename matches exactly
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // ✅ Import ScrollToTop component
import CareerPage from "./pages/Career";

export default function App() {
  return (
    <>
      <TopNavbar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/careers" element={<CareerPage />} />
      </Routes>

      <Footer />

      {/* ✅ Add scroll-to-top button globally */}
      <ScrollToTop />
    </>
  );
}
