


'use client';

import React from 'react';
import Link from 'next/link';

export default function Banner() {
  return (
    <div className="w-full px-4 sm:px-8 py-6">
      {/* daisyUI Carousel element containing our sliding slides */}
      <div className="carousel w-full h-[450px] sm:h-130 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* --- SLIDE 1: Corporate & Business Law --- */}
      <div id="slide1" className="carousel-item relative w-full h-full">
          {/* Background image overlay using crisp modern legal workspace visuals */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200")' }}
          >
            {/* Dark glassmorphic gradient overlay ensures your white text pops effortlessly */}
            <div className="absolute inset-0 bg-gradient-to-r from-base-900/90 via-base-900/60 to-transparent flex items-center p-8 sm:p-16">
              <div className="max-w-lg space-y-4">
                <span className="badge badge-primary font-semibold tracking-wide uppercase px-3 py-1 text-xs">
            Find Hire Resolve 
                </span>

                <p className="text-white text-3xl font-bold leading-relaxed">
                   Find & Hire Expert  <span className='text-blue-600'>Legal</span>  Counsel
                   <br />
                   Justice is <span className='text-blue-600'>now</span> Within reach
                </p>
                <div className="pt-2">
                  <Link href="/browse" className="btn btn-primary text-white rounded-lg px-6 font-medium shadow-md">
                    Browse Lawyers
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle btn-sm bg-base-200 text-black dark:text-white border-none hover:bg-primary transition">❮</a> 
            <a href="#slide2" className="btn btn-circle btn-sm bg-base-900/40 text-black dark:text-white border-none hover:bg-primary transition">❯</a>
          </div>
        </div>

        {/* --- SLIDE 2: Family & Civil Law --- */}
        <div id="slide2" className="carousel-item relative w-full h-full">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200")'}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-base-900/90 via-base-900/60 to-transparent flex items-center p-8 sm:p-16">
              <div className="max-w-lg space-y-4">
                <span className="badge badge-secondary font-semibold tracking-wide uppercase px-3 py-1 text-xs">
                  Family & Civil Matters
                </span>
                <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-none">
                  Guidance Through Crucial Moments
                </h1>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Compassionate, certified legal advocates ready to help you navigate property division, child custody, and civil inheritance disputes smoothly.
                </p>
                <div className="pt-2">
                  <Link href="/browse?specialty=family" className="btn btn-secondary text-white rounded-lg px-6 font-medium shadow-md">
                    Browse Specialists
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute  flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle btn-sm bg-base-200 text-black dark:text-white border-none hover:bg-primary transition">❮</a> 
            <a href="#slide3" className="btn btn-circle btn-sm bg-base-900/40 text-black dark:text-white border-none hover:bg-primary transition">❯</a>
          </div>
        </div>

        {/* --- SLIDE 3: Criminal & Litigation Law --- */}
        <div id="slide3" className="carousel-item relative w-full h-full">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-base-900/90 via-base-900/60 to-transparent flex items-center p-8 sm:p-16">
              <div className="max-w-lg space-y-4">
                <span className="badge badge-accent font-semibold tracking-wide uppercase px-3 py-1 text-xs">
                  Defense & Litigation
                </span>
                <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-none">
                  Your Strongest Legal Defense
                </h1>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Get premium access to elite litigation lawyers and defense counsels with proven criminal trial experience protecting constitutional rights.
                </p>
                <div className="pt-2">
                  <Link href="/browse?specialty=litigation" className="btn btn-accent text-white rounded-lg px-6 font-medium shadow-md">
                    Find Trial Lawyers
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle btn-sm bg-base-900/40 text-black dark:text-white border-none hover:bg-primary transition">❮</a> 
            <a href="#slide1" className="btn btn-circle btn-sm bg-base-900/40 text-black dark:text-white border-none hover:bg-primary transition">❯</a>
          </div>
        </div>

      </div>


    </div>
  );
}