

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


import bgImage from '@/../public/assets/images/header/lg-03.jpg';
import backgroundImage from '@/../public/assets/images/header/lg-04.jpg';
import handyperson from '@/../public/assets/images/icon/handyperson.png';


export default function ContactUs() {

    return (

      <>
      
      <section className="dark-overlay hero mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
            {/* Image background */}
            <Image 
                src="/assets/images/header/01.jpg" 
                alt="Background Image"
                className="bg-image"
                layout="fill" // Fills the container
                objectFit="cover" // Ensures it covers the entire container
                quality={100} 
            />
            <div className="container overlay-content py-5">
                <div className="row justify-content-between align-items-center">
                    <div className="col-md-6 col-lg-6">
                        {/* start section header */}
                        <div className="section-header" data-aos="fade-down">
                            {/* start description */}
                            <div className="bg-primary d-inline-block fs-14 mb-3 px-4 py-2 rounded-5 sub-title text-uppercase">Contact us</div>
                            {/* end /. section header sub title */}
                            {/* start section header */}
                            <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                                Do you have any<br /> questions? <span className="font-caveat text-white">Let us Know!</span>
                            </h2>
                            {/* end /. section header title */}
                            <p className="mb-0">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                            </p>
                        </div>
                        {/* end /. section header */}
                    </div>
                    <div className="col-md-5 col-lg-4">
                        <h5 className="fw-bold mb-4">General contact</h5>
                        <div className="mb-5">
                            <div>1123 Fictional St, San Francisco<br className="d-none d-xxl-block" /> , CA 94103</div>
                            <div className="mt-4">
                                <a className="d-block fw-medium mb-1" href="tel:+11234567890">
                                    <i className="fa-solid fa-phone me-2"></i><span>(123) 456-7890</span>
                                </a>
                                <a className="email-link d-block fw-medium" href="mailto:contact@bizdirectory.com">
                                    <i className="fa-solid fa-envelope me-2"></i>
                                    <span className="__cf_email__" data-cfemail="74070104041b060034381d07003b1a5a171b19">contact@bizdirectory.com</span>
                                </a>
                            </div>
                        </div>
                        <h5 className="fw-bold mb-4">Follow us</h5>
                        <div className="d-flex gap-3">
                            <a href="https://facebook.com" className="fb d-flex align-items-center justify-content-center fs-19 rounded mr-2">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" className="tw d-flex align-items-center justify-content-center fs-21 rounded mr-2">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" className="ins d-flex align-items-center justify-content-center fs-21 rounded mr-2">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://pinterest.com" className="pr d-flex align-items-center justify-content-center fs-21 rounded mr-2">
                                <i className="fab fa-pinterest-p"></i>
                            </a>
                            <a href="https://linkedin.com" className="li d-flex align-items-center justify-content-center fs-21 rounded mr-2">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div className="py-5 bg-light mx-3 rounded-4 my-3">
            <div className="container py-5">
                <div className="row justify-content-between">
                    <div className="col-md-6 col-xl-5">
                        <h3 className="h1 mb-4 font-caveat text-primary">My contact data</h3>
                        {/* Start Form Group */}
                        <div className="mb-4">
                            <label className="required fw-medium mb-2">Full Name</label>
                            <input type="text" className="form-control" id="firstName" placeholder="David Hall" required="" />
                        </div>
                        {/* /.End Form Group */}
                        {/* Start Form Group */}
                        <div className="mb-4">
                            <label className="required fw-medium mb-2">Your Email</label>
                            <input type="email" className="form-control" id="email" placeholder="hello@email.com" />
                        </div>
                        {/* /.End Form Group */}
                        {/* Start Form Group */}
                        <div className="mb-4">
                            <label className="required fw-medium mb-2">Your Phone</label>
                            <input type="number" className="form-control" id="phone" />
                        </div>
                        {/* /.End Form Group */}
                    </div>
                    <div className="col-md-6 col-xl-5">
                        <h3 className="h1 mb-4 font-caveat text-primary">My message</h3>
                        {/* Start Form Group */}
                        <div className="mb-4">
                            <label className="required fw-medium mb-2">Your Comments</label>
                            <textarea className="form-control" rows="7" placeholder="Tell us what we can help you with!"></textarea>
                        </div>
                        {/* /.End Form Group */}
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                YES, I AUTHORIZE THE USE OF MY PERSONAL DATA IN ACCORDANCE WITH THE PRIVACY POLICY DESCRIBED ON THE WEBSITE.
                            </label>
                        </div>
                        {/* Start Submit Button */}
                        <button type="submit" className="btn btn-primary btn-lg d-inline-flex hstack gap-2 mt-4">
                            <span>Send message</span>
                            <span className="vr"></span>
                            <i className="fa-arrow-right fa-solid fs-14"></i>
                        </button>
                        {/* /.End Submit Button */}
                    </div>
                </div>
                <div className="row g-4 gx-xxl-5 mt-5 justify-content-center">
                    <div className="col-md-12">
                        <h2 className="display-6 fw-medium">Are you coming to see us? Make an<br /> <span className="font-caveat text-primary">appointment</span> at any of our huts.</h2>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="address-card dark-overlay position-relative rounded-4 overflow-hidden">
                            <Image src="/assets/images/address-01.jpg" alt="Paris Address" className="bg-image" layout="fill" objectFit="cover" quality={100} />
                            <div className="address-card-info position-relative text-white z-1">
                                <h3 className="mb-4">Paris</h3>
                                <div>1123 Fictional St, San Francisco<br className="d-none d-xxl-block" /> , CA 94103</div>
                                <div className="mt-4">
                                    <a className="d-block fw-medium mb-1" href="tel:+11234567890">
                                        <i className="fa-solid fa-phone me-2"></i><span>(123) 456-7890</span>
                                    </a>
                                    <a className="email-link d-block fw-medium" href="mailto:contact@bizdirectory.com">
                                        <i className="fa-solid fa-envelope me-2"></i>
                                        <span className="__cf_email__">contact@bizdirectory.com</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="address-card dark-overlay position-relative rounded-4 overflow-hidden">
                            <Image src="/assets/images/address-02.jpg" alt="London Address" className="bg-image" layout="fill" objectFit="cover" quality={100} />
                            <div className="address-card-info position-relative text-white z-1">
                                <h3 className="mb-4">London</h3>
                                <div>1123 Fictional St, San Francisco<br className="d-none d-xxl-block" /> , CA 94103</div>
                                <div className="mt-4">
                                    <a className="d-block fw-medium mb-1" href="tel:+11234567890">
                                        <i className="fa-solid fa-phone me-2"></i><span>(123) 456-7890</span>
                                    </a>
                                    <a className="email-link d-block fw-medium" href="mailto:contact@bizdirectory.com">
                                        <i className="fa-solid fa-envelope me-2"></i>
                                        <span className="__cf_email__">contact@bizdirectory.com</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="address-card dark-overlay position-relative rounded-4 overflow-hidden">
                            <Image src="/assets/images/address-03.jpg" alt="New York Address" className="bg-image" layout="fill" objectFit="cover" quality={100} />
                            <div className="address-card-info position-relative text-white z-1">
                                <h3 className="mb-4">New York</h3>
                                <div>1123 Fictional St, San Francisco<br className="d-none d-xxl-block" /> , CA 94103</div>
                                <div className="mt-4">
                                    <a className="d-block fw-medium mb-1" href="tel:+11234567890">
                                        <i className="fa-solid fa-phone me-2"></i><span>(123) 456-7890</span>
                                    </a>
                                    <a className="email-link d-block fw-medium" href="mailto:contact@bizdirectory.com">
                                        <i className="fa-solid fa-envelope me-2"></i>
                                        <span className="__cf_email__">contact@bizdirectory.com</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </>

    );
}
