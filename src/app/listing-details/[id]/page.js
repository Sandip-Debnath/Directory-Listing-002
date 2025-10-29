// src\app\listing-details\[id]\page.js
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getListingV2, getListingReviews, createListingReview, createEnquiry, storeBookmark  } from '@/utils/api/handlers';
import fallbackImg from '@/../public/assets/dashboard/assets/dist/img/05.jpg';
import userImg from '@/../public/assets/images/user.jpg';

import galleryImage01 from '@/../public/assets/images/listing-details/gallery/blank-image.jpg';
import { useAppSelector } from '@/store';

// add this near the top (inside the file, outside the component)
function StarRatingInput({ value, onChange, max = 5 }) {
    const [hover, setHover] = useState(0);

    const commit = (n) => onChange?.(n);

    const handleKey = (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault(); commit(Math.min(max, value + 1));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault(); commit(Math.max(1, value - 1));
        } else if (/^[1-5]$/.test(e.key)) {
            commit(Number(e.key));
        }
    };

    return (
        <div
            className="d-flex align-items-center gap-2"
            role="radiogroup"
            aria-label="Rating"
            onKeyDown={handleKey}
        >
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
                const active = (hover || value) >= n;
                return (
                    <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={value === n}
                        title={`${n} star${n > 1 ? "s" : ""}`}
                        className="bg-transparent border-0 p-0"
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        onFocus={() => setHover(n)}
                        onBlur={() => setHover(0)}
                        onClick={() => commit(n)}
                        style={{ cursor: "pointer", lineHeight: 1 }}
                    >
                        {/* uses your existing star styles: full vs. none */}
                        <i className={`fa-star-icon ${active ? "" : "none"}`} />
                    </button>
                );
            })}
            <span className="ms-2 fw-medium">{value}/5</span>
        </div>
    );
}



