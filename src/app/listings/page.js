// src\app\listings\page.js
// 'use client';

// import { useState, useEffect, useMemo } from "react";
// import {
//   getCountries,
//   getStatesByCountry,
//   getCities,
//   getCategories,
//   getTags,
//   filterListings,
// } from "@/utils/api/handlers";
// import Link from 'next/link';
// import Image from 'next/image';
// import { useRouter } from "next/navigation";
// import { useSearchParams } from 'next/navigation';
// import { getSavedLocation, detectLocation } from "@/utils/location";


// import listingImage from '@/../public/assets/dashboard/assets/dist/img/05.jpg';
// const isRemoteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);

// export default function Listings() {
//   const searchParams = useSearchParams();
//   const initialCategorySlug = searchParams.get('category');
//   const initialSearch = searchParams.get('search') || "";
//   const initialMaxKm = Number(searchParams.get('max_distance_km')) || 10;
//   const [maxDistanceKm, setMaxDistanceKm] = useState(initialMaxKm);
//   const [coords, setCoords] = useState({ lat: null, long: null });
//   const [locMsg, setLocMsg] = useState("");

//   const router = useRouter();

//   const [form, setForm] = useState({
//     search: "",
//     country_id: "",
//     state_id: "",
//     city_id: "",
//     // API expects slug for category/tag (per your example). We'll keep id in UI but
//     // translate to slug at request-time.
//     category_id: "",
//     tag_ids: [],                 // multi-select in UI; we’ll send first tag’s slug as 'tag'
//     sort_by: "created_at",
//     sort_dir: "desc",
//     per_page: 10,
//     page: 1,
//   });

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [tags, setTags] = useState([]);

//   const [loading, setLoading] = useState({
//     countries: false, states: false, cities: false, list: false
//   });

//   // results
//   const [results, setResults] = useState({
//     data: [],
//     total: 0,
//     current_page: 1,
//     last_page: 1,
//     next_page_url: null,
//     prev_page_url: null,
//   });

//   // ---- helpers to look up slugs from selected ids ----
//   const selectedCategorySlug = useMemo(() => {
//     if (!form.category_id) return "";
//     const c = categories.find(c => String(c.id) === String(form.category_id));
//     return c?.slug || "";
//   }, [form.category_id, categories]);

//   const firstSelectedTagSlug = useMemo(() => {
//     if (!form.tag_ids?.length) return "";
//     const t = tags.find(t => String(t.id) === String(form.tag_ids[0]));
//     return t?.slug || t?.name || ""; // fallback if slug missing
//   }, [form.tag_ids, tags]);

//   // load saved coords if any
//   useEffect(() => {
//     const saved = getSavedLocation();
//     if (saved) setCoords({ lat: saved.lat, long: saved.long });
  
//     // Get location from query params if available
//     const currentLat = searchParams.get('current_lat');
//     const currentLong = searchParams.get('current_long');
//     if (currentLat && currentLong) {
//       setCoords({ lat: Number(currentLat), long: Number(currentLong) });
//     }
//   }, [searchParams]); 

//   // ---- initial data ----
//   useEffect(() => {
//     (async () => {
//       setLoading(prev => ({ ...prev, countries: true }));
//       try {
//         const [cRes, catRes, tagRes] = await Promise.all([
//           getCountries(),
//           getCategories(),
//           getTags(),
//         ]);
//         setCountries(cRes?.data || []);
//         setCategories(catRes || []);        // you already normalize to r?.data ?? []
//         setTags(tagRes || []);              // you already normalize to r?.data?.data ?? []
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(prev => ({ ...prev, countries: false }));
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     setForm(prev => ({ ...prev, search: initialSearch }));
//   }, [initialSearch]);
  
//   useEffect(() => {
//     const searchText = searchParams.get('search') || "";  // Get search term from URL
//     setForm(prev => ({ ...prev, search: searchText }));  // Update form state with search value
//   }, [searchParams]);  // Depend on searchParams to trigger this effect
  

//   async function onDetect() {
//     setLocMsg("Detecting...");
//     try {
//       const { lat, long } = await detectLocation();
//       setCoords({ lat, long });
//       setLocMsg("Location detected");
//       // Update the location and refetch listings with the new location
//       await fetchListings({ page: 1 });
//     } catch (e) {
//       setLocMsg(e.message || "Could not detect location");
//     }
//   }


