


import React from 'react';
import {   ScalesUnbalanced } from '@gravity-ui/icons';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none group cursor-pointer">
      {/* Gravity UI Icon Container */}
      <div className="">
        {/* Gravity icons accept standard SVG sizing props */}
        <ScalesUnbalanced width={20} height={20} />
      </div>
      
      {/* Brand Text Alignment */}
      <div className="flex items-baseline text-xl md:text-2xl font-bold tracking-tight">
        <span className="font-serif text-slate-900 dark:text-slate-100">
          Legal
        </span>
        <span className="text-amber-600 font-sans font-black tracking-wide pl-0.5">
          Ease
        </span>
      </div>
    </div>
  );
}