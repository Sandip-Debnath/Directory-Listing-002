"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMyEnquiries } from "@/utils/api/handlers";

export default function MyEnquiries() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL -> state (initial)
  const initialStatus = (() => {
    const s = (searchParams.get("status") || "all").toLowerCase();
    return ["all", "new", "replied", "closed"].includes(s) ? s : "all";
  })();
  const initialPage = Number(searchParams.get("page") || 1);

  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);

  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const titleLabel = useMemo(() => {
    switch (status) {
      case "new": return "New";
      case "replied": return "Replied";
      case "closed": return "Closed";
      default: return "All";
    }
  }, [status]);

  // State -> URL (like my-listings)
  useEffect(() => {
    const sp = new URLSearchParams();
    if (status !== "all") sp.set("status", status);
    if (page > 1) sp.set("page", String(page));
    const next = `/dashboard/my-enquiries${sp.toString() ? `?${sp.toString()}` : ""}`;
    const current = window.location.pathname + window.location.search;
    if (next !== current) router.replace(next);
  }, [status, page, router]);

  // Handle back/forward updates
  useEffect(() => {
    const qsStatus = (() => {
      const s = (searchParams.get("status") || "all").toLowerCase();
      return ["all", "new", "replied", "closed"].includes(s) ? s : "all";
    })();
    const qsPage = Number(searchParams.get("page") || 1);
    if (qsStatus !== status) setStatus(qsStatus);
    if (qsPage !== page) setPage(qsPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [status]);

  const fetchData = async (opts = {}) => {
    setErr("");
    setLoading(true);
    try {
      const params = { page: opts.page ?? page };
      if (status !== "all") params.status = status;
      const r = await getMyEnquiries(params);
      setResp(r);
    } catch (e) {
      setErr(e?.message || "Failed to load enquiries");
      console.debug("[my-enquiries:error]", e);
    } finally {
      setLoading(false);
    }
  };

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

  const statusBadge = (s) => {
    const map = {
      new: "bg-primary",
      replied: "bg-success",
      closed: "bg-secondary",
    };
    const cls = map[s] || "bg-dark";
    return <span className={`badge ${cls}`}>{(s || "unknown").toUpperCase()}</span>;
  };

  const ReadPill = ({ read }) =>
    read ? (
      <span className="badge bg-light text-success">Read</span>
    ) : (
      <span className="badge bg-warning-subtle text-warning">Unread</span>
    );

  return (
    <div>
      <div className="align-items-end row g-4 mb-4" data-aos="fade-down">
        <div className="col">
          <div className="section-header">
            <div className="font-caveat fs-4 fw-bold text-primary text-center text-xl-start">
              My Enquiries
            </div>
            <h2 className="fw-semibold mb-0 h3 text-center text-xl-start">
              {titleLabel} Enquiries
            </h2>
            <div className="sub-title fs-16 text-center text-xl-start">
              Messages people sent about your listings.
            </div>
          </div>
        </div>

        {/* Status filter */}
        <div className="col-12 col-xl-auto">
          <div className="d-flex justify-content-center justify-content-xl-end">
            <select
              className="form-select w-auto"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter enquiries by status"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {err ? <div className="alert alert-danger">{err}</div> : null}
      {loading ? <div>Loading…</div> : null}
      {!loading && items.length === 0 ? (
        <div className="alert alert-info mb-3">
          No {titleLabel.toLowerCase()} enquiries found.
        </div>
      ) : null}

      {/* Enquiry cards (no listing images; content-forward) */}
      {items.map((enq) => {
        const L = enq.listing || {};
        return (
          <div
            key={enq.id}
            className="card border-0 shadow-sm rounded-3 mb-3"
          >
            <div className="card-body p-3 p-md-4">
              {/* Header row: status + read + time */}
              <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                {statusBadge(enq.status)}
                <ReadPill read={!!enq.is_read} />
                <span className="ms-auto small text-muted">
                  {new Date(enq.created_at).toLocaleString()}
                </span>
              </div>

              {/* From + contact */}
              <div className="d-flex flex-wrap gap-3 align-items-center mb-2">
                <div className="fw-semibold">{enq.name || "—"}</div>
                <div className="text-muted">{enq.email || "—"}</div>
                {enq.mobile ? (
                  <a
                    className="text-decoration-none fw-semibold"
                    href={`tel:${enq.mobile}`}
                  >
                    {enq.mobile}
                  </a>
                ) : null}
                {/* <span className="text-muted small">via {enq.channel || "—"}</span>
                <span className="text-muted small">IP: {enq.ip_address || "—"}</span> */}
              </div>

              {/* Message */}
              <p className="mb-3">{enq.message || "No message provided."}</p>

              {/* Listing quick info (text only) */}
              <div className="d-flex flex-wrap gap-2 align-items-center small">
                <span className="text-muted">Listing:</span>
                {L.id ? (
                  <Link
                    href={`/listing-details/${L.id}`}
                    className="text-decoration-none fw-semibold"
                  >
                    {L.listing_title || "View listing"}
                  </Link>
                ) : (
                  <span className="text-muted">—</span>
                )}
                {L.verification_status === "approved" ? (
                  <span
                    className="badge bg-success-subtle text-success"
                    title="Verified"
                  >
                    Verified
                  </span>
                ) : null}
                {L.address ? <span className="text-muted">· {L.address}</span> : null}
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
    </div>
  );
}
