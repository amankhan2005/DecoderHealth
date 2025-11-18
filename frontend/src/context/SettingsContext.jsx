 import { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings } from "../api/publicSettings";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "https://autismpartner.onrender.com/api";
  const ROOT = API_BASE.replace("/api", ""); // → http://localhost:5000

  useEffect(() => {
    fetchSettings().then((data) => {
      const g = data.global;

      // FIX: Make logo full URL
      const fixedLogo = g.logo
        ? `${ROOT}${g.logo.startsWith("/") ? g.logo : "/" + g.logo}`
        : "";

      setSettings({
        ...g,
        logo: fixedLogo
      });
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
