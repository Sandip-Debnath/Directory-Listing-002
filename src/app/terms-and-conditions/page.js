import Image from 'next/image';

const TermsAndConditions = () => {

    return (
        <>
            {/* Hero Section */}
            <section className="dark-overlay hero mx-3 overflow-hidden position-relative py-4 py-lg-5 rounded-4 text-white">
                <Image
                    src="/assets/images/header/03.jpg"
                    alt="Terms and Conditions Background"
                    className="bg-image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
                <div className="container overlay-content py-5">
                    <div className="row justify-content-center">
                        <div className="col-sm-10 col-md-10 col-lg-10">
                            <div className="section-header text-center" data-aos="fade-down">
                                <div className="bg-primary d-inline-block fs-14 mb-3 px-4 py-2 rounded-5 sub-title text-uppercase">Terms and Conditions</div>
                                <h2 className="display-4 fw-semibold mb-3 section-header__title text-capitalize">
                                    Terms and Conditions for <span className="font-caveat text-white">Biz Directory</span>
                                </h2>
                                <div className="sub-title fs-16">
                                    Please read the following terms and conditions carefully before using our services.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms and Conditions Content Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <h3 className="h2 mb-4 font-caveat text-primary">1. Introduction</h3>
                            <p>
                                Welcome to Biz Directory! These Terms and Conditions ("Terms") govern your use of our services and website. By accessing or using Biz Directory ("Service"), you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use our Service.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">2. Use of Service</h3>
                            <p>
                                You must be at least 18 years old to use Biz Directory. By using our Service, you confirm that you meet this age requirement. We grant you a limited, non-transferable license to access and use the Service for lawful purposes only.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">3. User Account</h3>
                            <p>
                                To access certain features of Biz Directory, you may need to create an account. You are responsible for maintaining the confidentiality of your account information, including your username and password. You agree to notify us immediately of any unauthorized use of your account.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">4. Privacy Policy</h3>
                            <p>
                                By using Biz Directory, you agree to our Privacy Policy, which explains how we collect, use, and protect your personal data. Please review our Privacy Policy for more information on how we handle your personal information.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">5. User Conduct</h3>
                            <p>
                                You agree not to use Biz Directory for any unlawful, harmful, or prohibited activities, including but not limited to:
                            </p>
                            <ul>
                                <li>Harassing or defaming others</li>
                                <li>Uploading or distributing malicious software</li>
                                <li>Engaging in any fraudulent activity</li>
                            </ul>
                            <p>
                                You are responsible for your actions while using Biz Directory, and any violation of these Terms may result in termination of your access to the Service.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">6. Intellectual Property</h3>
                            <p>
                                All content on Biz Directory, including text, graphics, images, logos, and software, is the property of Biz Directory or its licensors and is protected by copyright laws. You may not reproduce, distribute, or modify any content from Biz Directory without express written permission.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">7. Disclaimers and Limitation of Liability</h3>
                            <p>
                                Biz Directory is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free. In no event shall Biz Directory or its affiliates be liable for any damages arising from the use of the Service, including but not limited to loss of data or profits.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">8. Changes to the Terms</h3>
                            <p>
                                We reserve the right to modify or update these Terms at any time. Any changes will be posted on this page, and the revised Terms will become effective immediately upon posting. We encourage you to periodically review this page to stay informed of any updates.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">9. Governing Law</h3>
                            <p>
                                These Terms are governed by the laws of the jurisdiction in which Biz Directory operates. Any disputes arising from the use of the Service will be resolved in the competent courts of that jurisdiction.
                            </p>

                            <h3 className="h2 mb-4 font-caveat text-primary">10. Contact Us</h3>
                            <p>
                                If you have any questions or concerns about these Terms, please contact us at <a href="mailto:contact@bizdirectory.com" className="text-primary">contact@bizdirectory.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TermsAndConditions;
