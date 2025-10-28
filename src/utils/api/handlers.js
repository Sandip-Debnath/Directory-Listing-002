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
    const fromErrors =
      data && data.errors
        ? (typeof data.errors === "string" ? data.errors : JSON.stringify(data.errors))
        : null;

    const fromBodyString = typeof data === "string" ? data : null;

    const message =
      (data && (data.message || data.error)) ||
      fromErrors ||
      fromBodyString ||
      `HTTP ${res.status}`;

    throw { status: res.status, message, data };
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


export const getCountries = (params = {}) =>
  get("/countries", { params }); // if auth is needed: { params, auth:true }

export const getStates = (params = {}) =>
  get("/states", { params });

export const getStatesByCountry = (country_id) =>
  get("/states-by-country", { params: { country_id } });

export const getCities = (params = {}) =>
  get("/city-by-states", { params });

export const getCategories = async () => {
  const r = await get("/categories", { auth: true });
  return r?.data ?? [];
};

export const getTags = async (page = 1, per_page = 25) => {
  const r = await get("/tags", { params: { page, per_page }, auth: true });
  return r?.data?.data ?? [];
};


// --- Create Listing (multipart, with arrays + files) ---
export const createListing = async (payload = {}) => {
  // Build FormData manually so arrays/files are appended correctly.
  const fd = new FormData();

  const appendIf = (k, v) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    fd.append(k, v);
  };

  // Basic / contact / location / socials
  [
    "listing_title", "slug", "description",
    "address", "zipcode", "country_id", "state_id", "city_id",
    "lat", "long",
    "mobile", "email", "company_website",
    "fb_link", "twitter_link", "insta_link", "linkedin_link", "location_name",
  ].forEach((k) => appendIf(k, payload[k]));

  // Opening hours
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  days.forEach((d) => {
    appendIf(`${d}_open_time`, payload[`${d}_open_time`]);
    appendIf(`${d}_close_time`, payload[`${d}_close_time`]);
  });

  // Arrays (repeat keys with [] for typical Laravel-style parsing)
  if (Array.isArray(payload.category_ids)) {
    payload.category_ids.forEach((id) => appendIf("category_ids[]", String(id)));
  }
  if (Array.isArray(payload.tag_ids)) {
    payload.tag_ids.forEach((id) => appendIf("tag_ids[]", String(id)));
  }

  if (Array.isArray(payload.tag_names)) {
    payload.tag_names.forEach((name) => appendIf("tag_names[]", name));
  }

  // Files (multiple)
  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      if (file instanceof Blob) fd.append("images[]", file);
    });
  }

  // POST with auth + multipart
  return http("/listing/create", {
    method: "POST",
    body: fd,
    form: true,    // don't set Content-Type; browser will add boundary
    auth: true,    // adds Bearer token
  });
};



// ------- Listings (examples) -------

export const getMyListings = (params = {}) =>
  get("/my-listings", { params, auth: true });

export const getListingV2 = (id) =>
  get(`/listing/${id}`, { auth: true });

export const updateListingV2 = async (payload = {}) => {
  // Build FormData (supports arrays/files)
  const fd = new FormData();
  const appendIf = (k, v) => {
    if (v === undefined) return;          // skip only undefined
    if (v === null) { fd.append(k, ""); return; } // send empty string to nullify
    if (typeof v === "string" && v.trim() === "") return;
    fd.append(k, v);
  };

  // require listing id
  appendIf("id", payload.id);

  [
    "listing_title", "slug", "description",
    "address", "zipcode", "country_id", "state_id", "city_id",
    "lat", "long", "location_name",
    "mobile", "email", "company_website",
    "fb_link", "twitter_link", "insta_link", "linkedin_link",
    "monday_open_time", "monday_close_time",
    "tuesday_open_time", "tuesday_close_time",
    "wednesday_open_time", "wednesday_close_time",
    "thursday_open_time", "thursday_close_time",
    "friday_open_time", "friday_close_time",
    "saturday_open_time", "saturday_close_time",
    "sunday_open_time", "sunday_close_time",
  ].forEach((k) => appendIf(k, payload[k]));

  if (Array.isArray(payload.category_ids)) {
    payload.category_ids.forEach((id) => appendIf("category_ids[]", String(id)));
  }
  if (Array.isArray(payload.tag_ids)) {
    payload.tag_ids.forEach((id) => appendIf("tag_ids[]", String(id)));
  }
  if (Array.isArray(payload.tag_names)) {
    payload.tag_names.forEach((name) => appendIf("tag_names[]", name));
  }
  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      if (file instanceof Blob) fd.append("images[]", file);
    });
  }

  return http("/listing/update", {
    method: "POST",
    body: fd,
    form: true,
    auth: true,
  });
};

export const deleteListingV2 = (id) =>
  post("/listing/delete", { id }, { auth: true });

export const getListings = (params = {}) =>
  get("/listings", { params, auth: true });

export const getListing = (id) =>
  get(`/listings/${id}`, { auth: true });

export const updateListing = (id, payload) =>
  put(`/listings/${id}`, payload, { auth: true });

export const deleteListing = (id) =>
  del(`/listings/${id}`, { auth: true });

// Reviews: list (NO AUTH)
export const getListingReviews = (listingId, { page = 1, perPage = 10 } = {}) =>
  get(`/listings/${listingId}/reviews`, {
    params: { per_page: perPage, page },
    auth: false,
  });

// Reviews: create (AUTH)
export const createListingReview = async ({ listing_id, rating, comment }) => {
  // small guard (backend already validates)
  const rInt = parseInt(rating, 10);
  if (!Number.isInteger(rInt) || rInt < 1 || rInt > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }
  return post(`/listing-reviews`, { listing_id, rating: rInt, comment }, { auth: true });
};

export const getListingEnquiries = (listingId) =>
  get(`/listings/${listingId}/enquiries`, { auth: true });


export const createEnquiry = (payload = {}) =>
  post("/enquiries", payload, { auth: true });
// payload expects: { listing_id, name, email, message, channel?, payload?, status?, is_read?, ip_address? }
// Usually you'll just send { listing_id, name, email, message, channel: 'web' }.
// Backend should derive user_id from token; don't send user_id from client.

export const storeBookmark = (listing_id) =>
  post("/bookmarks", { listing_id }, { auth: true });

// Bookmarks

export const getMyBookmarks = (params = {}) =>
  get("/my-bookmarks", { params, auth: true }); 
  
export const getMyEnquiries = (params = {}) =>
  get("/my-enquiries", { params, auth: true });

export const deleteBookmark = (listing_id) =>
  post("/bookmarks/delete", { listing_id }, { auth: true });

// Optionally expose the base for debugging
export const API_BASE = BASE_URL;
