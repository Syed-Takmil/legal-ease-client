'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House, ChevronLeft } from '@gravity-ui/icons';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden text-neutral-200">
      
      {/* BACKGROUND DECORATION GRAIN & GLOWS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-neutral-800/20 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-md w-full text-center space-y-6 px-4">
        
        {/* BIG NUMERIC ERROR GRAPHIC WITH GRADIENT GLOW */}
        <div className="relative inline-block select-none">
          <h1 className="text-9xl font-black tracking-tighter bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent opacity-90 drop-shadow-[0_10px_20px_rgba(255,165,0,0.15)]">
            404
          </h1>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-orange-500 rounded-full shadow-[0_0_12px_#ff9f00]" />
        </div>

        {/* ERROR HEADER & EXPLANATION */}
        <div className="space-y-2 pt-4">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Case Dismissed: Page Not Found
          </h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            The destination you are searching for might have been retracted, renamed, or is temporarily unavailable under legal review.
          </p>
        </div>

        {/* INTERACTIVE NAVIGATION CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 w-full max-w-xs mx-auto">
          
          {/* Go Back Action Button */}
          <button 
            onClick={() => router.back()}
            className="btn btn-outline border-neutral-800 text-zinc-300 hover:bg-neutral-900 hover:text-white rounded-xl w-full sm:w-auto flex gap-2 items-center normal-case font-medium text-sm transition-all h-11"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back
          </button>

          {/* Direct Home Anchor Button */}
          <Link 
            href="/"
            className="btn bg-orange-500 hover:bg-orange-600 border-none text-black font-semibold rounded-xl w-full sm:w-auto flex gap-2 items-center normal-case text-sm shadow-lg shadow-orange-500/10 transition-all h-11"
          >
            <House className="w-4 h-4" />
            Return Home
          </Link>

        </div>

        {/* SUBTLE BRAND FOOTER FOOTPRINT */}
        <div className="pt-12 select-none">
          <span className="text-[18px] tracking-widest text-zinc-600 font-bold bg-neutral-900/40 px-3 py-1.5 rounded-full border border-neutral-900">
            <span className='text-white'>Legal</span><span className='text-amber-600'>Ease</span> Security Gate
          </span>
        </div>

      </div>
    </div>
  );
}