//   // ---- dependent dropdowns ----
//   const onSelectCountry = async (countryId) => {
//     setForm(prev => ({ ...prev, country_id: countryId, state_id: "", city_id: "", page: 1 }));
//     setStates([]);
//     setCities([]);
//     if (!countryId) return;

//     setLoading(prev => ({ ...prev, states: true }));
//     try {
//       const response = await getStatesByCountry(countryId);
//       setStates(response.data || []);
//     } catch (error) {
//       console.error("Error fetching states:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, states: false }));
//     }
//   };

//   const onSelectState = async (stateId) => {
//     setForm(prev => ({ ...prev, state_id: stateId, city_id: "", page: 1 }));
//     setCities([]);
//     if (!stateId) return;

//     setLoading(prev => ({ ...prev, cities: true }));
//     try {
//       const response = await getCities({ state_id: stateId });
//       setCities(response.data || []);
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, cities: false }));
//     }
//   };

//   // ---- generic input handlers ----
//   const onInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value, page: 1 }));
//   };

//   // category checkbox (single selection behavior)
//   const onCategoryChange = (e) => {
//     const { checked, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       category_id: checked ? value : "",
//       page: 1,
//     }));
//   };

//   // tag checkbox (multi)
//   const onTagChange = (e) => {
//     const { checked, value } = e.target;
//     setForm(prev => {
//       const current = new Set(prev.tag_ids.map(String));
//       if (checked) current.add(String(value));
//       else current.delete(String(value));
//       return { ...prev, tag_ids: Array.from(current), page: 1 };
//     });
//   };

//   const onSortChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value, page: 1 }));
//   };

//   // ---- API call ----
//   const fetchListings = async ({ page, formOverride,excludeMaxDistance } = {}) => {
//     setLoading(prev => ({ ...prev, list: true }));
//     try {
//       const f = formOverride ?? form;
//       const catSlug = f.category_id ? getCategorySlugById(f.category_id) : "";
//       const tagSlug = f.tag_ids?.length ? getTagSlugById(f.tag_ids[0]) : "";
  
//       const params = {
//         ...(catSlug ? { category: catSlug } : {}),
//         ...(tagSlug ? { tag: tagSlug } : {}),
//         search: f.search || undefined,
//         country_id: f.country_id || undefined,
//         state_id: f.state_id || undefined,
//         city_id: f.city_id || undefined,
//         sort_by: f.sort_by || undefined,
//         sort_dir: f.sort_dir || undefined,
//         per_page: f.per_page || 10,
//         page: page ?? f.page ?? 1,
//         // Ensure these are always added before API call
//         current_lat: coords.lat || undefined,  // use saved location or undefined
//         current_long: coords.long || undefined, // same for long
//         max_distance_km: excludeMaxDistance ? undefined : maxDistanceKm,
//       };
  
//       const r = await filterListings(params);
//       const pg = r?.data ?? r;
//       setResults({
//         data: pg?.data ?? [],
//         total: pg?.total ?? 0,
//         current_page: pg?.current_page ?? 1,
//         last_page: pg?.last_page ?? 1,
//         next_page_url: pg?.next_page_url ?? null,
//         prev_page_url: pg?.prev_page_url ?? null,
//       });
//       setForm(prev => ({ ...prev, page: pg?.current_page ?? 1 }));
//     } catch (e) {
//       console.error("Error loading listings:", e);
//       setResults({
//         data: [],
//         total: 0,
//         current_page: 1,
//         last_page: 1,
//         next_page_url: null,
//         prev_page_url: null,
//       });
//     } finally {
//       setLoading(prev => ({ ...prev, list: false }));
//     }
//   };
  

//   // initial load
//   useEffect(() => {
//     fetchListings();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // if user changes distance, refetch
//   useEffect(() => {
//     if (coords.lat && coords.long) {
//       fetchListings({ page: 1 });
//     }
//   }, [coords, maxDistanceKm]);

//   // Seed from ?category=<slug> once categories are available
//   useEffect(() => {
//     if (!initialCategorySlug || !categories?.length) return;

//     const match = categories.find((c) => c.slug === initialCategorySlug);
//     if (!match) return;

//     // avoid re-seeding if already selected
//     if (String(form.category_id) === String(match.id)) return;

