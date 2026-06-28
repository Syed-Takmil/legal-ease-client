import { ScalesUnbalanced } from '@gravity-ui/icons';
import React from 'react';

const FooterLogo = () => {
    return (
        <div className="flex items-center gap-2 select-none group cursor-pointer">
      {/* Gravity UI Icon Container */}
      <div className="text-neutral-800 dark:text-neutral-200">
        {/* Gravity icons accept standard SVG sizing props */}
        <ScalesUnbalanced width={60} height={60} />
      </div>
      
      {/* Brand Text Alignment */}
      <div className="flex items-baseline text-5xl md:text-6xl font-bold tracking-tight">
        <span className="font-serif text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
          Legal
        </span>
        <span className="text-amber-600 font-sans font-black tracking-wide pl-0.5">
          Ease
        </span>
      </div>
    </div>
    );
};

export default FooterLogo;