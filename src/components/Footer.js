import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-dark main-footer overflow-hidden position-relative pt-5">
      <div className="container pt-4">

        <div className="border-top py-5">
          <div className="footer-row row gy-5 g-sm-5 gx-xxl-6">
            <div className="border-end col-lg-4 col-md-7 col-sm-6">
              <h5 className="fw-bold mb-4">Get In Touch</h5>
              <div className="mb-4">
                Join our newsletter and receive the best job
                <br className="d-none d-xxl-block" />
                openings of the week, right on your inbox.
              </div>
              <div className="border rounded-4 p-4 mb-4">
                <h6 className="text-white-50 mb-3">Join our Whatsapp:</h6>
                <a
                  className="align-items-center d-block d-flex whatsapp-number"
                  href="#"
                >
                  <i className="fa-brands fa-whatsapp fs-2 me-2"></i>
                  <span className="fs-5 fw-semibold text-decoration-underline">
                    (123) 456-7890
                  </span>
                </a>
              </div>
              <h5 className="fw-bold mb-4">Want to join Biz Directory?<br /> Write us!</h5>
              <span>
                <a
                  href="mailto:info@innovination.com"
                  className="__cf_email__"
                >
                  info@innovination.com
                </a>
              </span>
            </div>
            <div className="border-end col-lg-4 col-md-5 col-sm-6">
              <h5 className="fw-bold mb-4">Quick Links</h5>
              <ul className="list-unstyled gap-list">
                <li><a className="link-light text-decoration-none" href="/faqs">FAQ</a></li>
                <li><a className="link-light text-decoration-none" href="/contact">Support</a></li>
                <li><a className="link-light text-decoration-none" href="/dashboard/add-listing">List your business</a></li>
                <li><a className="link-light text-decoration-none" href="/about-us">About us</a></li>
                <li><a className="link-light text-decoration-none" href="/terms-and-conditions">Terms and Conditions</a></li>
                <li><a className="link-light text-decoration-none" href="/privacy-policy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h5 className="fw-bold mb-4">Get In Touch</h5>
              <div className="newsletter position-relative mt-4">
                <input type="email" className="form-control" placeholder="name@example.com" />
                <button
                  type="button"
                  className="btn btn-primary search-btn position-absolute top-50 rounded-circle"
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
              <div className="border-top my-4"></div>
              <h5 className="fw-bold mb-4">Follow the location</h5>
              {/* start social icon */}
              <ul className="d-flex flex-wrap gap-2 list-unstyled mb-0 social-icon">
                <li>
                  <a
                    href="#"
                    className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white inst"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white twi"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white dri"
                  >
                    <i className="fab fa-dribbble"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white fb"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="rounded-circle align-items-center d-flex fs-19 icon-wrap justify-content-center rounded-2 text-white whatsapp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                </li>
              </ul>
              {/* /. end social icon */}
            </div>
          </div>
        </div>
      </div>
      <div className="container border-top">
        <div className="align-items-center g-3 py-4 row">
          <div className="col-lg-auto">
            {/* start footer nav */}
            <ul className="list-unstyled list-separator mb-2 footer-nav">
              <li className="list-inline-item">
                <a href="/privacy-policy">Privacy</a>
              </li>
              <li className="list-inline-item">
                <a href="#">Sitemap</a>
              </li>
              <li className="list-inline-item">
                <a href="#">Cookies</a>
              </li>
            </ul>
            {/* end /. footer nav */}
          </div>
          <div className="col-lg order-md-first">
            <div className="align-items-center row">
              {/* start footer logo */}
              <a href="/" className="col-sm-auto footer-logo mb-2 mb-sm-0">
                <img src="/assets/images/logo-white.png" alt="" />
              </a>
              {/* end /. footer logo */}
              {/* start text */}
              <div className="col-sm-auto copy">
                © {year} Biz Directory - All Rights Reserved. <a href='https://www.innovination.com/' target='_blank'> Powered by Innovination </a>
              </div>
              {/* end /. text */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