//     // atomically set form and fetch with the same snapshot
//     setForm((prev) => {
//       const next = { ...prev, category_id: String(match.id), page: 1 };
//       fetchListings({ page: 1, formOverride: next });
//       return next;
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initialCategorySlug, categories]);


//   // Apply filters (button)
//   const onApplyFilters = async () => {
//     await fetchListings({ page: 1 });
//   };

//   // Clear filters link
//   const onClearFilters = async (e) => {
//     e?.preventDefault?.();
//     const base = {
//       search: "",
//       country_id: "",
//       state_id: "",
//       city_id: "",
//       category_id: "",
//       tag_ids: [],
//       sort_by: "created_at",
//       sort_dir: "desc",
//       per_page: 10,
//       page: 1,
//     };
//     setForm(base);
//     setStates([]);
//     setCities([]);
//     await fetchListings({ page: 1, formOverride: base, excludeMaxDistance: true });
//   };


//   // pagination actions
//   const goPrev = async (e) => {
//     e?.preventDefault?.();
//     if (results.current_page > 1) {
//       await fetchListings({ page: results.current_page - 1 });
//     }
//   };
//   const goNext = async (e) => {
//     e?.preventDefault?.();
//     if (results.current_page < results.last_page) {
//       await fetchListings({ page: results.current_page + 1 });
//     }
//   };

//   const getCategorySlugById = (id) => {
//     const c = categories.find(c => String(c.id) === String(id));
//     return c?.slug || "";
//   };
//   const getTagSlugById = (id) => {
//     const t = tags.find(t => String(t.id) === String(id));
//     return t?.slug || t?.name || "";
//   };


//   // small helpers for card data
//   const primaryImage = (listing) =>
//     listing?.images?.[0]?.url || listingImage;

//   const gmUrl = (it) => {
//     if (it?.lat && it?.long) {
//       return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${it.lat},${it.long}`)}`;
//     }
//     return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it?.address || it?.listing_title || "")}`;
//   };

//   const ratingMeta = (it) => {
//     const ratings = Array.isArray(it?.reviews)
//       ? it.reviews
//         .map(r => Number(r?.rating))
//         .filter(n => Number.isFinite(n) && n > 0)
//       : [];
//     const reviewCount = ratings.length;
//     const avgRating = reviewCount
//       ? ratings.reduce((a, b) => a + b, 0) / reviewCount
//       : 0;
//     return { reviewCount, avgRating };
//   };

//   const reviewsText = (listing) =>
//     <span className="fw-medium text-primary">
//       <span className="fs-6 fw-semibold me-1">(4.5)</span>
//       {/* If you later have real counts: {listing.reviews_count} */}
//       2,391 reviews
//     </span>;

//   return (
//     <>
//       <div className="border-0 card header rounded-0 sticky-top">
//         <div className="border-bottom border-top p-3 p-xl-0 search-bar">
//           <div className="row g-3 g-xl-0">
//             <div className="col-12 d-xl-none">
//               <div className="collapse show" id="CollapseText">
//                 <h2 className="fw-semibold text-center search-bar-title mb-0">
//                   Find what<br /> you <span className="font-caveat text-primary">want</span>
//                 </h2>
//               </div>
//             </div>

//             <div className="col-md-8 col-lg-5 col-xl-5">
//               <div className="search-select-input has-icon has-icon-y position-relative">
//                 <input
//                   className="form-control"
//                   type="text"
//                   placeholder="What are you looking for?"
//                   name="search"
//                   value={form.search}
//                   onChange={onInputChange}
//                   onKeyDown={(e) => { if (e.key === 'Enter') onApplyFilters(); }}
//                 />
//                 <svg
//                   className="form-icon-start position-absolute top-50 bi bi-search"
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   fill="currentColor"
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
//                 </svg>

//               </div>
//               <div className="d-flex align-items-center gap-2 mt-2" style={{marginLeft:"20px"}}>
//                 <button
//                   type="button"
//                   className="btn btn-outline-primary btn-sm"
//                   onClick={onDetect}
//                 >
//                   {coords.lat ? "Update location" : "Use my location"}
//                 </button>
//                 <select
//                   className="form-select form-select-sm"
//                   style={{ maxWidth: 160 }}
//                   value={maxDistanceKm}
//                   onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
//                   title="Search within distance (km)"
//                 >
//                   {[5, 10, 20, 50, 100, 200].map(km => (
//                     <option key={km} value={km}>{km} km</option>
//                   ))}
//                 </select>
//                 {locMsg ? <span className="small text-muted">{locMsg}</span> : null}
//               </div>
//             </div>

