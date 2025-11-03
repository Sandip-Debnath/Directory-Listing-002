

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


import bgImage from '@/../public/assets/images/header/lg-03.jpg';
import backgroundImage from '@/../public/assets/images/header/lg-04.jpg';
import handyperson from '@/../public/assets/images/icon/handyperson.png';


export default function Faqs() {

    return (

        <>
            <section className="dark-overlay hero mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
                <Image
                    src="/assets/images/header/03.jpg"
                    alt="FAQ Background Image"
                    className="bg-image"
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
                                <div className="bg-primary d-inline-block fs-14 mb-3 px-4 py-2 rounded-5 sub-title text-uppercase">FAQ</div>
                                {/* end /. section header sub title */}
                                {/* start section header */}
                                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                                    Frequently Asked <span className="font-caveat text-white">Questions</span>
                                </h2>
                                {/* end /. section header title */}
                                {/* start description */}
                                <div className="sub-title fs-16">
                                    Many desktop publishing packages and web page editors now use Lorem Ipsum as their
                                    <br className="d-none d-lg-block" /> default model text, and a search for 'lorem ipsum' will uncover many.
                                </div>
                                {/* end /. section header sub title */}
                            </div>
                            {/* end /. section header */}
                        </div>
                    </div>
                </div>
            </section>

            <div className="py-5">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="accordion" id="accordionExample">
                                {/* Accordion Item 1 */}
                                <div className="accordion-item mb-3 rounded-4">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button fs-5 p-4 text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            What Types Of Houses Are Available For Rent?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                        <div className="accordion-body p-4 pt-0">
                                            Biz directory offers a variety of houses for rent, including apartments, single-family homes, and townhouses, in multiple price ranges and locations. Whether you're looking for a cozy apartment or a spacious family home, we have options to suit your needs.
                                        </div>
                                    </div>
                                </div>
                                {/* Accordion Item 2 */}
                                <div className="accordion-item mb-3 rounded-4">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button fs-5 p-4 text-dark collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            What Is The Rental Application Process?
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body p-4 pt-0">
                                            The rental application process at Biz directory involves submitting an online form with your personal information, proof of income, and rental history. Once your application is reviewed, you may be asked for additional documents or references. We strive to make the process quick and easy for all applicants.
                                        </div>
                                    </div>
                                </div>
                                {/* Accordion Item 3 */}
                                <div className="accordion-item mb-3 rounded-4">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button fs-5 p-4 text-dark collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            What Are Your Rental Rates?
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body p-4 pt-0">
                                            Rental rates vary depending on the property type, location, and amenities. Biz directory provides a wide range of affordable options. You can view rates for each property directly on our platform, and our agents are happy to assist with any questions.
                                        </div>
                                    </div>
                                </div>
                                {/* Accordion Item 4 */}
                                <div className="accordion-item mb-3 rounded-4">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button fs-5 p-4 text-dark collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                            What Are The Lease Terms?
                                        </button>
                                    </h2>
                                    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body p-4 pt-0">
                                            Lease terms vary by property but typically range from 6 to 12 months. Some properties may offer longer-term leases. Please refer to the specific listing for the lease term details, or contact one of our agents for more information.
                                        </div>
                                    </div>
                                </div>
                                {/* Accordion Item 5 */}
                                <div className="accordion-item mb-3 rounded-4">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button fs-5 p-4 text-dark collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                            What Is Your Policy On Pets?
                                        </button>
                                    </h2>
                                    <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body p-4 pt-0">
                                            Biz directory has pet-friendly properties available. However, each listing may have specific pet policies, including pet deposits, size limits, and breed restrictions. Please check the listing details or inquire with our team for further information.
                                        </div>
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
