// src/app/dashboard/my-listings/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMyListings, deleteListingV2 } from "@/utils/api/handlers";
import Image from "next/image";
import fallbackImg from "@/../public/assets/dashboard/assets/dist/img/05.jpg";

export default function MyActiveListing() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialStatus =
    searchParams.get("status") === "pending" ? "pending" : "approved";
  const initialPage = Number(searchParams.get("page") || 1);

  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const titleLabel = useMemo(
    () => (status === "approved" ? "Active" : "Pending"),
    [status]
  );

  const fetchData = async (opts = {}) => {
    setErr("");
    setLoading(true);
    try {
      const r = await getMyListings({
        verification_status: status,
        page: opts.page ?? page, // no per_page
      });
      setResp(r);
    } catch (e) {
      setErr(e?.message || "Request failed");
      console.debug("[my-listings:error]", e);
    } finally {
      setLoading(false);
    }
  };

  // Sync URL -> state (back/forward)
  useEffect(() => {
    const qsStatus =
      searchParams.get("status") === "pending" ? "pending" : "approved";
    const qsPage = Number(searchParams.get("page") || 1);
    if (qsStatus !== status) setStatus(qsStatus);
    if (qsPage !== page) setPage(qsPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Sync state -> URL (avoid redundant replace)
  useEffect(() => {
    const sp = new URLSearchParams();
    sp.set("status", status);
    if (page > 1) sp.set("page", String(page));
    const next = `/dashboard/my-listings?${sp.toString()}`;
    const current = window.location.pathname + window.location.search;
    if (next !== current) router.replace(next);
  }, [status, page, router]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [status]);

  // Fetch data
  useEffect(() => {
    fetchData({ page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const data = resp?.data;
  const items = data?.data || [];
  const currentPage = data?.current_page ?? 1;
  const lastPage = data?.last_page ?? 1;

  const onPrev = () => currentPage > 1 && setPage(currentPage - 1);
  const onNext = () => currentPage < lastPage && setPage(currentPage + 1);

  const pageNumbers = useMemo(
    () => Array.from({ length: lastPage }, (_, i) => i + 1),
    [lastPage]
  );

  const gmUrl = (item) => {
    if (item.lat && item.long) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${item.lat},${item.long}`
      )}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      item.address || item.listing_title || ""
    )}`;
  };

  const onEdit = (id) => {
    router.push(`/dashboard/listings/${id}/edit`);
  };

  const onCardClick = (id) => {
    router.push(`/listing-details/${id}`);
  };

  const onAskDelete = (id) => {
    setTargetId(id);
    setShowDelete(true);
  };

  const onConfirmDelete = async () => {
    if (!targetId) return;
    setDeleting(true);
    setErr("");
    try {
      await deleteListingV2(targetId);
      // remove from view without refetch
      setResp((prev) => {
        if (!prev?.data?.data) return prev;
        const filtered = prev.data.data.filter((x) => x.id !== targetId);
        return { ...prev, data: { ...prev.data, data: filtered } };
      });
    } catch (e) {
      setErr(e?.message || "Delete failed");
    } finally {
      setDeleting(false);
      setShowDelete(false);
      setTargetId(null);
    }
  };



  return (
    <div>
      <div className="align-items-end row g-4 mb-4" data-aos="fade-down">
        <div className="col">
          <div className="section-header">
            <div className="font-caveat fs-4 fw-bold fw-medium section-header__subtitle text-capitalize text-center text-primary text-xl-start">
              My Listings
            </div>

            <h2 className="fw-semibold mb-0 section-header__title text-capitalize text-center text-xl-start h3">
              {titleLabel} Listings
            </h2>

            <div className="sub-title fs-16 text-center text-xl-start">
              Showing your{" "}
              <span className="text-primary fw-semibold">
                {titleLabel.toLowerCase()}
              </span>{" "}
              listings.
            </div>
          </div>
        </div>

        {/* Filter dropdown (replaces "See All") */}
        <div className="col-12 col-xl-auto">
          <div className="d-flex justify-content-center justify-content-xl-end">
            <select
              className="form-select w-auto"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by verification status"
            >
              <option value="approved">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {err ? <div className="alert alert-danger">{err}</div> : null}
      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div className="alert alert-info mb-3">
          No {titleLabel.toLowerCase()} listings found.
        </div>
      ) : null}

      {items.map((item) => {
        const hero = item.images?.[0]?.url || null;
        const ratings = Array.isArray(item.reviews)
          ? item.reviews
            .map(r => Number(r?.rating))
            .filter(n => Number.isFinite(n) && n > 0)
          : [];

        const reviewCount = ratings.length;
        const avgRating = reviewCount
          ? ratings.reduce((a, b) => a + b, 0) / reviewCount
          : 0;

        return (
          <div
            key={item.id}
            className="border-0 card card-hover flex-fill overflow-hidden rounded-3 shadow-sm w-100 card-hover-bg mb-3"
            role="button"
            tabIndex={0}
            onClick={() => onCardClick(item.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onCardClick(item.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body p-0">
              <div className="g-0 h-100 row">
                <div className="col-lg-3 col-md-5 col-sm-4 col-xxl-2 position-relative">
                  <div className="card-image-hover dark-overlay h-100 overflow-hidden position-relative">
                    {hero ? (
                      <img
                        src={hero}
                        alt={item.listing_title || "Listing image"}
                        className="h-100 w-100 object-fit-cover"
                      />
                    ) : (
                      <Image
                        src={fallbackImg}
                        alt=""
                        className="h-100 w-100 object-fit-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="col-lg-9 col-md-7 col-sm-8 col-xxl-10 p-3 p-lg-4 p-md-3 p-sm-4">
                  <div className="d-flex flex-column h-100">
                    {/* Edit / Delete buttons — right side */}
                    <div className="d-flex gap-2 ms-auto">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}
                        aria-label="Edit listing"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => { e.stopPropagation(); onAskDelete(item.id); }}
                        aria-label="Delete listing"
                      >
                        Delete
                      </button>
                    </div>

                    {/* keep reviews section commented (required later) */}

                    <div
                      className="align-items-center d-flex flex-wrap gap-1 text-primary card-start mb-2"
                      style={{ marginTop: "-30px" }}
                    >
                      <i className="fa-solid fa-star"></i>
                      <span className="fw-medium text-primary">
                        <span className="fs-6 fw-semibold me-1">
                          ({reviewCount ? avgRating.toFixed(1) : "—"})
                        </span>
                        {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                      </span>
                    </div>



                    <h4 className="fs-18 fw-semibold mb-0 d-flex align-items-center gap-2 mt-2">
                      {item.listing_title || "—"}
                      {item.verification_status === "approved" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="bi bi-patch-check-fill text-success"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"></path>
                        </svg>
                      ) : null}
                    </h4>

                    <p className="mt-1 fs-14 text-muted mb-2">
                      {item.address || "—"}
                    </p>

                    <div className="d-flex flex-wrap gap-3 gap-lg-2 gap-xl-3 mt-auto z-1">
                      {item.mobile ? (
                        <a
                          href={`tel:${item.mobile}`}
                          className="d-flex gap-2 align-items-center fs-13 fw-semibold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            fill="#9b9b9b"
                            className="bi bi-telephone"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" />
                          </svg>
                          <span>{item.mobile}</span>
                        </a>
                      ) : null}

                      <a
                        href={gmUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex gap-2 align-items-center fs-13 fw-semibold"
                        title="Open in Google Maps"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#9b9b9b"
                          className="bi bi-compass"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                          <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
                        </svg>
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {(resp?.data?.last_page ?? 1) > 1 && (
        <nav className="justify-content-center mt-4 pagination align-items-center gap-2">
          <button
            className="prev page-numbers btn btn-link"
            onClick={onPrev}
            disabled={currentPage <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-left-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
              ></path>
            </svg>
            previous
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`page-numbers btn ${n === currentPage ? "btn-primary" : "btn-light"
                }`}
            >
              {n}
            </button>
          ))}

          <button
            className="next page-numbers btn btn-link"
            onClick={onNext}
            disabled={currentPage >= lastPage}
          >
            next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-right-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
              ></path>
            </svg>
          </button>
        </nav>
      )}

      {/* Delete confirmation modal (simple controlled UI) */}
      {showDelete && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Listing</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !deleting && setShowDelete(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete this listing?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