//             {/* Country */}
//             <div className="col-md-2 col-lg-2 col-xl-2 d-none d-lg-block" style={{ margin: "12px 10px 0px 10px" }}>
//               <div className="form-group">
//                 <label>Country</label>
//                 <select
//                   className="form-control"
//                   value={form.country_id}
//                   onChange={(e) => onSelectCountry(e.target.value)}
//                 >
//                   <option value="">Select Country</option>
//                   {loading.countries ? (
//                     <option value="">Loading countries...</option>
//                   ) : (
//                     countries.map((country) => (
//                       <option key={country.id} value={country.id}>{country.name}</option>
//                     ))
//                   )}
//                 </select>
//               </div>
//             </div>

//             {/* State */}
//             <div className="col-md-2 col-lg-2 col-xl-2 d-none d-lg-block" style={{ margin: "12px 10px 0px 10px" }}>
//               <div className="form-group">
//                 <label>State</label>
//                 <select
//                   className="form-control"
//                   value={form.state_id}
//                   onChange={(e) => onSelectState(e.target.value)}
//                   disabled={!form.country_id}
//                 >
//                   <option value="">Select State</option>
//                   {loading.states ? (
//                     <option value="">Loading states...</option>
//                   ) : (
//                     states.map((state) => (
//                       <option key={state.id} value={state.id}>{state.name}</option>
//                     ))
//                   )}
//                 </select>
//               </div>
//             </div>

//             {/* City */}
//             <div className="col-md-2 col-lg-2 col-xl-2 d-none d-lg-block" style={{ margin: "12px 10px 0px 10px" }}>
//               <div className="form-group">
//                 <label>City</label>
//                 <select
//                   className="form-control"
//                   value={form.city_id}
//                   onChange={onInputChange}
//                   name="city_id"
//                   disabled={!form.state_id}
//                 >
//                   <option value="">Select City</option>
//                   {loading.cities ? (
//                     <option value="">Loading cities...</option>
//                   ) : (
//                     cities.map((city) => (
//                       <option key={city.id} value={city.id}>{city.name}</option>
//                     ))
//                   )}
//                 </select>
//               </div>
//             </div>

//             {/* mobile filters / map buttons untouched */}
//             <div className="col-lg-3 col-md-4 col-mg-3 d-xl-none gap-3 gap-md-2 hstack justify-content-center">
//               <a href="#" className="sidebarCollapse align-items-center d-flex justify-content-center filters-text fw-semibold gap-2">
//                 <i className="fa-solid fa-arrow-up-short-wide fs-18"></i>
//                 <span>All filters</span>
//               </a>
//               <div className="h-75 mt-auto vr d-md-none"></div>
//               <a href="#" id="mapCollapse" className="align-items-center d-flex justify-content-center filters-text fw-semibold gap-2">
//                 <i className="fa-solid fa-map-location-dot fs-18"></i>
//                 <span>Map</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="py-3 py-xl-5 bg-gradient">
//         <div className="container">
//           <div className="row">
//             <aside className="col-xl-3 filters-col content pe-lg-4 pe-xl-5 shadow-end">
//               <div className="js-sidebar-filters-mobile">
//                 <div className="border-bottom d-flex justify-content-between align-items-center p-3 sidebar-filters-header d-xl-none">
//                   <div className="align-items-center btn-icon d-flex filter-close justify-content-center rounded-circle">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
//                       <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
//                     </svg>
//                   </div>
//                   <span className="fs-3 fw-semibold">Filters</span>
//                   <a className="text-primary fw-medium" href="#" onClick={onClearFilters}>Clear</a>
//                 </div>

//                 <div className="sidebar-filters-body p-3 p-xl-0">
//                   {/* Categories */}
//                   <div className="mb-4 border-bottom pb-4">
//                     <div className="mb-3">
//                       <h4 className="fs-5 fw-semibold mb-2">Categories</h4>
//                       <p className="mb-0 small">Select categories of interest.</p>
//                     </div>

