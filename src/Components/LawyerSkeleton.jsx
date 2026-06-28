import React from 'react';

export default function LawyerSkeleton() {
  return (
    <div className="w-full bg-[#0d0d0d] rounded-xl border border-neutral-900 p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 bg-neutral-900 rounded-xl" />
        <div className="w-16 h-6 bg-neutral-900 rounded-md" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-neutral-900 rounded w-3/4" />
        <div className="h-3 bg-neutral-900 rounded w-1/2" />
        <div className="space-y-1 pt-1">
          <div className="h-2.5 bg-neutral-900 rounded w-full" />
          <div className="h-2.5 bg-neutral-900 rounded w-5/6" />
        </div>
      </div>
      <div className="pt-4 border-t border-neutral-900/60 flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-2 bg-neutral-900 rounded w-10" />
          <div className="h-4 bg-neutral-900 rounded w-14" />
        </div>
        <div className="w-8 h-8 bg-neutral-900 rounded-lg" />
      </div>
    </div>
  );
}