// src/app/dashboard/add-listing/page.js
"use client";

import { useState } from "react";
import Image from 'next/image';

export default function AddListingPage() {
    const [form, setForm] = useState({
        category: "",
        city: "",
        meal:"",
    });

    function updateField(name, value) {
        setForm((f) => ({ ...f, [name]: value }));
    };

    return (
        <>
            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Basic Informations</h6>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-sm-6">

                            <div className="">
                                <label className="required fw-medium mb-2">Listing Title</label>
                                <input type="text" className="form-control" required="" />
                            </div>

                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="required fw-medium mb-2">Category</label>
                                <select
                                    className="form-select"
                                    value={form.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                >
                                    <option value="">Category</option>
                                    <option value="1">Restaurant</option>
                                    <option value="2">Event</option>
                                    <option value="3">Adrenaline</option>
                                </select>
                            </div>

                        </div>
                        <div className="col-sm-12">

                            <div className="">
                                <label className="required fw-medium mb-2">Tags</label>
                                <input type="text" className="form-control" placeholder="+ Add tag" required="" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Location</h6>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-sm-6">

                            <div className="">
                                <label className="required fw-medium mb-2">City</label>

                                <select
                                    className="form-select"
                                    value={form.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                >
                                    <option value="">Select City</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>

                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="required fw-medium mb-2">Address</label>
                                <input type="email" className="form-control" placeholder="8706 Herrick Ave, Valley..." required="" />
                            </div>

                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="required fw-medium mb-2">State</label>
                                <input type="number" className="form-control" placeholder="State" required="" />
                            </div>

                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="required fw-medium mb-2">Zip-Code</label>
                                <input type="number" className="form-control" placeholder="3870" required="" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Gallery</h6>
                </div>
                <div className="card-body">

                    <div className="">
                        <label className="required fw-medium mb-2">Gallery</label>
                        <input className="fileUp fileup-sm" type="file" name="files" accept=".jpg, .png, image/jpeg, image/png" multiple />
                        <div className="form-text">Recommended to 350 x 350 px (png, jpg, jpeg).</div>
                    </div>

                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Details</h6>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-sm-12">

                            <div className="">
                                <label className="required fw-medium mb-2">Description</label>
                                <textarea className="form-control" rows="7" placeholder="Please enter up to 4000 characters."></textarea>
                            </div>

                        </div>
                        <div className="col-sm-4">

                            <div className="">
                                <label className="required fw-medium mb-2">Phone</label>
                                <input type="number" className="form-control" placeholder="(123) 456 - 789" required="" />
                            </div>

                        </div>
                        <div className="col-sm-4">

                            <div className="">
                                <label className="required fw-medium mb-2">Company website</label>
                                <input type="text" className="form-control" placeholder="https://company.com" required="" />
                            </div>

                        </div>
                        <div className="col-sm-4">

                            <div className="">
                                <label className="required fw-medium mb-2">Email Address</label>
                                <input type="email" className="form-control" placeholder="example@email.com" required="" />
                            </div>

                        </div>
                        <div className="col-sm-12">
                            <hr />
                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="fw-medium mb-2">Facebook Page<span className="fs-13 ms-1 text-muted">(optional)</span></label>
                                <input type="text" className="form-control" placeholder="https://facebook.com/" />
                            </div>

                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="fw-medium mb-2">Twitter profile<span className="fs-13 ms-1 text-muted">(optional)</span></label>
                                <input type="text" className="form-control" placeholder="https://twitter.com/" />
                            </div>

                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="fw-medium mb-2">Instagram profile<span className="fs-13 ms-1 text-muted">(optional)</span></label>
                                <input type="text" className="form-control" placeholder="https://instagram.com/" />
                            </div>

                        </div>
                        <div className="col-sm-6">

                            <div className="">
                                <label className="fw-medium mb-2">Linkedin page<span className="fs-13 ms-1 text-muted">(optional)</span></label>
                                <input type="text" className="form-control" placeholder="https://linkedin.com/" />
                            </div>

                        </div>
                        <div className="col-sm-12">
                            <hr />
                        </div>
                        <div className="col-md-12">
                            <div className="fw-medium text-dark mb-3">Property amenities<span className="fs-13 ms-1 text-muted">(optional)</span></div>
                            <div className="row gx-3 gy-2">
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultOne" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultOne">
                                            Garden
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultTwo" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultTwo">
                                            Security cameras
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultThree" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultThree">
                                            Laundry
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultFour" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultFour">
                                            Internet
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultFive" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultFive">
                                            Pool
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultSix" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultSix">
                                            Video surveillance
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultSeven" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultSeven">
                                            Laundry room
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultEight" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultEight">
                                            Jacuzzi
                                        </label>
                                    </div>

                                </div>
                                <div className="col-auto">

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefaultNine" />
                                        <label className="form-check-label" htmlFor="flexCheckDefaultNine">
                                            Security cameras
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Opening Hours</h6>
                </div>
                <div className="card-body">
                    <div className="accordion listing-accordion" id="accordionExample">
                        <div className="accordion-item bg-transparent mb-3 rounded-4">
                            <h2 className="accordion-header">
                                <button className="accordion-button bg-transparent shadow-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-calendar2-plus text-primary me-3" viewBox="0 0 16 16">
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM8 8a.5.5 0 0 1 .5.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z" />
                                    </svg>
                                    <span className="fs-18 fw-medium">Add schedule plan</span><span className="count fs-13 ms-1 text-muted">(optional)</span>
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div className="accordion-body p-4">
                                    <div className="row g-4">
                                        <div className="col-sm-3">

                                            <div className="">
                                                <label className="fw-medium mb-2">Date</label>
                                                <input type="date" className="form-control" />
                                            </div>

                                        </div>
                                        <div className="col-sm-3">

                                            <div className="">
                                                <label className="fw-medium mb-2">Time</label>
                                                <input type="datetime-local" className="form-control" />
                                            </div>

                                        </div>
                                        <div className="col-sm-3">

                                            <div className="">
                                                <label className="fw-medium mb-2">Place</label>
                                                <input type="text" className="form-control" placeholder="Place" />
                                            </div>

                                        </div>
                                        <div className="col-sm-3">

                                            <div className="">
                                                <label className="fw-medium mb-2">Address</label>
                                                <input type="text" className="form-control" placeholder="8706 Herrick Ave, Valley..." />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="text-center mt-3">
                                        <button type="button" className="btn btn-primary-soft"><i className="fa fa-plus me-2"></i>Add another schedule item</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bg-transparent mb-3 rounded-4">
                            <h2 className="accordion-header">
                                <button className="accordion-button bg-transparent bg-white collapsed text-dark shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-cup-hot text-primary me-3" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6H.5ZM13 12.5a2.01 2.01 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5ZM2.64 13.825 1.123 7h11.754l-1.517 6.825A1.5 1.5 0 0 1 9.896 15H4.104a1.5 1.5 0 0 1-1.464-1.175Z" />
                                        <path d="m4.4.8-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 3.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8Zm3 0-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 6.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8Zm3 0-.003.004-.014.019a4.077 4.077 0 0 0-.204.31 2.337 2.337 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.198 3.198 0 0 1-.202.388 5.385 5.385 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 9.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8Z" />
                                    </svg>
                                    <span className="fs-18 fw-medium">Add restaurant menu</span><span className="count fs-13 ms-1 text-muted">(optional)</span>
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body p-4">
                                    <div className="row g-4">
                                        <div className="col-sm-4">

                                            <div className="">
                                                <label className="text-medium mb-2">Title</label>
                                                <input type="date" className="form-control" />
                                            </div>

                                        </div>
                                        <div className="col-sm-4">

                                            <div className="">
                                                <label className="fw-medium mb-2">Description</label>
                                                <input type="text" className="form-control" />
                                            </div>

                                        </div>
                                        <div className="col-sm-4">

                                            <div className="">
                                                <label className="fw-medium mb-2">Meal Type</label>
                                              
                                                <select
                                                    className="form-select"
                                                    value={form.meal}
                                                    onChange={(e) => updateField("meal", e.target.value)}
                                                >
                                                    <option value="">Select meal type</option>
                                                    <option value="1">Restaurant</option>
                                                    <option value="2">Event</option>
                                                    <option value="3">Adrenaline</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="text-center mt-3">
                                        <button type="button" className="btn btn-primary-soft"><i className="fa fa-plus me-2"></i>Add another meal</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bg-transparent mb-3 rounded-4">
                            <h2 className="accordion-header">
                                <button className="accordion-button bg-transparent bg-white collapsed text-dark shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-alarm text-primary me-3" viewBox="0 0 16 16">
                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z" />
                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z" />
                                    </svg>
                                    <span className="fs-18 fw-medium">Add opening hours</span><span className="count fs-13 ms-1 text-muted">(optional)</span>
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body p-4">
                                    <div className="mb-3 row">
                                        <label className="col-sm-2 col-form-label fw-medium">Monday</label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Open" />
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Close" />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label className="col-sm-2 col-form-label fw-medium">Tuesday</label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Open" />
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Close" />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label className="col-sm-2 col-form-label fw-medium">Wednesday</label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Open" />
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Close" />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label className="col-sm-2 col-form-label fw-medium">Thursday</label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Open" />
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Close" />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label className="col-sm-2 col-form-label fw-medium">Friday</label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Open" />
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Close" />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label className="col-sm-2 col-form-label fw-medium">Saturday</label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Open" />
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Close" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 col-form-label fw-medium">Sunday</label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Open" />
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" placeholder="Close" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header position-relative">
                    <h6 className="fs-17 fw-semi-bold mb-0">Add Pricing plan</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="faqs" className="table table-borderless">
                            <thead>
                                <tr>
                                    <th className="fw-medium">Title</th>
                                    <th className="fw-medium">Description</th>
                                    <th className="fw-medium">Price</th>
                                    <th className="fw-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="text" className="form-control" /></td>
                                    <td><input type="text" className="form-control" /></td>
                                    <td><input type="text" className="form-control" placeholder="INR" /></td>
                                    <td className="mt-10"><button type="button" className="btn btn-danger"><i className="fa fa-trash"></i></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        {/* <button onclick="addItem();" className="btn btn-primary-soft"><i className="fa fa-plus me-2"></i>Add New</button> */}

                        <button className="btn btn-primary-soft"><i className="fa fa-plus me-2"></i>Add New</button>
                    </div>
                </div>
            </div>

        </>
    );
}
