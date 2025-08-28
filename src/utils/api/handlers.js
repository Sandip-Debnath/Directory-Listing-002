// src\utils\api\handlers.js

import { api } from "./client";

// ------- Base URL (from .env.local) -------
const BASE_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")) ||
  "";


// ------- Token helpers (optional) -------
const TOKEN_KEY = "auth_token";
let _token = null;

export const setAuthToken = (t) => {
  _token = t || null;
  try {
    if (t) localStorage.setItem("auth_token", t);
    else localStorage.removeItem("auth_token");
  } catch { }
};

const getAuthToken = () => {
  if (_token) return _token;
  try {
    _token = localStorage.getItem(TOKEN_KEY);
  } catch { }
  return _token;
};

// ------- Core HTTP helper (fetch) -------
const buildUrl = (path, params) => {
  const u = new URL(`${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) u.searchParams.append(k, v);
    });
  }
  return u.toString();
};

const http = async (
  path,
  { method = "GET", body, params, headers = {}, auth = false, form = false } = {}
) => {
  const url = buildUrl(path, params);

  const h = new Headers({
    Accept: "application/json",
    ...headers,
  });

  let payload = undefined;

  if (body !== undefined && body !== null) {
    if (form) {
      // FormData (for file uploads, etc.)
      payload = body instanceof FormData ? body : (() => {
        const fd = new FormData();
        Object.entries(body).forEach(([k, v]) => fd.append(k, v));
        return fd;
      })();
      // don't set Content-Type; browser will set boundary
    } else {
      h.set("Content-Type", "application/json");
      payload = JSON.stringify(body);
    }
  }

  if (auth) {
    const t = getAuthToken();
    if (t) h.set("Authorization", `Bearer ${t}`);
  }

  const res = await fetch(url, {
    method,
    headers: h,
    body: payload,
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err = { status: res.status, message, data };
    throw err;
  }
  return data;
};

// ------- Shorthand methods -------
const get = (path, options) => http(path, { method: "GET", ...(options || {}) });
const post = (path, body, options) => http(path, { method: "POST", body, ...(options || {}) });
const put = (path, body, options) => http(path, { method: "PUT", body, ...(options || {}) });
const del = (path, options) => http(path, { method: "DELETE", ...(options || {}) });

// ------- Auth endpoints -------
export const register = (payload) =>
  post("/register", payload, { auth: false });

export const login = async (payload) => {
  const { data } = await api.post("/login", payload); // or "/login" if that's your real path
  // backend returns { success, message, data: { user, token } }
  return data?.data ?? data; // -> { user, token }
};

export const logout = (token) =>
  post("/logout", { token }, { auth: false });

export const updateUser = (payload) => {
  const { token, ...clean } = payload || {};
  return post("/update-user", clean, { auth: true });
};

export const changePassword = (payload) =>
  post("/change-password", payload, { auth: true })

// ------- Listings (examples) -------
export const getListings = (params = {}) =>
  get("/listings", { params, auth: true });

export const getListing = (id) =>
  get(`/listings/${id}`, { auth: true });

export const createListing = (payload) =>
  post("/listings", payload, { auth: true });

export const updateListing = (id, payload) =>
  put(`/listings/${id}`, payload, { auth: true });

export const deleteListing = (id) =>
  del(`/listings/${id}`, { auth: true });

// Optionally expose the base for debugging
export const API_BASE = BASE_URL;