export default function ListingDetails() {

    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const { token, user } = useAppSelector((s) => s.auth);

    const isLoggedIn = Boolean(token);
    const [reviews, setReviews] = useState([]);
    const [revPage, setRevPage] = useState(1);
    const [revPerPage] = useState(10);
    const [reviewsMeta, setReviewsMeta] = useState(null);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [posting, setPosting] = useState(false);

    const totalReviews = reviewsMeta?.total ?? reviews.length;

    const [enqName, setEnqName] = useState("");
    const [enqEmail, setEnqEmail] = useState("");
    const [enqPhone, setEnqPhone] = useState(""); // <-- phone/mobile
    const [enqMessage, setEnqMessage] = useState("");
    const [sendingEnquiry, setSendingEnquiry] = useState(false);

    // form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [bookmarking, setBookmarking] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(item?.is_bookmarked ?? false);
    const [bookmarkCount, setBookmarkCount] = useState(item?.total_bookmarks ?? 0);

    useEffect(() => {
        // try Redux first
        const fromStore = {
            name: user?.name || "",
            email: user?.email || "",
            mobile: user?.mobile || "",
        };

        // fall back to localStorage if any missing
        try {
            const lsUser = JSON.parse(localStorage.getItem("auth_user") || "null");
            if (lsUser && typeof lsUser === "object") {
                fromStore.name = fromStore.name || lsUser.name || "";
                fromStore.email = fromStore.email || lsUser.email || "";
                fromStore.mobile = fromStore.mobile || lsUser.mobile || "";
            }
        } catch { }

        setEnqName((v) => v || fromStore.name);
        setEnqEmail((v) => v || fromStore.email);
        setEnqPhone((v) => v || fromStore.mobile);
    }, [user, token]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const r = await getListingV2(id);
                setItem(r?.data || r);
            } catch (e) {
                setErr(e?.message || 'Failed to load listing');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            try {
                setLoadingReviews(true);

                const res = await getListingReviews(id, { page: revPage, perPage: revPerPage });

                // Supports both shapes:
                // 1) { success: true, data: { data:[...], current_page, last_page, ... } }
                // 2) { data:[...], current_page, last_page, ... }  (plain paginator)
                const pag = res?.data ?? res;

                const items = Array.isArray(pag) ? pag : (pag?.data ?? []);
                setReviews((prev) => (revPage === 1 ? items : [...prev, ...items]));
                setReviewsMeta(pag || null); // <- store the paginator (has current_page/last_page)
            } finally {
                setLoadingReviews(false);
            }
        })();
    }, [id, revPage, revPerPage]);

    useEffect(() => {
        if (item) {
            setIsBookmarked(item?.is_bookmarked ?? false);
            setBookmarkCount(item?.total_bookmarks ?? 0);
        }
    }, [item]);

    const toggleBookmark = async () => {
        if (!isLoggedIn) {
            alert("You must be logged in to bookmark listings.");
            return;
        }

        try {
            setBookmarking(true);
            const res = await storeBookmark(item?.id || Number(id));
            if (res?.success) {
                // Toggle logic — backend handles add/remove
                setIsBookmarked(!isBookmarked);
                setBookmarkCount((c) => (isBookmarked ? c - 1 : c + 1));
            }
        } catch (err) {
            alert(err?.message || "Failed to update bookmark.");
        } finally {
            setBookmarking(false);
        }
    };


    if (loading) return <div className="container py-5">Loading…</div>;
    if (err) return <div className="container py-5 alert alert-danger">{err}</div>;

    const Star = ({ filled }) => <i className={`fa-star-icon ${filled === 0.5 ? "half" : filled ? "" : "none"}`}></i>;

    const renderStars = (val = 0) => {
        const out = [];
        for (let i = 1; i <= 5; i++) {
            const diff = val - i;
            out.push(<Star key={i} filled={diff >= 0 ? 1 : diff >= -0.5 ? 0.5 : 0} />);
        }
        return <div className="d-flex align-items-center text-primary rating-stars">{out}</div>;
    };

    const ratings = reviews.map((r) => Number(r.rating || 0)).filter(Boolean);
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    const counts = [1, 2, 3, 4, 5].reduce((acc, n) => ({ ...acc, [n]: ratings.filter(v => v === n).length }), {});
    const pct = (n) => ratings.length ? Math.round((n / ratings.length) * 100) : 0;


    const images = item?.images?.length ? item.images : [];
    const hero = images[0]?.url || galleryImage01.src;
    const thumbs = images.slice(1, 3);

    return (
        <>
            <div className="py-4">
                <div className="container">
                    <div className="justify-content-between row align-items-center g-4">
                        <div className="col-lg col-xxl-8">
                            <h1 className="h2 page-header-title fw-semibold">{item?.listing_title || '—'}</h1>
                            <ul className="list-inline list-separator d-flex align-items-center mb-2">
                                <li className="list-inline-item">
                                    <a className="fw-medium" href="#">{item?.categories?.[0]?.name || '—'}<i className="fa-solid fa-arrow-up-right-from-square fs-14 ms-2"></i></a>
                                </li>
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center gap-2 ms-auto">
                                        {/* stars based on average */}
                                        {renderStars(avg)}

                                        {/* (4.5) 2,391 reviews -> dynamic */}
                                        <span className="fw-medium text-primary">
                                            <span className="fs-6 fw-semibold me-1">
                                                ({avg > 0 ? avg.toFixed(1) : "—"})
                                            </span>
                                            <small>
                                                {totalReviews ?? 0} {totalReviews === 1 ? "review" : "reviews"}
                                            </small>
                                        </span>
                                    </div>
                                </li>

                            </ul>
                            <ul className="fs-14 fw-medium list-inline list-separator mb-0 text-muted">
                                <li className="list-inline-item">Published {new Date(item?.created_at).toLocaleDateString()}</li>
                                <li className="list-inline-item">{item?.location_name || item?.address || '—'}</li>

                            </ul>
                        </div>
                        <div className="col-lg-auto">

                            <div className="form-check form-check-bookmark mb-2 mb-sm-0">
                                <button
                                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2"
                                    onClick={toggleBookmark}
                                    disabled={bookmarking}
                                >
                                    <i className={`fa-${isBookmarked ? "solid" : "regular"} fa-heart text-${isBookmarked ? "danger" : "muted"}`}></i>
                                    <span className="fw-medium">
                                        {isBookmarked ? "Saved" : "Save this listing"}
                                    </span>
                                </button>
                            </div>

                            <div className="small mt-1">
                                {bookmarkCount} {bookmarkCount === 1 ? "Person" : "People"} Bookmarked
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="rounded-4 overflow-hidden">
                    <div className="row gx-2 zoom-gallery">
                        {images?.length > 1 ? (
                            <>
                                {/* Hero */}
                                <div className="col-md-8">
                                    <a className="d-block position-relative" href={hero} title="figcaption" data-source={hero}>
                                        <img className="img-fluid w-100" src={hero} alt="Listing" />
                                        <div className="position-absolute bottom-0 end-0 mb-3 me-3">
                                            <span className="align-items-center btn btn-light btn-sm d-flex d-md-none fw-semibold gap-2">
                                                <i className="fa-solid fa-expand"></i>
                                                <span>View photos</span>
                                            </span>
                                        </div>
                                    </a>
                                </div>

                                {/* Thumbnails */}
                                <div className="col-md-4 d-none d-md-inline-block">
                                    {images.slice(1, 3).map((im, i) => (
                                        <a key={i} className={`d-block ${i === 0 ? "mb-2" : "position-relative"}`} href={im.url} title="figcaption" data-source={im.url}>
                                            <img className="img-fluid w-100" src={im.url} alt={`Listing ${i + 2}`} />

                                        </a>
                                    ))}
                                </div>
                            </>
                        ) : (
                            // ✅ Single image → full-width center
                            <div className="col-12 text-center">
                                <a className="d-inline-block position-relative w-100" href={hero || fallbackImg.src} title="figcaption" data-source={hero || fallbackImg.src}>
                                    <img
                                        className="img-fluid w-100 rounded-4"
                                        src={hero || fallbackImg.src}
                                        alt="Listing"
                                        style={{ objectFit: "cover", maxHeight: "450px" }}
                                    />
                                    {/* <div className="position-absolute bottom-0 end-0 mb-3 me-3">
                                        <span className="align-items-center btn btn-light btn-sm d-inline-flex fw-semibold gap-2">
                                            <i className="fa-solid fa-expand"></i>
                                            <span>View photo</span>
                                        </span>
                                    </div> */}
                                </a>
                            </div>
                        )}
                    </div>


                </div>
                {/* <div className="d-flex justify-content-end mt-2">
                    <span className="small text-dark fw-semibold">Published:</span>
                    <span className="small ms-1 text-muted">November 21, 2025</span>
                </div> */}
            </div>

            <div className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 content">

                            {/* Description */}
                            <div className="mb-4">
                                <h4 className="fw-semibold fs-3 mb-4">
                                    Listing <span className="font-caveat text-primary">Description</span>
                                </h4>

                                {item?.description ? (
                                    item.description
                                        .split(/\n+/)
                                        .map((p, i) => <p key={i}>{p}</p>)
                                ) : (
                                    <p className="text-muted mb-0">No description provided.</p>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="mb-4">
                                <h4 className="fw-semibold fs-3 mb-4">
                                    Listing <span className="font-caveat text-primary">Tags</span>
                                </h4>

                                <div className="row g-4">
                                    {item?.tags?.length ? (
                                        item.tags.map((t) => (
                                            <div key={t.id || t.name} className="col-auto col-lg-2">
                                                <div className="d-flex align-items-center text-dark">
                                                    <div className="flex-shrink-0">
                                                        <i className="fa-solid fa-tag fs-18"></i>
                                                    </div>
                                                    <div className="flex-grow-1 fs-16 fw-medium ms-3">
                                                        {t.name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12">
                                            <div className="text-muted">No tags available.</div>
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* <hr className="my-5" /> */}

                            {/* Social links + Opening hours (replaces the Pricing block) */}
                            <div className="mb-4">
                                {/* Social */}
                                <h4 className="fw-semibold fs-3 mb-4">
                                    Connect on <span className="font-caveat text-primary">Social</span>
                                </h4>

                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {item?.fb_link && (
                                        <a href={item.fb_link} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm rounded-pill d-inline-flex align-items-center gap-2">
                                            <i className="fa-brands fa-facebook-f"></i>
                                        </a>
                                    )}
                                    {item?.twitter_link && (
                                        <a href={item.twitter_link} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm rounded-pill d-inline-flex align-items-center gap-2">
                                            <i className="fa-brands fa-x-twitter"></i>
                                        </a>
                                    )}
                                    {item?.insta_link && (
                                        <a href={item.insta_link} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm rounded-pill d-inline-flex align-items-center gap-2">
                                            <i className="fa-brands fa-instagram"></i>
                                        </a>
                                    )}
                                    {item?.linkedin_link && (
                                        <a href={item.linkedin_link} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm rounded-pill d-inline-flex align-items-center gap-2">
                                            <i className="fa-brands fa-linkedin-in"></i>
                                        </a>
                                    )}
                                    {!item?.fb_link && !item?.twitter_link && !item?.insta_link && !item?.linkedin_link && (
                                        <span className="text-muted">No social links provided.</span>
                                    )}
                                </div>

                                {/* Opening Hours */}

                            </div>


                            <hr className="my-5" />

                            {/* Reviews (dynamic) */}
                            <div className="mb-4">
                                <h4 className="fw-semibold fs-3 mb-4">Latest Property <span className="font-caveat text-primary">Reviews</span></h4>

                                {/* Summary card (same look & feel) */}
                                <div className="border p-4 mb-5 rounded-4">
                                    <div className="row g-4 align-items-center">
                                        <div className="col-sm-auto">
                                            <div className="rating-block text-center">
                                                <h5 className="font-caveat fs-4 mb-4">Average user rating</h5>
                                                <div className="rating-point position-relative ml-auto mr-auto">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star text-primary">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                    <h3 className="position-absolute mb-0 fs-18 text-primary">{avg.toFixed(1)}</h3>
                                                </div>
                                                <span className="fs-13">{ratings.length} Ratings &amp;</span><br />
                                                <span className="fs-13">{reviews.length} Reviews</span>
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="rating-position">
                                                <h5 className="font-caveat fs-4 mb-4">Rating breakdown</h5>

                                                {[5, 4, 3, 2, 1].map((v, idx) => (
                                                    <div key={v} className="align-items-center d-flex mb-2 rating-dimension gap-2">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="fs-14 fw-semibold rating-points">{v}</span>
                                                            {renderStars(v)}
                                                        </div>
                                                        <div className="progress flex-grow-1 me-2">
                                                            <div className={`progress-bar ${v >= 4 ? 'bg-primary' : v === 3 ? 'bg-warning' : v === 2 ? 'bg-info' : 'text-bg-danger'}`}
                                                                role="progressbar"
                                                                style={{ width: `${pct(counts[v])}%` }}
                                                                aria-valuenow={pct(counts[v])} aria-valuemin={0} aria-valuemax={100} />
                                                        </div>
                                                        <div className="bg-dark fs-11 fw-medium px-2 py-1 rounded-pill text-white user-rating">
                                                            {counts[v]}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews list */}
                                {loadingReviews ? (
                                    <div>Loading reviews…</div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-muted">No reviews yet.</div>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="d-flex mb-4 border-bottom pb-4">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={userImg} // replace with user avatar if available: rev.user?.avatar_url
                                                    alt="..."
                                                    height={70} width={70}
                                                    className="object-fit-cover rounded-circle"
                                                />
                                            </div>
                                            <div className="flex-grow-1 ms-4">
                                                <div className="comment-header d-flex flex-wrap gap-2 mb-3">
                                                    <div>
                                                        <h4 className="fs-18 mb-0">- {rev.user?.name || 'Anonymous'}</h4>
                                                        <div className="comment-datetime fs-12 text-muted">
                                                            {new Date(rev.created_at || Date.now()).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 ms-auto">
                                                        {renderStars(Number(rev.rating))}
                                                        <span className="fs-14 fw-semibold rating-points">{Number(rev.rating).toFixed(1)}/5</span>
                                                    </div>
                                                </div>
                                                <div className="fs-15">{rev.comment || ''}</div>

                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* Load more */}
                                {reviewsMeta && reviewsMeta.current_page < reviewsMeta.last_page && (
                                    <div className="text-center mt-3">
                                        <button
                                            className="btn btn-light rounded-pill px-4"
                                            onClick={() => setRevPage((p) => p + 1)}
                                            disabled={loadingReviews}
                                        >
                                            {loadingReviews ? "Loading…" : "Load more"}
                                        </button>
                                    </div>
                                )}

                            </div>


                            <div className="mb-4 mb-lg-0">
                                <h4 className="fw-semibold fs-3 mb-4">Leave a <span className="font-caveat text-primary">Comment</span></h4>

                                {isLoggedIn ? (
                                    <form
                                        className="row g-4"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            try {
                                                setPosting(true);
                                                const payload = { listing_id: Number(id), rating: Number(rating), comment };
                                                const created = await createListingReview(payload, token);
                                                // optimistic update
                                                setReviews((prev) => [created?.data || created, ...prev]);
                                                setComment("");
                                                setRating(5);
                                            } catch (err) {
                                                alert(err.message || "Failed to submit review");
                                            } finally {
                                                setPosting(false);
                                            }
                                        }}
                                    >
                                        <div className="col-sm-6">
                                            <label className="required fw-medium mb-2">Rating</label>
                                            <StarRatingInput value={rating} onChange={(n) => setRating(n)} />
                                        </div>
                                        <div className="col-sm-12">
                                            <label className="required fw-medium mb-2">Comment</label>
                                            <textarea className="form-control" rows="7" placeholder="Tell us what you think…" value={comment} onChange={(e) => setComment(e.target.value)} />
                                        </div>
                                        <div className="col-sm-12 text-end">
                                            <button type="submit" className="btn btn-primary" disabled={posting}>
                                                {posting ? "Submitting…" : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="alert alert-warning d-flex align-items-center justify-content-between">
                                        <span>You must be logged in to post a review.</span>
                                        <Link href="/login" className="btn btn-primary btn-sm rounded-pill">Login</Link>
                                    </div>
                                )}
                            </div>


                        </div>


                        <div className="col-lg-4 ps-xxl-5 sidebar">
                            <div className="border mb-4 p-4 rounded-4">
                                <h4 className="fw-semibold mb-4">Enquire Now</h4>

                                {!isLoggedIn ? (
                                    <div className="alert alert-warning d-flex align-items-center justify-content-between">
                                        <span>You must be logged in to send an enquiry.</span>
                                        <Link href="/login" className="btn btn-primary btn-sm rounded-pill">Login</Link>
                                    </div>
                                ) : (
                                    <form
                                        className="row g-4"
                                        onSubmit={async (e) => {
                                            e.preventDefault();

                                            if (!enqName.trim() || !enqEmail.trim() || !enqPhone.trim() || !enqMessage.trim()) {
                                                alert("Please fill full name, phone, email and message.");
                                                return;
                                            }
                                            if (enqMessage.length > 4000) {
                                                alert("Message must be 4000 characters or less.");
                                                return;
                                            }

                                            try {
                                                setSendingEnquiry(true);
                                                const payload = {
                                                    listing_id: Number(id),
                                                    name: enqName.trim(),
                                                    email: enqEmail.trim(),
                                                    mobile: enqPhone.trim(),     // <-- backend requires `mobile`
                                                    message: enqMessage.trim(),
                                                    channel: "web",
                                                };
                                                await createEnquiry(payload);

                                                // reset + UX
                                                setEnqMessage("");
                                                alert("Enquiry sent successfully!");
                                            } catch (err) {
                                                alert(err?.message || "Failed to send enquiry");
                                            } finally {
                                                setSendingEnquiry(false);
                                            }
                                        }}
                                    >
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="required fw-medium mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter your name"
                                                    value={enqName}
                                                    onChange={(e) => setEnqName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="required fw-medium mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    placeholder="Enter your phone"
                                                    value={enqPhone}
                                                    onChange={(e) => setEnqPhone(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="required fw-medium mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email"
                                                    value={enqEmail}
                                                    onChange={(e) => setEnqEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label className="required fw-medium mb-2">Message</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="7"
                                                    placeholder="Tell us what we can help you with!"
                                                    value={enqMessage}
                                                    onChange={(e) => setEnqMessage(e.target.value)}
                                                    maxLength={4000}
                                                    required
                                                />
                                                <div className="small text-muted mt-1">{enqMessage.length}/4000</div>
                                            </div>
                                        </div>

                                        <div className="col-sm-12">
                                            <button type="submit" className="btn btn-primary w-100" disabled={sendingEnquiry}>
                                                {sendingEnquiry ? "Sending…" : "Enquire Now"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>



                            {/* <div className="border p-4 rounded-4">
                                <div className="align-items-center d-flex justify-content-between mb-4">
                                    <h4 className="w-semibold mb-0">Opening <span className="font-caveat text-primary">Hours</span></h4>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path>
                                    </svg>
                                </div>
                                <div className="align-items-center d-flex justify-content-between mb-3">
                                    <span className="fw-semibold">Monday</span>
                                    <span className="fs-14">8:00 am - 6:00 pm</span>
                                </div>
                                <div className="align-items-center d-flex justify-content-between mb-3">
                                    <span className="fw-semibold">Tuesday</span>
                                    <span className="fs-14">8:00 am - 6:00 pm</span>
                                </div>
                                <div className="align-items-center d-flex justify-content-between mb-3">
                                    <span className="fw-semibold">Wednesday</span>
                                    <span className="fs-14">8:00 am - 6:00 pm</span>
                                </div>
                                <div className="align-items-center d-flex justify-content-between mb-3">
                                    <span className="fw-semibold">Thursday</span>
                                    <span className="fs-14">8:00 am - 6:00 pm</span>
                                </div>
                                <div className="align-items-center d-flex justify-content-between mb-3">
                                    <span className="fw-semibold">Friday</span>
                                    <span className="fs-14">8:00 am - 6:00 pm</span>
                                </div>
                                <div className="align-items-center d-flex justify-content-between mb-3">
                                    <span className="fw-semibold">Saturday</span>
                                    <span className="fs-14">8:00 am - 6:00 pm</span>
                                </div>
                                <div className="align-items-center d-flex justify-content-between mb-3">
                                    <span className="fw-semibold">Sunday</span>
                                    <span className="fw-medium text-danger">Close</span>
                                </div>
                            </div> */}

                            <div className="border p-4 rounded-4">
                                <div className="align-items-center d-flex justify-content-between mb-4">
                                    <h4 className="w-semibold mb-0">
                                        Opening <span className="font-caveat text-primary">Hours</span>
                                    </h4>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path>
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path>
                                    </svg>
                                </div>

                                {(() => {
                                    const fmt = (t) => {
                                        if (!t) return null;
                                        const [H, M] = t.split(':').map(Number);
                                        const h12 = ((H + 11) % 12) + 1;
                                        const ampm = H < 12 ? 'am' : 'pm';
                                        return `${h12}:${String(M ?? 0).padStart(2, '0')} ${ampm}`;
                                    };

                                    const rows = [
                                        { label: 'Monday', open: item?.monday_open_time, close: item?.monday_close_time },
                                        { label: 'Tuesday', open: item?.tuesday_open_time, close: item?.tuesday_close_time },
                                        { label: 'Wednesday', open: item?.wednesday_open_time, close: item?.wednesday_close_time },
                                        { label: 'Thursday', open: item?.thursday_open_time, close: item?.thursday_close_time },
                                        { label: 'Friday', open: item?.friday_open_time, close: item?.friday_close_time },
                                        { label: 'Saturday', open: item?.saturday_open_time, close: item?.saturday_close_time },
                                        { label: 'Sunday', open: item?.sunday_open_time, close: item?.sunday_close_time },
                                    ];

                                    // single row component
                                    const Row = ({ r }) => {
                                        const openStr = fmt(r.open);
                                        const closeStr = fmt(r.close);
                                        const isClosed = !r.open || !r.close;

                                        return (
                                            <div className="align-items-center d-flex justify-content-between mb-3">
                                                <span className="fw-semibold">{r.label}</span>
                                                {isClosed ? (
                                                    <span className="fw-medium text-danger">Close</span>
                                                ) : (
                                                    <span className="fs-14">{openStr} - {closeStr}</span>
                                                )}
                                            </div>
                                        );
                                    };

                                    return (
                                        <>
                                            {rows.map((r) => <Row key={r.label} r={r} />)}
                                        </>
                                    );
                                })()}
                            </div>

                        </div>

                    </div>
                </div>
            </div>




        </>
    );
}