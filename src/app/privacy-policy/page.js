'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import bgImage from '@/../public/assets/images/header/lg-03.jpg';
import backgroundImage from '@/../public/assets/images/header/lg-04.jpg';
import handyperson from '@/../public/assets/images/icon/handyperson.png';

export default function PrivacyPolicy() {

    return (
        <>
            {/* Hero Section with Background Image */}
            <section className="dark-overlay hero mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
                <Image
                    src="/assets/images/header/03.jpg"
                    alt="Privacy Policy Background Image"
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
                                <div className="bg-primary d-inline-block fs-14 mb-3 px-4 py-2 rounded-5 sub-title text-uppercase">Privacy Policy</div>
                                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                                    Privacy Policy for <span className="font-caveat text-white">Biz Directory</span>
                                </h2>
                                <div className="sub-title fs-16">
                                    At Biz Directory, we take your privacy seriously. This privacy policy outlines the types of personal data we collect and how we use it to provide you with a seamless experience.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Policy Content Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <h3 className="h2 mb-4 font-caveat text-primary">Introduction</h3>
                            <p>
                                Biz Directory is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal data when you use our services. We encourage you to read through this policy to understand our views and practices regarding your personal data and how we treat it.
                            </p>
                            
                            <h4 className="h3 mt-4 font-caveat text-primary">Information We Collect</h4>
                            <p>
                                We collect personal information when you interact with our platform, including but not limited to:
                            </p>
                            <ul>
                                <li>Your name, email, and contact details when you register or contact us.</li>
                                <li>Data related to your use of our website, including usage statistics and preferences.</li>
                                <li>Any information you voluntarily provide in surveys, feedback, or inquiries.</li>
                            </ul>

                            <h4 className="h3 mt-4 font-caveat text-primary">How We Use Your Information</h4>
                            <p>
                                The information we collect is used to provide, improve, and personalize your experience with Biz Directory. Specifically, we use your information to:
                            </p>
                            <ul>
                                <li>Provide you with access to our services and features.</li>
                                <li>Send important updates and promotional materials that may interest you.</li>
                                <li>Respond to inquiries, provide customer support, and improve our services.</li>
                            </ul>

                            <h4 className="h3 mt-4 font-caveat text-primary">Data Protection and Security</h4>
                            <p>
                                We employ appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, and destruction. However, no data transmission over the internet is entirely secure, and we cannot guarantee the absolute security of your data.
                            </p>

                            <h4 className="h3 mt-4 font-caveat text-primary">Cookies and Tracking Technologies</h4>
                            <p>
                                We use cookies and similar technologies to enhance your experience on our website. These technologies allow us to remember your preferences and improve site functionality. By using our website, you consent to our use of cookies as outlined in our Cookie Policy.
                            </p>

                            <h4 className="h3 mt-4 font-caveat text-primary">Your Rights</h4>
                            <p>
                                You have the right to access, correct, or delete the personal data we hold about you. You can also withdraw your consent to the processing of your data at any time. To exercise your rights, please contact us at the details provided below.
                            </p>

                            <h4 className="h3 mt-4 font-caveat text-primary">Contact Us</h4>
                            <p>
                                If you have any questions or concerns about this privacy policy or how we handle your personal data, feel free to contact us at <a href="mailto:contact@bizdirectory.com" className="text-primary">contact@bizdirectory.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

