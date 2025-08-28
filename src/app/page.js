// src\app\page.js

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import bgImage from '@/../public/assets/images/header/lg-03.jpg';

export default function Home() {
  return (
    <div className="align-items-center d-flex hero-header-rounded dark-overlay mx-3 overflow-hidden position-relative rounded-4">

      <Image className="bg-image" src={bgImage} alt="Image" fill/>

      <div className="container overlay-content">
        <h1 className="display-2 fw-bold hero-header_title mb-2 text-capitalize text-white text-center">Search & <span className="font-caveat text-span">Discover</span> Nearby <br className="d-none d-lg-block" /> Landmarks in Places Around You</h1>
        <div className="lead mb-5 text-center text-white">Browse our detailed listings to explore everything in your area.</div>
        <div className="row justify-content-center">
          <div className="col-lg-10">

            <div className="border-0 card d-flex flex-md-row position-relative search-wrapper">
              <div className="align-items-center d-flex search-field w-100">
                <div className="svg-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </div>

                <input type="email" className="form-control search-input" placeholder="What are you looking for?" />

              </div>
              <div className="vertical-divider"></div>
              <div className="align-items-center d-flex search-field w-100">
                <div className="svg-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </div>

                <select className="form-select search-select-field">
                  <option selected>Location</option>
                  <option value="1">Florence, Italy</option>
                  <option value="2">Second choice</option>
                  <option value="3">Third choice</option>
                </select>

              </div>
              <input type="submit" value="Search places" className="btn btn-primary rounded-5 mt-3 mt-md-0" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