//                     {categories.map((category) => (
//                       <div className="form-check mb-2" key={category.id}>
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           value={category.id}
//                           checked={String(form.category_id) === String(category.id)}
//                           onChange={onCategoryChange}
//                           id={`category_${category.id}`}
//                         />
//                         <label className="form-check-label" htmlFor={`category_${category.id}`}>
//                           {category.name}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Tags */}
//                   <div className="mb-4 border-bottom pb-4">
//                     <div className="mb-3">
//                       <h4 className="fs-5 fw-semibold mb-2">Tags</h4>
//                       <p className="mb-0 small">Select tags related to your search.</p>
//                     </div>

//                     {tags.map((tag) => {
//                       const checked = form.tag_ids.map(String).includes(String(tag.id));
//                       return (
//                         <div className="form-check mb-2" key={tag.id}>
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             value={tag.id}
//                             checked={checked}
//                             onChange={onTagChange}
//                             id={`tag_${tag.id}`}
//                           />
//                           <label className="form-check-label" htmlFor={`tag_${tag.id}`}>
//                             {tag.name}
//                           </label>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Order by */}
//                   <div className="mb-4 border-bottom pb-4">
//                     <div className="mb-3">
//                       <h4 className="fs-5 fw-semibold mb-1">Order by</h4>
//                       <p className="mb-0 small">Duis a leo sit amet odio volutpat auctor ut a lorem.</p>
//                     </div>

//                     <select
//                       className="form-select"
//                       name="sort_by"
//                       value={form.sort_by}
//                       onChange={onSortChange}
//                     >
//                       <option value="created_at">Latest</option>
//                       <option value="listing_title">A-Z</option>
//                       {/* keep the others as placeholders if needed */}
//                     </select>

//                     <div className="mt-2">
//                       <select
//                         className="form-select"
//                         name="sort_dir"
//                         value={form.sort_dir}
//                         onChange={onSortChange}
//                       >
//                         <option value="desc">Descending</option>
//                         <option value="asc">Ascending</option>
//                       </select>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     className="btn btn-primary w-100"
//                     onClick={onApplyFilters}
//                     disabled={loading.list}
//                   >
//                     {loading.list ? "Applying..." : "Apply filters"}
//                   </button>

//                   <a href="#" className="align-items-center d-flex fw-medium gap-2 justify-content-center mt-2 small text-center" onClick={onClearFilters}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
//                       <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
//                       <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
//                     </svg>
//                     Clear filters
//                   </a>
//                 </div>
//               </div>
//             </aside>

//             <div className="col-xl-9 ps-lg-4 ps-xl-5 sidebar">
//               <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
//                 <div className="col fs-18 text-nowrap">
//                   All <span className="fw-bold text-dark">{results.total}</span> listing found
//                 </div>

//                 {/* <div className="border-0 card d-inline-flex flex-row flex-wrap gap-1 p-1 rounded-3 shadow-sm">
//                   <a href="/listings" className="btn btn-light btn-sm px-2 py-1"><i className="fa-solid fa-border-all"></i></a>
//                   <a href="/listings" className="btn btn-light btn-sm px-2 py-1"><i className="fa-solid fa-list"></i></a>
//                 </div> */}
//               </div>

//               {/* RESULTS */}
//               {results.data.map((item) => (
//                 <div
//                   key={item.id}
//                   className="card border-0 shadow-sm overflow-hidden rounded-4 mb-4 card-hover card-hover-bg"
//                   role="button"
//                   tabIndex={0}
//                   onClick={() => router.push(`/listing-details/${item.id}`)}
//                   onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && router.push(`/listing-details/${item.id}`)}
//                   style={{ cursor: "pointer" }}
//                 >

