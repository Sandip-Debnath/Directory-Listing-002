// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store";
import { storage } from "@/utils/storage";
import { getMyDashBoard } from "@/utils/api/handlers";

import miniLogo from "@/../public/assets/dashboard/assets/dist/img/mini-logo.png";
import analytics from "@/../public/assets/dashboard/assets/dist/img/predictive_analytics.png";
import avatar from "@/../public/assets/dashboard/assets/dist/img/01.jpg";
import photoshop from "@/../public/assets/dashboard/assets/dist/img/photoshop.png";
import glass from "@/../public/assets/dashboard/assets/dist/img/glass.png";
import graphv1 from "@/../public/assets/dashboard/assets/dist/img/bookmarks.png";
import degrees from "@/../public/assets/dashboard/assets/dist/img/listings.png";
import salesPerformance from "@/../public/assets/dashboard/assets/dist/img/enquirys.png";
import reviewsIcon from "@/../public/assets/dashboard/assets/dist/img/reviews.png";
import avatar02 from "@/../public/assets/dashboard/assets/dist/img/02.jpg";
import avatar03 from "@/../public/assets/dashboard/assets/dist/img/03.jpg";
import avatar04 from "@/../public/assets/dashboard/assets/dist/img/04.jpg";

export default function DashboardPage() {
  const { token, user } = useAppSelector((s) => s.auth);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyDashBoard();
      setDashboardData(response?.data ?? response);
      if (process.env.NODE_ENV !== "production") {
        console.log("Dashboard Data:", response);
      }
    } catch (err) {
      console.error("[Dashboard:error]", err);
      setError(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = token ?? storage.get("auth_token", null);
    const u = user ?? storage.get("auth_user", null);
    if (process.env.NODE_ENV !== "production") {
      console.log("[Dashboard] token:", t);
      console.log("[Dashboard] user:", u);
    }
    // Fetch data on mount — no DataTables/jQuery
    fetchDashboardData();
  }, [token, user]);

  const stats = dashboardData?.stats;
  const recent = dashboardData?.recent;
  const userInfo = dashboardData?.user;

  const fmtDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <>
      {/* Banner (design unchanged) */}
      <div className="header-banner align-items-center d-flex justify-content-between mb-3 p-4 rounded-4 w-100">
        <div className="header-banner-context">
          <h3 className="align-items-center d-flex fs-5 gap-2 text-white mb-3">
            <Image src={photoshop} alt="" width="35" />
            Dashboard Overview
          </h3>
          <div className="content-text fs-14 opacity-75 text-white">
          Monitor your business performance at a glance. Get real-time insights into listings, enquiries, reviews, and bookmarks — all in one place. Track user engagement, measure growth, and manage your activities efficiently from your personalized dashboard.
          </div>
          {/* <button className="content-button btn btn-light mt-3">
            Start free trial
          </button> */}
        </div>
        <Image className="content-wrapper-img" src={glass} alt="" width="180" />
      </div>

      {/* 4 widgets — headings mapped to API keys */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex">
          <div className="card flex-column flex-fill p-4 position-relative shadow w-100 widget-card">
            <div className="d-flex">
              <div className="flex-grow-1 ms-3">
                <div className="fs-14 text-muted">Bookmarks</div>
                <h3 className="fw-semi-bold mb-0">
                  {loading ? "…" : stats?.bookmarks?.total ?? 0}
                </h3>
              </div>
              <div className="flex-shrink-0">
                <Image src={graphv1} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex">
          <div className="card flex-column flex-fill p-4 position-relative shadow w-100 widget-card">
            <div className="d-flex">
              <div className="flex-grow-1 ms-3">
                <div className="fs-14 text-muted">Listings</div>
                <h3 className="fw-semi-bold mb-0">
                  {loading ? "…" : stats?.listings?.total ?? 0}
                </h3>
              </div>
              <div className="flex-shrink-0">
                <Image src={degrees} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex">
          <div className="card flex-column flex-fill p-4 position-relative shadow w-100 widget-card">
            <div className="d-flex">
              <div className="flex-grow-1 ms-3">
                <div className="fs-14 text-muted">Enquiries</div>
                <h3 className="fw-semi-bold mb-0">
                  {loading ? "…" : stats?.enquiries?.total ?? 0}
                </h3>
              </div>
              <div className="flex-shrink-0">
                <Image src={salesPerformance} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex">
          <div className="card flex-column flex-fill p-4 position-relative shadow w-100 widget-card">
            <div className="d-flex">
              <div className="flex-grow-1 ms-3">
                <div className="fs-14 text-muted">Reviews</div>
                <h3 className="fw-semi-bold mb-0">
                  {loading ? "…" : stats?.reviews?.total ?? 0}
                </h3>
              </div>
              <div className="flex-shrink-0">
                <Image src={reviewsIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Totals box — three panels mapped to Listings, Enquiries, Reviews */}
      <div className="card mb-3 p-4 total-box">
        <div className="g-4 gx-xxl-5 row">
          {/* Listings summary */}
          <div className="col-sm-4 total-box-left">
            <div className="align-items-center d-flex justify-content-between mb-4">
              <h6 className="mb-0">Listings</h6>
              <div className="align-items-center d-flex justify-content-center rounded arrow-btn percentage-increase">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                </svg>
              </div>
            </div>
            <h1 className="price">
              {loading ? "…" : stats?.listings?.total ?? 0}
              <span className="fs-13 ms-1 text-muted"> (total)</span>
            </h1>
            <p className="mb-0 fw-semibold fs-14">
              Approved: <span className="percentage-increase">{stats?.listings?.approved ?? 0}</span>
              &nbsp; Pending: <span className="percentage-increase">{stats?.listings?.pending ?? 0}</span>
              &nbsp; Rejected: <span className="percentage-increase">{stats?.listings?.rejected ?? 0}</span>
            </p>
          </div>

          {/* Enquiries summary */}
          <div className="col-sm-4 total-box-left">
            <div className="align-items-center d-flex justify-content-between mb-4">
              <h6 className="mb-0">Enquiries</h6>
              <div className="align-items-center d-flex justify-content-center rounded arrow-btn percentage-increase">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                </svg>
              </div>
            </div>
            <h1 className="price">
              {loading ? "…" : stats?.enquiries?.total ?? 0}
            </h1>
            <p className="mb-0 fw-semibold fs-14">
              This month: <span className="percentage-increase">{stats?.enquiries?.this_month ?? 0}</span>
              &nbsp; Pending: <span className="percentage-increase">{stats?.enquiries?.pending ?? 0}</span>
              &nbsp; Resolved: <span className="percentage-increase">{stats?.enquiries?.resolved ?? 0}</span>
            </p>
          </div>

          {/* Reviews summary */}
          <div className="col-sm-4 total-box__right">
            <div className="align-items-center d-flex justify-content-between mb-4">
              <h6 className="mb-0">Reviews</h6>
              <div className="align-items-center d-flex justify-content-center rounded text-primary arrow-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-down-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0z" />
                </svg>
              </div>
            </div>
            <h1 className="price">
              {loading ? "…" : stats?.reviews?.total ?? 0}
            </h1>
            <p className="mb-0 fw-semibold fs-14">
              Avg rating: <span className="text-primary">{stats?.reviews?.avg_rating ?? 0}</span>
              &nbsp; This month: <span className="text-primary">{stats?.reviews?.this_month ?? 0}</span>
            </p>
          </div>
        </div>
      </div>

      {/* User & Plan (uses the existing "Statistics" card shell) */}
      <div className="card mb-3">
        <div className="card-header position-relative">
          <h6 className="fs-17 fw-semi-bold my-1">User & Plan</h6>
        </div>
        <div className="card-body">
          {!dashboardData && loading && <div>Loading…</div>}
          {error && <div className="text-danger">{error}</div>}
          {dashboardData && (
            <div id="chart">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="fs-14 text-muted mb-1">User</div>
                  <div className="fw-semibold">
                    {userInfo?.name} 
                  </div>
                  <div className="text-muted">{userInfo?.email}</div>
                  <div className="text-muted">Mobile: {userInfo?.mobile || "—"}</div>
                  <div className="mt-1">
                    Verified:{" "}
                    <span className={userInfo?.verified ? "text-success" : "text-warning"}>
                      {String(!!userInfo?.verified)}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="fs-14 text-muted mb-1">Plan</div>
                  <div>Name: {userInfo?.plan?.name ?? "—"}</div>
                  <div>Status: {userInfo?.plan?.status ?? "—"}</div>
                  <div>Expires on: {userInfo?.plan?.expires_on ?? "—"}</div>
                  <div>Next billing on: {userInfo?.plan?.next_billing_on ?? "—"}</div>
                  <div>Remaining days: {userInfo?.plan?.remaining_days ?? "—"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries — table design kept; "Payment Type" shown as — (no payments in API) */}
      <div className="card">
        <div className="card-header position-relative">
          <h6 className="fs-17 fw-semi-bold my-1">Recent Enquiries</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-borderless text-nowrap category-list" id="exampleTable">
              <thead>
                <tr>
                  <th>SL</th>
                  
                  <th>Name</th>
                  <th>Enquiry Date</th>
                  
                  <th>Status</th>
                  <th className="text-end">View Listing</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7}>Loading…</td>
                  </tr>
                )}
                {!loading && (!recent?.enquiries || recent.enquiries.length === 0) && (
                  <tr>
                    <td colSpan={7}>No enquiries</td>
                  </tr>
                )}
                {!loading &&
                  recent?.enquiries?.map((e, idx) => (
                    <tr key={e.id}>
                      <th>{String(idx + 1).padStart(2, "0")}</th>
                      
                      <td>
                        <div className="fw-semibold">{e.name}</div>
                        <div className="text-muted fs-12">{e.email}</div>
                        <div className="text-muted fs-12">Mobile: {e.mobile || "—"}</div>
                      </td>
                      <td>{fmtDate(e.created_at)}</td>
                      
                      <td>
                        <div className="align-items-center d-flex fw-medium gap-1 fs-14">
                          <i className="fa-circle fa-solid fs-10"></i>
                          <span
                            className={
                              e.status === "replied"
                                ? "text-success"
                                : e.status === "new"
                                ? "text-primary"
                                : ""
                            }
                          >
                            {e.status}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">
                        <Link
                          href={`/listing-details/${e.listing_id}`}
                          className="btn btn-primary fw-medium btn-sm d-inline-flex align-items-center justify-content-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="card mt-3">
        <div className="card-header position-relative">
          <h6 className="fs-17 fw-semi-bold my-1">Recent Listings</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-borderless text-nowrap category-list">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-end">View Listing</th>
                </tr>
              </thead>
              <tbody>
                {recent?.listings?.length ? (
                  recent.listings.map((l, i) => (
                    <tr key={l.id}>
                      <th>{String(i + 1).padStart(2, "0")}</th>
                      <td>{l.title}</td>
                      <td className="text-capitalize">{l.status}</td>
                      <td>{fmtDate(l.created_at)}</td>
                      <td className="text-end">
                        <Link
                          href={`/listing-details/${l.id}`}
                          className="btn btn-primary fw-medium btn-sm d-inline-flex align-items-center justify-content-center gap-1"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No listings</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="card mt-3" style={{marginBottom:'30px'}}>
        <div className="card-header position-relative">
          <h6 className="fs-17 fw-semi-bold my-1">Recent Reviews</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-borderless text-nowrap category-list">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {recent?.reviews?.length ? (
                  recent.reviews.map((r, i) => (
                    <tr key={r.id}>
                      <th>{String(i + 1).padStart(2, "0")}</th>
                      
                      <td>{r.rating}</td>
                      <td className="text-truncate" style={{ maxWidth: 280 }}>
                        {r.comment}
                      </td>
                      <td>{fmtDate(r.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No reviews</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Bookmarks */}
      {/* <div className="card mt-3">
        <div className="card-header position-relative">
          <h6 className="fs-17 fw-semi-bold my-1">Recent Bookmarks</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-borderless text-nowrap category-list">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Listing ID</th>
                  <th>Created At</th>
                  <th className="text-end">View</th>
                </tr>
              </thead>
              <tbody>
                {recent?.bookmarks?.length ? (
                  recent.bookmarks.map((b, i) => (
                    <tr key={b.id}>
                      <th>{String(i + 1).padStart(2, "0")}</th>
                      <td>{b.listing_id}</td>
                      <td>{fmtDate(b.created_at)}</td>
                      <td className="text-end">
                        <Link
                          href={`/listings/${b.listing_id}`}
                          className="btn btn-primary fw-medium btn-sm d-inline-flex align-items-center justify-content-center gap-1"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No bookmarks</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </>
  );
}
