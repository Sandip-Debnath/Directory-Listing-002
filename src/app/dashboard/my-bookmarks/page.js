// src/app/dashboard/my-bookmarks/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMyBookmarks, deleteBookmark } from "@/utils/api/handlers";
import Image from "next/image";
import fallbackImg from "@/../public/assets/dashboard/assets/dist/img/05.jpg";

export default function MyBookMarks() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // only page from URL (no status filter here)
  const initialPage = Number(searchParams.get("page") || 1);

  const [page, setPage] = useState(initialPage);
  const [resp, setResp] = useState(null);   // will store a paginator with items already normalized to "listing" shape
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // delete confirm state (remove bookmark)
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [targetId, setTargetId] = useState(null); // this is the listing_id to delete

  const fetchData = async (opts = {}) => {
    setErr("");
    setLoading(true);
    try {
      const r = await getMyBookmarks({
        page: opts.page ?? page,
      });

      // ---- Normalize: convert bookmark rows -> listing rows ----
      // API shape: { data: { data: [ { id, listing_id, listing: {...} }, ... ] } }
      const paginator = r?.data ?? {};
      const rawItems = Array.isArray(paginator?.data) ? paginator.data : [];

      const normalizedItems = rawItems
        .map((row) => {
          // ensure listing exists; attach helper props if useful
          if (!row?.listing) return null;
          return {
            ...row.listing,
            _bookmarkId: row.id,          // (optional) bookmark row id
            _isBookmarked: true,          // (optional) flag
          };
        })
        .filter(Boolean);

      setResp({
        ...r,
        data: {
          ...paginator,
          data: normalizedItems,
        },
      });
      // ----------------------------------------------------------
    } catch (e) {
      setErr(e?.message || "Request failed");
      console.debug("[my-bookmarks:error]", e);
    } finally {
      setLoading(false);
    }
  };

  // Sync URL -> state (back/forward)
  useEffect(() => {
    const qsPage = Number(searchParams.get("page") || 1);
    if (qsPage !== page) setPage(qsPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Keep ?page in URL; DO NOT redirect to other routes
  useEffect(() => {
    const sp = new URLSearchParams();
    if (page > 1) sp.set("page", String(page));
    const next = `/dashboard/my-bookmarks?${sp.toString()}`;
    const current = window.location.pathname + window.location.search;
    if (next !== current) router.replace(next);
  }, [page, router]);

  // Fetch data
  useEffect(() => {
    fetchData({ page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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

  const onCardClick = (id) => {
    router.push(`/listing-details/${id}`);
  };

  const onAskDelete = (listingId) => {
    setTargetId(listingId);
    setShowDelete(true);
  };

  const onConfirmDelete = async () => {
    if (!targetId) return;
    setDeleting(true);
    setErr("");
    try {
      // endpoint expects: { listing_id }
      await deleteBookmark(targetId);

      // Remove from list without refetch
      setResp((prev) => {
        if (!prev?.data?.data) return prev;
        const filtered = prev.data.data.filter((x) => x.id !== targetId);
        return { ...prev, data: { ...prev.data, data: filtered } };
      });
    } catch (e) {
      setErr(e?.message || "Failed to remove bookmark");
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
              Bookmarked
            </div>

            <h2 className="fw-semibold mb-0 section-header__title text-capitalize text-center text-xl-start h3">
              Bookmarked Listings
            </h2>

            <div className="sub-title fs-16 text-center text-xl-start">
              Discover exciting categories.{" "}
              <span className="text-primary fw-semibold">
                Find what you’re looking for.
              </span>
            </div>
          </div>
        </div>

        {/* design spacer; filter intentionally removed */}
        <div className="col-12 col-xl-auto" />
      </div>

      {err ? <div className="alert alert-danger">{err}</div> : null}
      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div className="alert alert-info mb-3">No bookmarks found.</div>
      ) : null}

      {items.map((item) => {
        const hero = item.images?.[0]?.url || null;

        return (
          <div
            key={item.id}
            className="border-0 card card-hover flex-fill overflow-hidden rounded-3 shadow-sm w-100 card-hover-bg mb-3"
            role="button"
            tabIndex={0}
            onClick={() => onCardClick(item.id)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onCardClick(item.id)
            }
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
                    {/* delete bookmark button (kept same design spot) */}
                    <div className="d-flex end-0 gap-2 me-3 mt-3 position-absolute top-0 z-1">
                      <button
                        type="button"
                        className="align-items-center bg-light btn-icon d-flex justify-content-center rounded-circle text-primary"
                        title="Remove bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAskDelete(item.id); // item.id is listing id after normalization
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>
                      </button>
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
                          onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => e.stopPropagation()}
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
              className={`page-numbers btn ${
                n === currentPage ? "btn-primary" : "btn-light"
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

      {/* Delete confirmation modal */}
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
                <h5 className="modal-title">Remove Bookmark</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !deleting && setShowDelete(false)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to remove this bookmark?
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
                  {deleting ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