//                   <div className="card-body p-0">
//                     <div className="g-0 row">
//                       <div className="col-lg-5 col-md-5 col-xl-4 position-relative">
//                         <div className="card-image-hover dark-overlay h-100 overflow-hidden position-relative">
//                           {(() => {
//                             const srcVal = primaryImage(item); // ✅ per-card value
//                             return isRemoteUrl(srcVal) ? (
//                               <img
//                                 src={srcVal}
//                                 alt={item.listing_title || ""}
//                                 className="h-100 w-100 object-fit-cover"
//                                 loading="lazy"
//                               />
//                             ) : (
//                               <Image
//                                 src={srcVal}
//                                 alt={item.listing_title || ""}
//                                 width={600}
//                                 height={400}
//                                 className="h-100 w-100 object-fit-cover"
//                               />
//                             );
//                           })()}
//                           {/* <div className="bg-blur card-badge d-inline-block position-absolute start-0 text-white z-2">
//                             <i className="fa-solid fa-star me-1"></i>Featured
//                           </div> */}
//                         </div>
//                       </div>
//                       <div className="col-lg-7 col-md-7 col-xl-8 p-3 p-lg-4 p-md-3 p-sm-4">
//                         <div className="d-flex flex-column h-100">
//                           {/* <div className="d-flex end-0 gap-2 me-3 mt-3 position-absolute top-0 z-1">
//                             <a href="#" className="btn-icon shadow-sm d-flex align-items-center justify-content-center text-primary bg-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Bookmark">
//                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
//                                 <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
//                               </svg>
//                             </a>
//                           </div> */}

//                           {(() => {
//                             const { reviewCount, avgRating } = ratingMeta(item);
//                             return (
//                               <div className="align-items-center d-flex flex-wrap gap-1 text-primary card-start mb-2">
//                                 <i className="fa-solid fa-star"></i>
//                                 <span className="fw-medium text-primary">
//                                   <span className="fs-6 fw-semibold me-1">
//                                     ({reviewCount ? avgRating.toFixed(1) : "—"})
//                                   </span>
//                                   {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
//                                 </span>
//                               </div>
//                             );
//                           })()}

//                           <h4 className="fs-18 fw-semibold mb-0">
//                             {item.listing_title}
//                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-patch-check-fill text-success" viewBox="0 0 16 16" style={{ marginLeft: "5px" }}>
//                               <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"></path>
//                             </svg>
//                           </h4>

//                           {item.description && <p className="mt-3 fs-15">
//                             {item.description || ""}
//                           </p>}

//                           {item.address && <p className="mt-1 fs-14 text-muted mb-2">
//                             {item.address || ""}
//                           </p>}

//                           <div className="d-flex flex-wrap gap-3 mt-auto z-1">
//                             {item.mobile ? (
//                               <a href={`tel:${item.mobile}`} onClick={(e) => e.stopPropagation()} className="d-flex gap-2 align-items-center fs-13 fw-semibold">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#9b9b9b" className="bi bi-telephone" viewBox="0 0 16 16">
//                                   <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" />
//                                 </svg>
//                                 <span>{item.mobile}</span>
//                               </a>
//                             ) : null}

//                             <a
//                               href={gmUrl(item)}
//                               target="_blank"
//                               onClick={(e) => e.stopPropagation()}
//                               rel="noopener noreferrer"
//                               className="d-flex gap-2 align-items-center fs-13 fw-semibold"
//                               title="Open in Google Maps"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9b9b9b" className="bi bi-compass" viewBox="0 0 16 16">
//                                 <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
//                                 <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
//                               </svg>
//                               <span>Directions</span>
//                             </a>
//                           </div>

//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* PAGINATION (same class names) */}
//               {results.last_page > 1 && (
//                 <nav className="justify-content-center mt-5 pagination align-items-center">
//                   <a className="prev page-numbers" href="#" onClick={goPrev}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
//                       <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
//                     </svg>
//                     previous
//                   </a>
//                   <span className="page-numbers current">{results.current_page}</span>
//                   <a className="page-numbers" href="#" onClick={goNext}>next</a>
//                 </nav>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



// src\app\listings\page.js


'use client';

import { useState, useEffect, useMemo } from "react";
import {
  getCountries,
  getStatesByCountry,
  getCities,
  getCategories,
  getTags,
  filterListings,
} from "@/utils/api/handlers";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { getSavedLocation, detectLocation } from "@/utils/location";
import dynamic from 'next/dynamic';  // Import dynamic

import listingImage from '@/../public/assets/dashboard/assets/dist/img/05.jpg';
const isRemoteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);

// Dynamically import the Listings component and disable SSR (server-side rendering)
const Listings = dynamic(() => import('./ListingsComponent'), { ssr: false });

export default function ListingsPage() {
  return (
    <div>
      <Listings />  {/* This will now only load on the client-side */}
    </div>
  );
}
