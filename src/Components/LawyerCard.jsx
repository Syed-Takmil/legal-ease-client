'use client';

import React from 'react';
import Link from 'next/link';
import { Magnifier, CircleCheck } from '@gravity-ui/icons';
import Image from 'next/image';

export default function LawyerCard({ lawyer }) {
  const isBusy = lawyer.status === 'Busy';

  return (
  
<Link 
  href={`/browse/${lawyer._id }`}
  className="group relative flex flex-col justify-between w-full h-full text-black bg-white dark:bg-[#0d0d0d] rounded-xl border border-gray-300 dark:border-neutral-800 hover:border-orange-500/50 p-5 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
>
      {/* GLOW DECORATION BACKGROUND */}
<div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors duration-300" />

      <div>
        {/* CARD TOP HEADER AREA: AVATAR & STATUS BADGE */}
        <div className="flex items-start justify-between gap-2 w-full mb-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
            <Image
            width={80}
            height={50}
              src={lawyer.photoUrl} 
              alt={lawyer.name}
              className=" object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* DYNAMIC AVAILABILITY COUNTER BADGE */}
          {isBusy ? (
            <span className="text-[10px] tracking-wide font-bold uppercase px-2.5 py-1 bg-white dark:bg-red-950/40 text-red-400 border border-red-900/60 rounded-md shadow-sm">
              Busy
            </span>
          ) : (
            <span className="text-[10px] tracking-wide font-bold uppercase px-2.5 py-1 bg-white dark:bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 rounded-md shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full  bg-emerald-400 animate-pulse" />
              Available
            </span>
          )}
        </div>

        {/* LAWYER CORE PROFILE STATS */}
        <div className="space-y-1">
          <h3 className="font-bold dark:text-white text-black  group-hover:text-orange-400 transition-colors text-base line-clamp-1">
            {lawyer.name}
          </h3>
          <p className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">
            {lawyer.specialization}
          </p>
          <p className="text-xs text-zinc-400 pt-1 line-clamp-2 leading-relaxed">
            {lawyer.bio}
          </p>
        </div>
      </div>

      {/* CARD PRICE & BOTTOM UTILITY BAR */}
      <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-zinc-500 block font-medium">Consultation</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-extrabold text-black  dark:text-white">${lawyer.hourlyRate}</span>
            <span className="text-[11px] text-zinc-500">/ hr</span>
          </div>
        </div>

        {/* CTA ACTION INDICATOR */}
        <div className="w-8 h-8 rounded-lg bg-neutral-900 group-hover:bg-orange-500 flex items-center justify-center border border-neutral-800 group-hover:border-none transition-all duration-300">
          <Magnifier className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black transition-colors" />
        </div>
      </div>
    </Link>
  );
}