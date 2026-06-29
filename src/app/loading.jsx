


import React from 'react';

export default function GlobalLoading() {
  return (


    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0d0d0d]">
      {/* Big Rotating Circle Layout */}
      <div className="w-12 h-12 border-4 border-purple-500/10 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );
}