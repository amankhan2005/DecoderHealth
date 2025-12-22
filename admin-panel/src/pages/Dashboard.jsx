 // src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchDashboard } from "../api/settingsService";

export default function AdminDashboard({ creds }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  async function load() {
    setLoading((v) => (data ? v : true));
    setRefreshing(!!data);
    try {
      const d = await fetchDashboard(creds);
      setData(d || {});
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (!creds) return;
    load();
  }, [creds]);

  // Loader
  if (loading && !data) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div
          className={`relative backdrop-blur-xl rounded-3xl shadow-2xl p-12 ${
            darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white/40 border-black/10"
          } border`}
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div
              className={`absolute inset-0 border-4 ${
                darkMode ? "border-gray-700" : "border-black/10"
              } rounded-full`}
            />
            <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
            <div
              className="absolute inset-4 border-4 border-transparent border-t-green-500 rounded-full animate-spin"
              style={{
                animationDuration: "1.4s",
                animationDirection: "reverse",
              }}
            />
          </div>

          <p
            className={`text-xl font-bold tracking-wide ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Loading Dashboard…
          </p>
        </div>
      </div>
    );
  }

  // No Data
  if (!data) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div
          className={`relative text-center backdrop-blur-xl rounded-3xl shadow-2xl p-12 border ${
            darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white/40 border-black/10"
          }`}
        >
          <div
            className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center border ${
              darkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-white/40 border-black/10"
            }`}
          >
            <svg
              className={`w-8 h-8 ${
                darkMode ? "text-gray-400" : "text-black/70"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 
                  0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div
            className={`font-bold text-xl mb-2 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            No data available
          </div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-black/60"
            }`}
          >
            Try again later.
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Contacts",
      count: data.contactsCount ?? 0,
      subtext: `${data.unhandledContacts ?? 0} unhandled`,
      accent: "orange", // Changed from "indigo" to "orange"
      icon: (
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 
              0L21 8M5 19h14a2 2 0 002-2V7a2 
              2 0 00-2-2H5a2 2 0 00-2 2v10a2 
              2 0 002 2z"
          />
        </svg>
      ),
      trend: data.contactsTrend ?? 0,
    },
    {
      label: "Careers",
      count: data.careersCount ?? 0,
      subtext: `${data.activeCareers ?? 0} active`,
      accent: "green",
      icon: (
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7V5a2 2 0 00-2-2h-4a2 
               2 0 00-2 2v2M3 11h18M5 
               21h14a2 2 0 002-2v-6H3v6a2 
               2 0 002 2z"
          />
        </svg>
      ),
      trend: data.careersTrend ?? 0,
    },
  ];

  const accentMap = {
    orange: {
      // Changed from "indigo" to "orange"
      badge: darkMode
        ? "bg-orange-900/30 text-orange-300 border-orange-700/50"
        : "bg-orange-100 text-orange-700 border-orange-300",
      icon: "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg",
      dot: "bg-orange-500 shadow-[0_0_12px_rgba(251,146,60,0.6)]",
      count: darkMode ? "text-orange-300" : "text-orange-700",
      halo: "from-orange-500/20 via-orange-400/10 to-transparent",
      chart: "rgb(251, 146, 60)",
    },
    green: {
      badge: darkMode
        ? "bg-green-900/30 text-green-300 border-green-700/50"
        : "bg-green-100 text-green-700 border-green-300",
      icon: "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg",
      dot: "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]",
      count: darkMode ? "text-green-300" : "text-green-700",
      halo: "from-green-500/20 via-green-400/10 to-transparent",
      chart: "rgb(34, 197, 94)",
    },
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } p-0 m-0 relative overflow-hidden`}
    >
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* MAIN WRAPPER */}
      <div className="max-w-7xl mx-auto relative z-10 p-6">
        {/* HEADER */}
        <div className="mb-10 mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className={`text-5xl sm:text-6xl font-black tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Dashboard
            </h2>
            <p
              className={`mt-3 font-medium text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Monitor everything that matters — instantly.{" "}
            </p>
          </div>

          <div className="flex gap-3">
            {/* THEME TOGGLE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`group flex items-center justify-center gap-2 rounded-xl border ${
                darkMode
                  ? "border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  : "border-gray-200 bg-white/50 text-gray-700 hover:bg-gray-100"
              } backdrop-blur-xl px-4 py-3 font-semibold shadow transition`}
            >
              {darkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* REFRESH BUTTON */}
            <button
              onClick={load}
              className={`group flex items-center gap-2 rounded-xl border ${
                darkMode
                  ? "border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  : "border-gray-200 bg-white/50 text-gray-700 hover:bg-gray-100"
              } backdrop-blur-xl px-6 py-3 font-semibold shadow transition`}
            >
              {refreshing ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v6h6M20 20v-6h-6M20 
                         8a8 8 0 01-7.5 7.98M4 
                         16A8 8 0 0011.5 8"
                    />
                  </svg>
                  Refreshing…
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v6h6M20 20v-6h-6M20 
                        8a8 8 0 01-7.5 7.98M4 
                        16A8 8 0 0011.5 8"
                    />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {stats.map((s) => {
            const a = accentMap[s.accent];
            return (
              <div
                key={s.label}
                className={`group relative rounded-3xl ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/70 border-gray-200"
                } backdrop-blur-xl p-8 border shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1`}
              >
                <div
                  className={`absolute -inset-x-4 -top-4 h-4 bg-gradient-to-r ${a.halo} 
                  rounded-t-3xl blur-xl`}
                />
                <div className="flex items-center justify-between">
                  <div
                    className={`p-5 rounded-2xl ${a.icon} transition-transform group-hover:scale-110`}
                  >
                    {s.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {s.trend !== 0 && (
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          s.trend > 0
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {s.trend > 0 ? "↑" : "↓"} {Math.abs(s.trend)}%
                      </span>
                    )}
                    <span
                      className={`px-5 py-2 text-xs font-extrabold rounded-xl ${a.badge}`}
                    >
                      Live
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-6 text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {s.label}
                </div>

                <div className={`mt-3 text-6xl font-black ${a.count}`}>
                  {s.count}
                </div>

                <div className="mt-4 flex items-center gap-3 text-base font-medium">
                  <span
                    className={`w-3 h-3 rounded-full ${a.dot} animate-pulse`}
                  />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {s.subtext}
                  </span>
                </div>

                {/* MINI CHART */}
                <div className="mt-6 h-12 rounded-lg overflow-hidden">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke={a.chart}
                      strokeWidth="2"
                      points="0,30 20,25 40,15 60,20 80,10 100,15"
                    />
                    <polyline
                      fill={a.chart}
                      fillOpacity="0.1"
                      points="0,30 20,25 40,15 60,20 80,10 100,15 100,40 0,40"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* TWO SECTIONS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-10">
          {/* CONTACTS */}
          <Section
            title="Latest Contacts"
            count={`${data.latestContacts?.length ?? 0} Recent`}
            color="orange" // Changed from "indigo" to "orange"
            items={data.latestContacts}
            type="contact"
            darkMode={darkMode}
          />

          {/* JOBS */}
          <Section
            title="Latest Jobs"
            count={`${data.latestJobs?.length ?? 0} Open`}
            color="green"
            items={data.latestJobs}
            type="job"
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}

/* SECTION COMPONENT */
function Section({ title, count, color, items, type, darkMode }) {
  const borderColor =
    color === "orange"
      ? darkMode
        ? "border-orange-800/30"
        : "border-orange-200"
      : darkMode
      ? "border-green-800/30"
      : "border-green-200";
  const badgeBg =
    color === "orange"
      ? darkMode
        ? "bg-orange-900/30 text-orange-300 border-orange-700/50"
        : "bg-orange-100 text-orange-700 border-orange-300"
      : darkMode
      ? "bg-green-900/30 text-green-300 border-green-700/50"
      : "bg-green-100 text-green-700 border-green-300";
  const dot = color === "orange" ? "bg-orange-500" : "bg-green-500";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <section
      className={`rounded-3xl backdrop-blur-xl border ${
        darkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/70 border-gray-200"
      } p-8 shadow-xl hover:shadow-2xl transition-all`}
    >
      <div className="mb-8 flex items-center justify-between">
        <h3
          className={`text-3xl font-black ${textColor} flex items-center gap-3 tracking-tight`}
        >
          <span className={`inline-block w-1.5 h-8 rounded-full ${dot}`} />
          {title}
        </h3>

        <span
          className={`px-5 py-2 text-sm font-bold rounded-xl ${badgeBg} border`}
        >
          {count}
        </span>
      </div>

      {!(items?.length > 0) ? (
        <EmptyState
          title={`No ${type}s`}
          subtitle={`New ${type}s will show here.`}
          color={color}
          darkMode={darkMode}
        />
      ) : (
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item, idx) => (
            <article
              key={item?._id || idx}
              className={`rounded-2xl border ${borderColor} ${
                darkMode
                  ? "bg-gray-700/30 hover:bg-gray-700/50"
                  : "bg-white/60 hover:bg-white/80"
              } backdrop-blur-xl p-6 transition-all hover:shadow-lg`}
            >
              {/* CONTACT CARD */}
              {type === "contact" ? (
                <>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${
                          color === "orange" ? "bg-orange-500" : "bg-green-500"
                        } text-white font-bold flex 
                        items-center justify-center text-xl`}
                      >
                        {(item?.parentName?.[0] || "?").toUpperCase()}
                      </div>

                      <div>
                        <div className={`font-bold ${textColor} text-lg`}>
                          {item?.parentName || "Unknown"}
                        </div>
                        <div
                          className={`text-sm ${
                            color === "orange"
                              ? "text-orange-400"
                              : "text-green-400"
                          }`}
                        >
                          {item?.email || "No email"}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs">
                      {item?.serviceInterest && (
                        <span
                          className={`px-3 py-1.5 rounded-lg ${
                            darkMode ? "bg-gray-700/50" : "bg-white/70"
                          } border ${
                            darkMode ? "border-gray-600" : "border-gray-200"
                          } ${
                            color === "orange"
                              ? "text-orange-400"
                              : "text-green-400"
                          } font-bold`}
                        >
                          {item.serviceInterest}
                        </span>
                      )}

                      <time
                        className={`px-3 py-1.5 rounded-lg ${
                          darkMode
                            ? "bg-gray-700/50 text-gray-400 border-gray-600"
                            : "bg-white/70 text-gray-600 border-gray-200"
                        } border`}
                      >
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>

                  {item?.message && (
                    <p
                      className={`mt-4 text-base ${subTextColor} leading-relaxed`}
                    >
                      {item.message}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {/* JOB CARD */}
                  <h4 className={`font-black ${textColor} text-xl mb-3`}>
                    {item?.title || "Untitled Job"}
                  </h4>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span
                      className={`px-3 py-1.5 rounded-lg ${
                        darkMode ? "bg-gray-700/50" : "bg-white/70"
                      } border ${
                        darkMode ? "border-gray-600" : "border-gray-200"
                      } ${
                        color === "orange"
                          ? "text-orange-400"
                          : "text-green-400"
                      } font-bold`}
                    >
                      📍 {item?.location || "Not specified"}
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-lg ${
                        darkMode ? "bg-gray-700/50" : "bg-white/70"
                      } border ${
                        darkMode ? "border-gray-600" : "border-gray-200"
                      } text-green-400 font-bold`}
                    >
                      🧷 {item?.type || "N/A"}
                    </span>
                  </div>

                  {item?.description && (
                    <p
                      className={`mt-4 text-base ${subTextColor} leading-relaxed`}
                    >
                      {item.description.slice(0, 150)}
                      {(item.description?.length ?? 0) > 150 ? "…" : ""}
                    </p>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* EMPTY STATE COMPONENT */
function EmptyState({ title, subtitle, color, darkMode }) {
  const iconColor = color === "orange" ? "text-orange-400" : "text-green-400";
  const bgColor =
    color === "orange"
      ? darkMode
        ? "bg-orange-900/20"
        : "bg-orange-100"
      : darkMode
      ? "bg-green-900/20"
      : "bg-green-100";

  return (
    <div
      className={`rounded-2xl border ${
        darkMode
          ? "border-gray-700 bg-gray-700/30"
          : "border-gray-200 bg-white/70"
      } backdrop-blur-xl p-12 text-center shadow-lg`}
    >
      <div
        className={`mx-auto mb-5 w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center shadow`}
      >
        <svg
          className={`w-8 h-8 ${iconColor}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M3 12a9 9 0 
              1018 0 9 9 0 10-18 0z"
          />
        </svg>
      </div>

      <div
        className={`font-black ${
          darkMode ? "text-white" : "text-gray-900"
        } text-xl mb-2`}
      >
        {title}
      </div>
      <div
        className={`text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        {subtitle}
      </div>
    </div>
  );
}
