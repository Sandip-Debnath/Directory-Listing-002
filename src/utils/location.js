// src/utils/location.js
const LOC_KEY = "current_location"; // { lat:number, long:number, ts:number }

export function getSavedLocation() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOC_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (
      v &&
      typeof v.lat === "number" &&
      typeof v.long === "number"
    ) return v;
  } catch {}
  return null;
}

export function saveLocation(lat, long) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      LOC_KEY,
      JSON.stringify({ lat: Number(lat), long: Number(long), ts: Date.now() })
    );
  } catch {}
}

export async function detectLocation() {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation not supported in this browser.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords || {};
        if (typeof latitude !== "number" || typeof longitude !== "number") {
          reject(new Error("Unable to read position."));
          return;
        }
        saveLocation(latitude, longitude);
        resolve({ lat: latitude, long: longitude });
      },
      (err) => {
        reject(new Error(err?.message || "Permission denied or unavailable."));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });
}
