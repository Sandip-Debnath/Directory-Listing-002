

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


import bgImage from '@/../public/assets/images/header/lg-03.jpg';
import backgroundImage from '@/../public/assets/images/header/lg-04.jpg';
import handyperson from '@/../public/assets/images/icon/handyperson.png';



// simple remote URL check to choose <img> (remote) vs <Image> (local)
const isRemoteUrl = (u) => typeof u === 'string' && /^https?:\/\//i.test(u);


export default function AboutUs() {

    return (

        <>

            <section className="dark-overlay hero mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
                <Image
                    className="bg-image"
                    src="/assets/images/header/01.jpg"
                    alt="Image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
                <div className="container overlay-content py-5">
                    <div className="row justify-content-center">
                        <div className="col-sm-10 col-md-10 col-lg-10">
                            {/* start section header */}
                            <div className="section-header text-center" data-aos="fade-down">
                                {/* start description */}
                                <div className="bg-primary d-inline-block fs-14 mb-3 px-4 py-2 rounded-5 sub-title">
                                    7+ YEARS EXPERIENCED IN FIELD
                                </div>
                                {/* end /. section header sub title */}
                                {/* start section header */}
                                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                                    ListOn was founded in 2023 by Alexander with a <span className="font-caveat text-white">vision to your original</span> vision or inspiration.
                                </h2>
                                {/* end /. section header title */}
                            </div>
                            {/* end /. section header */}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">
                <div className="achievements-wrapper ms-auto me-auto">
                    <div
                        className="bg-center js-bg-image bg-cover bg-light counter-content_about position-relative rounded-4"
                        data-image-src="/assets/images/pattern.svg"
                    >
                        <div className="g-4 justify-content-center row">
                            <div className="col-sm-6 col-xl-3 text-center">
                                <div className="display-5 fw-semibold numscroller text-primary">
                                    <span className="counter">3,000 </span>+
                                </div>
                                <h5 className="fs-18 mb-0 mt-3">Job posted</h5>
                            </div>
                            <div className="col-sm-6 col-xl-3 text-center">
                                <div className="display-5 fw-semibold numscroller text-primary">
                                    <span className="counter">2,500 </span>+
                                </div>
                                <h5 className="fs-18 mb-0 mt-3">Successful hires</h5>
                            </div>
                            <div className="col-sm-6 col-xl-3 text-center">
                                <div className="display-5 fw-semibold numscroller text-primary">
                                    <span className="counter">10</span>M +
                                </div>
                                <h5 className="fs-18 mb-0 mt-3">Monthly visits</h5>
                            </div>
                            <div className="col-sm-6 col-xl-3 text-center">
                                <div className="display-5 fw-semibold numscroller text-primary">
                                    <span className="counter">593 </span>+
                                </div>
                                <h5 className="fs-18 mb-0 mt-3">Verified companies</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-5">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-sm-10 col-md-10 col-lg-8">
                            {/* start section header */}
                            <div className="section-header text-center mb-5" data-aos="fade-down">
                                {/* start subtitle */}
                                <div className="d-inline-block font-caveat fs-1 fw-medium section-header__subtitle text-capitalize text-primary">About us</div>
                                {/* end /. subtitle */}
                                {/* start title */}
                                <h2 className="display-5 fw-semibold mb-3 section-header__title text-capitalize">Explore over 2.5 million people travel around the world.</h2>
                                {/* end /. title */}
                                {/* start description */}
                                <div className="sub-title fs-16">Discover exciting categories. <span className="text-primary fw-semibold">Find what you’re looking for.</span></div>
                                {/* end /. description */}
                            </div>
                            {/* end /. section header */}
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="column-text-box left">
                                <p><span className="float-start important-text mb-2 me-2 position-relative text-primary fs-50"><strong>B</strong></span>iz directory desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                                <p> It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.</p>
                                <blockquote className="about-blockquote display-6 font-caveat fst-italic my-3"> It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.</blockquote>
                                <p>We hope you enjoy it using it as much as we did building it. Cheers!</p>
                                <Image src="/assets/images/png-img/signature.png" alt="Signature" className="signature mt-4" width={150} height={50} />
                            </div>
                        </div>
                        <div className="col-md-6 ps-xxl-5">
                            {/* start about image masonry */}
                            <div className="ps-xl-4 position-relative">
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="about-image-wrap mb-3 rounded-4">
                                            <Image src="/assets/images/about/01.jpg" alt="About Image 1" className="h-100 w-100 object-fit-cover about-image-one rounded-3" width={500} height={500} />
                                        </div>
                                        <div className="about-image-wrap rounded-4">
                                            <Image src="/assets/images/about/02.jpg" alt="About Image 2" className="h-100 w-100 object-fit-cover about-image-two rounded-3" width={500} height={500} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="about-image-wrap mb-3 rounded-4">
                                            <Image src="/assets/images/about/03.jpg" alt="About Image 3" className="h-100 w-100 object-fit-cover about-image-three rounded-3" width={500} height={500} />
                                        </div>
                                        <div className="about-image-wrap rounded-4">
                                            <Image src="/assets/images/about/04.jpg" alt="About Image 4" className="h-100 w-100 object-fit-cover about-image-four rounded-3" width={500} height={500} />
                                        </div>
                                    </div>
                                </div>
                                <Image src="/assets/images/png-img/about-shape-1.png" alt="About Shape" className="banner-shape-one position-absolute" width={100} height={100} />
                                <Image src="/assets/images/png-img/about-shape-2.png" alt="About Shape" className="banner-shape-two position-absolute" width={100} height={100} />
                            </div>
                            {/* end /. about image masonry */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="about-video position-relative mx-3 rounded-4 overflow-hidden">
                {/* Image Parallax */}
                <Image
                    src="/assets/images/about/bg-01.jpg"
                    alt="About Background"
                    className="about-img js-image-parallax"
                    layout="intrinsic"
                    width={1000}
                    height={600}
                />
                <a
                    className="align-items-center bg-blur d-flex justify-content-center popup-youtube position-absolute rounded-circle start-50 text-white top-50 translate-middle video-icon z-1"
                    href="https://www.youtube.com/watch?v=0O2aH4XLbto"
                >
                    <i className="fa-solid fa-play fs-20"></i>
                </a>
            </div>

            <div className="py-5 bg-light">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-sm-10 col-md-10 col-lg-8">
                        {/* start section header */}
                        <div className="section-header text-center mb-5" data-aos="fade-down">
                            {/* start subtitle */}
                            <div className="d-inline-block font-caveat fs-1 fw-medium section-header__subtitle text-capitalize text-primary">Our Customers</div>
                            {/* end /. subtitle */}
                            {/* start title */}
                            <h2 className="display-5 fw-semibold mb-3 section-header__title text-capitalize">Trusted By Thousands News Of Companies</h2>
                            {/* end /. title */}
                            {/* start description */}
                            <div className="sub-title fs-16">Discover exciting categories. <span className="text-primary fw-semibold">Find what you’re looking for.</span></div>
                            {/* end /. description */}
                        </div>
                        {/* end /. section header */}
                    </div>
                </div>
                <div className="row align-items-center justify-content-center g-2 g-sm-3 g-md-4">
                    <div className="col-6 col-sm-4 col-lg-3 col-xxl-2">
                        <div className="border-0 card card-hover d-block header-cat-box px-3 py-3 rounded-4 text-center">
                            <Image src="/assets/images/brand-logo/01.png" alt="Company 1" height={60} width={60} className="company-logo img-fluid" />
                        </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-3 col-xxl-2">
                        <div className="border-0 card card-hover d-block header-cat-box px-3 py-3 rounded-4 text-center">
                            <Image src="/assets/images/brand-logo/02.png" alt="Company 2" height={60} width={60} className="company-logo img-fluid" />
                        </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-3 col-xxl-2">
                        <div className="border-0 card card-hover d-block header-cat-box px-3 py-3 rounded-4 text-center">
                            <Image src="/assets/images/brand-logo/03.png" alt="Company 3" height={60} width={60} className="company-logo img-fluid" />
                        </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-3 col-xxl-2">
                        <div className="border-0 card card-hover d-block header-cat-box px-3 py-3 rounded-4 text-center">
                            <Image src="/assets/images/brand-logo/04.png" alt="Company 4" height={60} width={60} className="company-logo img-fluid" />
                        </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-3 col-xxl-2">
                        <div className="border-0 card card-hover d-block header-cat-box px-3 py-3 rounded-4 text-center">
                            <Image src="/assets/images/brand-logo/05.png" alt="Company 5" height={60} width={60} className="company-logo img-fluid" />
                        </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-3 col-xxl-2">
                        <div className="border-0 card card-hover d-block header-cat-box px-3 py-3 rounded-4 text-center">
                            <Image src="/assets/images/brand-logo/06.png" alt="Company 6" height={60} width={60} className="company-logo img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </>

    );
}
