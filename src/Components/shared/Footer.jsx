

"use client"

import React from 'react';

import { LogoTwitter, LogoYoutube, LogoFacebook, ArrowRight } from '@gravity-ui/icons';
import FooterLogo from './FooterLogo';

const Footer = () => {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-800 dark:text-neutral-200 transition-colors duration-200">
      <div className="mx-auto max-w-8xl px-6 py-12">
        
        {/* Main Grid: Collapses to 1 column on mobile, scales up to 4 columns on desktop */}
        <div className="grid grid-cols-1 gap-15 md:grid-cols-2 lg:grid-cols-4 justify-between items-center">
          
          {/* Column 1: Branding & Description */}
          <div className="flex flex-col gap-4 items-center sm:items-start text-center sm:text-left">
            <FooterLogo/>
            <div>
              <p className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-200">
                Online Lawyer Hiring Platform
              </p>
              <p className="font-mono text-xs tracking-wider text-orange-600 dark:text-orange-400 mt-1">
                Justice Within Reach
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex justify-center flex-col gap-3 lg:ml-25 text-left">
            <nav className="flex justify-center flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400 text-center md:text-left">
              <a href="#about" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">About Us</a>
              <a href="#contact" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Contact</a>
              <a href="#privacy" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Privacy Policy</a>
            </nav>
          </div>

          {/* Column 3: Newsletter Placeholder */}
          <div className="flex flex-col gap-3 items-center sm:items-start w-full">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-300 text-center sm:text-left">
              Stay Updated
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center sm:text-left max-w-xs">
              Subscribe to our brief newsletter to get legal insights and platform updates.
            </p>
            {/* Frontend-only dynamic form submission */}
            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#121212] p-1"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 py-2 text-xs outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                required
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-neutral-950 transition-colors hover:bg-orange-400 shrink-0"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Column 4: Social Connections */}
          <div className="flex flex-col gap-4 items-center sm:items-start text-center sm:text-left">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-300">
              Connect With Us
            </span>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 transition-all hover:border-neutral-300 hover:dark:border-neutral-700 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current">
                  <path
                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 transition-all hover:border-neutral-300 hover:dark:border-neutral-700 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current">
                  <path
                    d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 transition-all hover:border-neutral-300 hover:dark:border-neutral-700 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Separator Line */}
        <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

        {/* Bottom Bar: Copyright Information */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-xs font-mono text-neutral-400 dark:text-neutral-600">
          <p>
            Copyright © {new Date().getFullYear()} - All rights reserved.
          </p>
          {/* <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            Made with ❤️ by <span className='text-md font-bold text-neutral-800 dark:text-neutral-200'>Syed Takmil</span>
          </p> */}
          <p className="tracking-tight text-neutral-400 dark:text-neutral-600">
            Designed for secure professional legal matchmaking.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;