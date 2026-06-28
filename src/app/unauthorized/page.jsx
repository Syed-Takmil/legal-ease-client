'use client';

import Link from 'next/link';
import { ShieldExclamation } from '@gravity-ui/icons';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
      <div className="max-w-lg w-full text-center rounded-3xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0d0d0d] p-10 shadow-xl">

        <div className="mx-auto w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center">
          <ShieldExclamation className="w-10 h-10 text-orange-500" />
        </div>

        <h1 className="mt-8 text-7xl font-black text-orange-500">
          403
        </h1>

        <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
          Access Forbidden
        </h2>

        <p className="mt-4 text-gray-600 dark:text-zinc-400 leading-relaxed">
          You don't have permission to access this page.
          If you believe this is a mistake, please contact the administrator.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold transition-colors"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Go Back
          </button>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-gray-400 dark:text-zinc-600">
          Error Code • 403 Forbidden
        </p>

      </div>
    </div>
  );
}
