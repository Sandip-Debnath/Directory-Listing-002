// src/app/dashboard/reviews/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import miniLogo from "@/../public/assets/dashboard/assets/dist/img/mini-logo.png";
import { getMyListingReviews } from "@/utils/api/handlers";

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// tiny star row using your .fa-star-icon classes
function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const nodes = [];
  for (let i = 0; i < full; i++) nodes.push(<i key={`f${i}`} className="fa-star-icon" />);
  for (let i = 0; i < half; i++) nodes.push(<i key={`h${i}`} className="fa-star-icon half" />);
  for (let i = 0; i < empty; i++) nodes.push(<i key={`n${i}`} className="fa-star-icon none" />);
  return <div className="d-flex align-items-center text-primary rating-stars">{nodes}</div>;
}

export default function Review() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await getMyListingReviews(page, perPage);
        if (!alive) return;
        setPayload(res?.data || null);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load reviews.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page, perPage]);

  const reviews = payload?.data ?? [];
  const total = payload?.total ?? 0;
  const lastPage = payload?.last_page ?? 1;

  // Compute metrics
  const { avg, counts } = useMemo(() => {
    if (!reviews.length) return { avg: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    const c = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of reviews) {
      const rate = Number(r?.rating) || 0;
      if (rate >= 1 && rate <= 5) c[rate] += 1;
      sum += rate;
    }
    const average = sum / reviews.length;
    return { avg: Number(average.toFixed(1)), counts: c };
  }, [reviews]);

  const breakdownRow = (label, stars, keyColor, val, totalCount) => {
    const pct = totalCount ? Math.round((val / totalCount) * 100) : 0;
    const displayVal = (stars * (val ? 1 : 0)).toFixed(1).replace(".0", ""); // cosmetic pill text
    return (
      <div className="align-items-center d-flex mb-2 rating-dimension gap-2" key={stars}>
        <div className="d-flex align-items-center gap-2">
          <span className="fs-14 fw-semibold rating-points">{label}</span>
          {/* show the stars pattern */}
          <Stars rating={stars} />
        </div>
        <div className="progress flex-grow-1 me-2">
          <div
            className={`progress-bar ${keyColor}`}
            role="progressbar"
            style={{ width: `${pct}%` }}
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="bg-dark fs-11 fw-medium px-2 py-1 rounded-pill text-white user-rating">
          {val || 0}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="card">
        <div className="card-header position-relative">
          <h6 className="fs-17 fw-semi-bold my-1">Visitor Reviews</h6>
        </div>

        <div className="card-body">
          {/* Top summary */}
          <div className="mb-4">
            <div className="border p-4 mb-5 rounded-4">
              <div className="row g-4 align-items-center">
                <div className="col-sm-auto">
                  <div className="text-center">
                    <h6 className="mb-4">Average user rating</h6>
                    <div className="rating-point position-relative ml-auto mr-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="120"
                        height="120"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth=".5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-star text-primary"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <h3 className="position-absolute mb-0 fs-18 text-primary">
                        {loading ? "…" : avg.toFixed(1)}
                      </h3>
                    </div>

                    <span className="fs-13">{total} Ratings &amp;</span>
                    <br />
                    <span className="fs-13">{payload?.to ?? reviews.length} Reviews</span>
                  </div>
                </div>

                <div className="col">
                  <div className="rating-position">
                    <h6 className="mb-4">Rating breakdown</h6>

                    {breakdownRow("5", 5, "bg-primary", counts[5], total)}
                    {breakdownRow("4", 4, "bg-success", counts[4], total)}
                    {breakdownRow("3", 3, "bg-warning", counts[3], total)}
                    {breakdownRow("2", 2, "bg-info", counts[2], total)}
                    {breakdownRow("1", 1, "text-bg-danger", counts[1], total)}
                  </div>
                </div>
              </div>
            </div>

            {/* Error / Loading */}
            {err && <div className="alert alert-danger">{err}</div>}
            {loading && <div className="alert alert-info">Loading reviews…</div>}

            {/* Reviews list */}
            {!loading &&
              !err &&
              reviews.map((r) => (
                <div className="d-flex mb-4 border-bottom pb-4" key={r.id}>
                  <div className="flex-shrink-0">
                    <Image
                      src={miniLogo}
                      alt="user"
                      height={70}
                      width={70}
                      className="object-fit-cover rounded-circle"
                    />
                  </div>
                  <div className="flex-grow-1 ms-4">
                    <div className="comment-header d-flex flex-wrap gap-2 mb-3">
                      <div>
                        <h4 className="fs-18 mb-0">- {r?.user?.name || "User"}</h4>
                        <div className="comment-datetime fs-12 text-muted">
                          {formatDateTime(r?.created_at)}
                          {r?.listing?.listing_title ? ` · ${r.listing.listing_title}` : ""}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 ms-auto">
                        <Stars rating={Number(r?.rating) || 0} />
                        <span className="fs-14 fw-semibold rating-points">
                          {(Number(r?.rating) || 0).toFixed(1)}/5
                        </span>
                      </div>
                    </div>

                    <div className="fs-15">{r?.comment || "-"}</div>

                    {/* <button
                      type="button"
                      className="border btn btn-sm d-inline-flex gap-2 mt-4 px-3 rounded-pill"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-hand-thumbs-up"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"></path>
                      </svg>
                      Helpful Review
                      <div className="vr d-none d-sm-inline-block"></div>
                      <span className="fw-semibold">—</span>
                    </button> */}
                  </div>
                </div>
              ))}

            {/* Pagination */}
            {!loading && !err && lastPage > 1 && (
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  « Previous
                </button>
                <div className="align-self-center">
                  Page {page} of {lastPage}
                </div>
                <button
                  className="btn btn-outline-secondary"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                >
                  Next »
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
