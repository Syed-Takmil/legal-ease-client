import React from 'react';

export default function LawyerSkeleton() {
  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0d0d0d] p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-neutral-800" />
        <div className="w-16 h-6 rounded-md bg-gray-200 dark:bg-neutral-800" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-neutral-800" />

        <div className="space-y-1 pt-1">
          <div className="h-2.5 w-full rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-2.5 w-5/6 rounded bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex justify-between items-center">
        <div className="space-y-1">
          <div className="h-2 w-10 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-4 w-14 rounded bg-gray-200 dark:bg-neutral-800" />
        </div>

        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}