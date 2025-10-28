// src/app/dashboard/listings/[id]/edit/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
    getCountries,
    getStatesByCountry,
    getCities,
    getCategories,
    getTags,
    getListingV2,
    updateListingV2,
} from "@/utils/api/handlers";
import TagPicker from "@/components/TagPicker";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { useParams, useRouter } from "next/navigation";
import fallbackImg from "@/../public/assets/dashboard/assets/dist/img/05.jpg";

export default function EditListingPage() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState({
        // Basic
        listing_title: "",
        slug: "",
        description: "",
        // Location
        address: "",
        zipcode: "",
        country_id: "",
        state_id: "",
        city_id: "",
        lat: "",
        long: "",
        // Contact
        mobile: "",
        email: "",
        company_website: "",
        // Socials
        fb_link: "",
        twitter_link: "",
        insta_link: "",
        linkedin_link: "",
        // Opening hours
        monday_open_time: "",
        monday_close_time: "",
        tuesday_open_time: "",
        tuesday_close_time: "",
        wednesday_open_time: "",
        wednesday_close_time: "",
        thursday_open_time: "",
        thursday_close_time: "",
        friday_open_time: "",
        friday_close_time: "",
        saturday_open_time: "",
        saturday_close_time: "",
        sunday_open_time: "",
        sunday_close_time: "",
        // UI helpers
        location_address: "",
        // Category/Tags
        category_id: "",
        tags: [], // [{id,name}]
    });

    const [existingImages, setExistingImages] = useState([]); // urls from API (preview only)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [galleryFiles, setGalleryFiles] = useState([]); // File[]
    const [galleryErr, setGalleryErr] = useState("");
    const [loading, setLoading] = useState({
        page: true,
        countries: false,
        states: false,
        cities: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitErr, setSubmitErr] = useState("");
    const [okMsg, setOkMsg] = useState("");

    const updateField = (name, value) => setForm((f) => ({ ...f, [name]: value }));
    const onInput = (e) => updateField(e.target.name, e.target.value);

    // bootstrap selects
    useEffect(() => {
        (async () => {
            const cats = await getCategories();
            setCategories(cats);
            const tags = await getTags();
            setTagOptions(tags);
        })();
    }, []);

    // countries
    useEffect(() => {
        (async () => {
            try {
                setLoading((s) => ({ ...s, countries: true }));
                const res = await getCountries();
                setCountries(Array.isArray(res?.data) ? res.data : res);
            } finally {
                setLoading((s) => ({ ...s, countries: false }));
            }
        })();
    }, []);

    async function onSelectCountry(idVal) {
        updateField("country_id", idVal);
        updateField("state_id", "");
        updateField("city_id", "");
        setStates([]);
        setCities([]);
        if (!idVal) return;
        try {
            setLoading((s) => ({ ...s, states: true }));
            const res = await getStatesByCountry(idVal);
            setStates(Array.isArray(res?.data) ? res.data : res);
        } finally {
            setLoading((s) => ({ ...s, states: false }));
        }
    }

    async function onSelectState(idVal) {
        updateField("state_id", idVal);
        updateField("city_id", "");
        setCities([]);
        if (!idVal) return;
        try {
            setLoading((s) => ({ ...s, cities: true }));
            const res = await getCities({ state_id: idVal });
            setCities(Array.isArray(res?.data) ? res.data : res);
        } finally {
            setLoading((s) => ({ ...s, cities: false }));
        }
    }
    async function onSelectCity(idVal) {
        updateField("city_id", idVal || "");
    }

    // Load existing listing
    useEffect(() => {
        (async () => {
            try {
                setLoading((s) => ({ ...s, page: true }));
                const r = await getListingV2(id);
                const item = r?.data || r; // support {data} or bare
                // categories -> pick first id (adjust if multi supported)
                const firstCatId = item?.categories?.[0]?.id
                    ? String(item.categories[0].id)
                    : "";

                // tags -> to TagPicker shape
                const tagVals = (item?.tags || []).map((t) => ({
                    id: t.id,
                    name: t.name,
                }));

                setForm((f) => ({
                    ...f,
                    listing_title: item?.listing_title || "",
                    slug: item?.slug || "",
                    description: item?.description || "",
                    address: item?.address || "",
                    zipcode: item?.zipcode || "",
                    country_id: item?.country_id ? String(item.country_id) : "",
                    state_id: item?.state_id ? String(item.state_id) : "",
                    city_id: item?.city_id ? String(item.city_id) : "",
                    location_name: item?.location_name || "",
                    location_address: item?.location_name || item?.address || "",
                    lat: item?.lat ? String(item.lat) : "",
                    long: item?.long ? String(item.long) : "",
                    mobile: item?.mobile || "",
                    email: item?.email || "",
                    company_website: item?.company_website || "",
                    fb_link: item?.fb_link || "",
                    twitter_link: item?.twitter_link || "",
                    insta_link: item?.insta_link || "",
                    linkedin_link: item?.linkedin_link || "",
                    monday_open_time: item?.monday_open_time || "",
                    monday_close_time: item?.monday_close_time || "",
                    tuesday_open_time: item?.tuesday_open_time || "",
                    tuesday_close_time: item?.tuesday_close_time || "",
                    wednesday_open_time: item?.wednesday_open_time || "",
                    wednesday_close_time: item?.wednesday_close_time || "",
                    thursday_open_time: item?.thursday_open_time || "",
                    thursday_close_time: item?.thursday_close_time || "",
                    friday_open_time: item?.friday_open_time || "",
                    friday_close_time: item?.friday_close_time || "",
                    saturday_open_time: item?.saturday_open_time || "",
                    saturday_close_time: item?.saturday_close_time || "",
                    sunday_open_time: item?.sunday_open_time || "",
                    sunday_close_time: item?.sunday_close_time || "",
                    category_id: firstCatId,
                    tags: tagVals,
                }));

                const isNull = (v) => v === null || v === undefined || v === "";
                setClosedDays({
                    monday: isNull(item?.monday_open_time) && isNull(item?.monday_close_time),
                    tuesday: isNull(item?.tuesday_open_time) && isNull(item?.tuesday_close_time),
                    wednesday: isNull(item?.wednesday_open_time) && isNull(item?.wednesday_close_time),
                    thursday: isNull(item?.thursday_open_time) && isNull(item?.thursday_close_time),
                    friday: isNull(item?.friday_open_time) && isNull(item?.friday_close_time),
                    saturday: isNull(item?.saturday_open_time) && isNull(item?.saturday_close_time),
                    sunday: isNull(item?.sunday_open_time) && isNull(item?.sunday_close_time),
                });

                // load dependent selects for state/city if present
                if (item?.country_id) await onSelectCountry(String(item.country_id));
                if (item?.state_id) await onSelectState(String(item.state_id));
                if (item?.city_id) await onSelectCity(String(item.city_id));

                setExistingImages(item?.images || []); // [{id,url,...}]
            } catch (e) {
                setSubmitErr(e?.message || "Failed to load listing");
            } finally {
                setLoading((s) => ({ ...s, page: false }));
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Gallery (max 5) – add new files
    const previews = useMemo(
        () => galleryFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
        [galleryFiles]
    );
    useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

    function onGalleryChange(e) {
        const picked = Array.from(e.target.files || []);
        if (!picked.length) return;
        const room = Math.max(0, 5 - galleryFiles.length);
        const next = [...galleryFiles, ...picked.slice(0, room)];
        setGalleryFiles(next);
        setGalleryErr(picked.length > room ? "You can upload up to 5 images total." : "");
        e.target.value = "";
    }
    const removeGalleryIndex = (i) =>
        setGalleryFiles((prev) => prev.filter((_, idx) => idx !== i));


    // Submit update
    async function onSubmit() {
        setSubmitErr("");
        setOkMsg("");
        if (!form.listing_title.trim()) return setSubmitErr("Listing title is required");
        try {
            setSubmitting(true);

            const tag_ids = (form.tags || [])
                .filter((t) => t.id)
                .map((t) => String(t.id));

            const tag_names = (form.tags || [])
                .filter((t) => !t.id && t.name)
                .map((t) => t.name.trim())
                .filter(Boolean);

            const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

            const timePatch = dayKeys.reduce((acc, d) => {
                if (closedDays[d]) {
                    // explicitly null when marked closed
                    acc[`${d}_open_time`] = null;
                    acc[`${d}_close_time`] = null;
                } else {
                    // normal values (undefined omits the key)
                    acc[`${d}_open_time`] = form[`${d}_open_time`] || undefined;
                    acc[`${d}_close_time`] = form[`${d}_close_time`] || undefined;
                }
                return acc;
            }, {});


            const payload = {
                id: String(id), 
                ...timePatch,
                listing_title: form.listing_title,
                slug: form.slug || undefined,
                description: form.description || undefined,
                // Location
                address: form.address || undefined,
                zipcode: form.zipcode || undefined,
                country_id: form.country_id || undefined,
                state_id: form.state_id || undefined,
                city_id: form.city_id || undefined,
                lat: form.lat || undefined,
                long: form.long || undefined,
                location_name: form.location_name || form.location_address || undefined,
                // Contact
                mobile: form.mobile || undefined,
                email: form.email || undefined,
                company_website: form.company_website || undefined,
                // Socials
                fb_link: form.fb_link || undefined,
                twitter_link: form.twitter_link || undefined,
                insta_link: form.insta_link || undefined,
                linkedin_link: form.linkedin_link || undefined,
                // Opening hours
                
                // Arrays
                category_ids: form.category_id ? [String(form.category_id)] : [],
                tag_ids,
                tag_names,
                // Files (optional add/replace depending on backend)
                images: galleryFiles,
            };

            await updateListingV2(payload);
            setOkMsg("Listing updated successfully!");
            setTimeout(() => router.push("/dashboard/my-listings"), 800);
        } catch (err) {
            setSubmitErr(err?.message || "Failed to update listing");
        } finally {
            setSubmitting(false);
        }
    }

    // simple closed toggle (optional)
    const [closedDays, setClosedDays] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });

    const toggleClosed = (day) => (e) => {
        const v = e.target.checked;
        setClosedDays((s) => ({ ...s, [day]: v }));
        if (v) {
            updateField(`${day}_open_time`, "");
            updateField(`${day}_close_time`, "");
        }
    };

    if (loading.page) return <div>Loading…</div>;

    return (
        <>
            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Edit Listing</h6>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">Listing Title</label>
                            <input
                                type="text"
                                name="listing_title"
                                className="form-control"
                                value={form.listing_title}
                                onChange={onInput}
                                required
                            />
                        </div>
                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">Category</label>
                            <select
                                className="form-select"
                                value={form.category_id}
                                onChange={(e) => updateField("category_id", e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-sm-12">
                            <label className="required fw-medium mb-2">Tags</label>
                            <TagPicker
                                options={tagOptions}
                                value={form.tags}
                                onChange={(vals) => updateField("tags", vals)}
                            />
                            <small className="text-muted">
                                Press Enter to add a custom tag, or pick from suggestions.
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Location</h6>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">Country</label>
                            <select
                                className="form-select"
                                value={form.country_id}
                                onChange={(e) => onSelectCountry(e.target.value)}
                            >
                                <option value="">
                                    {loading.countries ? "Loading countries…" : "Select Country"}
                                </option>
                                {countries.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">State</label>
                            <select
                                className="form-select"
                                value={form.state_id}
                                onChange={(e) => onSelectState(e.target.value)}
                                disabled={!form.country_id}
                            >
                                <option value="">
                                    {!form.country_id
                                        ? "Select country first"
                                        : loading.states
                                            ? "Loading states…"
                                            : "Select State"}
                                </option>
                                {states.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">City</label>
                            <select
                                className="form-select"
                                value={form.city_id}
                                onChange={(e) => onSelectCity(e.target.value)}
                                disabled={!form.state_id}
                            >
                                <option value="">
                                    {!form.state_id
                                        ? "Select state first"
                                        : loading.cities
                                            ? "Loading cities…"
                                            : "Select City"}
                                </option>
                                {cities.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                placeholder="8706 Herrick Ave, Valley..."
                                value={form.address}
                                onChange={onInput}
                                required
                            />
                        </div>

                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">Zip-Code</label>
                            <input
                                type="text"
                                name="zipcode"
                                className="form-control"
                                placeholder="700001"
                                value={form.zipcode}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-6">
                            <label className="required fw-medium mb-2">Select Location</label>
                            <PlacesAutocomplete
                                value={form.location_name || form.location_address}
                                onSelect={({ address, lat, lng, name, place_name }) => {
                                    const prettyName = name || place_name || address;
                                    setForm(f => ({
                                        ...f,
                                        location_name: prettyName,
                                        location_address: address,
                                        lat: String(lat),
                                        long: String(lng),
                                    }));
                                }}
                            />
                            <small className="text-muted d-block mt-1">
                                Lat: {form.lat || "—"} | Lng: {form.long || "—"}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing images (preview-only) + add new images */}
            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Gallery</h6>
                </div>
                <div className="card-body">
                    {existingImages?.length ? (
                        <>
                            <div className="mb-2 fw-medium">Existing</div>
                            <div className="row g-3 mb-3">
                                {existingImages.map((im) => (
                                    <div className="col-6 col-md-3" key={im.id}>
                                        <div className="position-relative border rounded overflow-hidden">
                                            {im.url ? (
                                                <img
                                                    src={im.url}
                                                    alt="listing"
                                                    className="img-fluid d-block w-100"
                                                />
                                            ) : (
                                                <Image
                                                    src={fallbackImg}
                                                    alt=""
                                                    className="img-fluid d-block w-100"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr />
                        </>
                    ) : null}

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="required fw-medium mb-2 mb-0">Add Images</label>
                        <small className="text-muted">{galleryFiles.length}/5</small>
                    </div>

                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        multiple
                        onChange={onGalleryChange}
                        className="form-control galleryimage"
                    />
                    <div className="form-text">
                        Max 5 images. Recommended 350×350 px (png, jpg, jpeg).
                    </div>
                    {galleryErr ? <div className="text-danger mt-2">{galleryErr}</div> : null}

                    {previews.length > 0 && (
                        <div className="row g-3 mt-2">
                            {previews.map((p, i) => (
                                <div className="col-6 col-md-3" key={i}>
                                    <div className="position-relative border rounded overflow-hidden">
                                        <img
                                            src={p.url}
                                            alt={`upload-${i}`}
                                            className="img-fluid d-block w-100"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                            onClick={() => removeGalleryIndex(i)}
                                            aria-label="Remove image"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Details</h6>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-sm-12">
                            <label className="required fw-medium mb-2">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="7"
                                placeholder="Please enter up to 4000 characters."
                                value={form.description}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-4">
                            <label className="required fw-medium mb-2">Phone</label>
                            <input
                                type="text"
                                name="mobile"
                                className="form-control"
                                placeholder="(123) 456 - 789"
                                value={form.mobile}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-4">
                            <label className="required fw-medium mb-2">Company website</label>
                            <input
                                type="text"
                                name="company_website"
                                className="form-control"
                                placeholder="https://company.com"
                                value={form.company_website}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-4">
                            <label className="required fw-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="example@email.com"
                                value={form.email}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-12">
                            <hr />
                        </div>

                        <div className="col-sm-6">
                            <label className="fw-medium mb-2">
                                Facebook Page
                                <span className="fs-13 ms-1 text-muted">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="fb_link"
                                className="form-control"
                                placeholder="https://facebook.com/"
                                value={form.fb_link}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-6">
                            <label className="fw-medium mb-2">
                                Twitter profile
                                <span className="fs-13 ms-1 text-muted">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="twitter_link"
                                className="form-control"
                                placeholder="https://twitter.com/"
                                value={form.twitter_link}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-6">
                            <label className="fw-medium mb-2">
                                Instagram profile
                                <span className="fs-13 ms-1 text-muted">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="insta_link"
                                className="form-control"
                                placeholder="https://instagram.com/"
                                value={form.insta_link}
                                onChange={onInput}
                            />
                        </div>

                        <div className="col-sm-6">
                            <label className="fw-medium mb-2">
                                Linkedin page
                                <span className="fs-13 ms-1 text-muted">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="linkedin_link"
                                className="form-control"
                                placeholder="https://linkedin.com/"
                                value={form.linkedin_link}
                                onChange={onInput}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Opening Hours</h6>
                </div>
                <div className="card-body">
                    <div className="accordion listing-accordion" id="accordionExample">
                        <div className="accordion-item bg-transparent mb-3 rounded-4">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button bg-transparent bg-white collapsed text-dark shadow-none"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="23"
                                        height="23"
                                        fill="currentColor"
                                        className="bi bi-alarm text-primary me-3"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z" />
                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z" />
                                    </svg>
                                    <span className="fs-18 fw-medium">Add opening hours</span>
                                    <span className="count fs-13 ms-1 text-muted">(optional)</span>
                                </button>
                            </h2>
                            <div
                                id="collapseOne"
                                className="accordion-collapse collapse show"
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body p-4">
                                    <div className="card-body">
                                        {[
                                            ["Monday", "monday"],
                                            ["Tuesday", "tuesday"],
                                            ["Wednesday", "wednesday"],
                                            ["Thursday", "thursday"],
                                            ["Friday", "friday"],
                                            ["Saturday", "saturday"],
                                            ["Sunday", "sunday"],
                                        ].map(([label, key]) => {
                                            const isClosed = closedDays[key];
                                            return (
                                                <div className="mb-3 row align-items-center" key={key}>
                                                    <label className="col-sm-2 col-form-label fw-medium">
                                                        {label}
                                                    </label>

                                                    <div className="col-sm-4">
                                                        <input
                                                            type="time"
                                                            className="form-control"
                                                            name={`${key}_open_time`}
                                                            value={form[`${key}_open_time`]}
                                                            onChange={onInput}
                                                            placeholder="Open"
                                                            disabled={isClosed}
                                                        />
                                                    </div>

                                                    <div className="col-sm-4">
                                                        <input
                                                            type="time"
                                                            className="form-control"
                                                            name={`${key}_close_time`}
                                                            value={form[`${key}_close_time`]}
                                                            onChange={onInput}
                                                            placeholder="Close"
                                                            disabled={isClosed}
                                                        />
                                                    </div>

                                                    <div className="col-sm-2">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`${key}-closed`}
                                                                checked={isClosed}
                                                                onChange={toggleClosed(key)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`${key}-closed`}
                                                            >
                                                                Closed
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="card mb-4">
                <div className="card-body">
                    {submitErr ? (
                        <pre
                            className="alert alert-danger mb-0"
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {submitErr}
                        </pre>
                    ) : null}
                    {okMsg ? <div className="alert alert-success">{okMsg}</div> : null}
                    <button
                        className="btn btn-primary"
                        onClick={onSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Updating…" : "Update Listing"}
                    </button>
                </div>
            </div>
        </>
    );
}
