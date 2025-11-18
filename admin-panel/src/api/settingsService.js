 // src/api/settingsService.js
const API_BASE = import.meta.env.VITE_API_BASE || "https://autismpartner.onrender.com/api";

async function fetchJson(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  const txt = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${txt}`);
  }

  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

/* ------------------- SETTINGS ------------------- */
export async function fetchSettings() {
  return fetchJson("/settings");
}

// ✅ FIXED (Multipart FormData)
export async function updateSettings(creds, formData) {
  const res = await fetch(`${API_BASE}/settings/update`, {
    method: "POST",
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
      // ❌ Content-Type ko set mat karo — browser khud karega
    },
    body: formData
  });

  const txt = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${txt}`);
  }

  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

/* ------------------- SLIDER ------------------- */
 

/* ------------------- CONTACT ------------------- */
export async function submitContact(data) {
  return fetchJson("/contact/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function listContacts(creds) {
  return fetchJson("/contact/list", {
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    }
  });
}

export async function handleContact(creds, id) {
  return fetchJson(`/contact/handle/${id}`, {
    method: "POST",
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    }
  });
}

/* ------------------- CAREER ------------------- */
export async function fetchCareers() {
  return fetchJson("/career");
}

export async function createJob(creds, data) {
  return fetchJson("/career/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    },
    body: JSON.stringify(data)
  });
}

export async function updateJob(creds, id, data) {
  return fetchJson(`/career/update/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    },
    body: JSON.stringify(data)
  });
}

export async function deleteJob(creds, id) {
  return fetchJson(`/career/delete/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    }
  });
}

/* ------------------- DASHBOARD ------------------- */
export async function fetchDashboard(creds) {
  return fetchJson("/dashboard/summary", {
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    }
  });
}

/* ------------------- CAREER APPLICATIONS ADMIN ------------------- */
export async function fetchApplications(creds) {
  return fetchJson("/career/list", {
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    }
  });
}

export async function deleteApplication(creds, id) {
  return fetchJson(`/career/delete/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    }
  });
}

export async function downloadResume(creds, id) {
  const res = await fetch(`${API_BASE}/career/download/${id}`, {
    method: "GET",
    headers: {
      "x-admin-user": creds.username,
      "x-admin-pass": creds.password
    }
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status} ${txt}`);
  }

  const blob = await res.blob();

  const cd = res.headers.get("Content-Disposition") || "";
  let filename = "";
  const m1 = cd.match(/filename\*=UTF-8''(.+?)(;|$)/i);
  const m2 = cd.match(/filename="?([^";]+)"?/i);
  if (m1) {
    try { filename = decodeURIComponent(m1[1]); } catch { filename = m1[1]; }
  } else if (m2) {
    filename = m2[1];
  }

  return { blob, filename };
}
