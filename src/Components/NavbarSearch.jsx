'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; 
import { Magnifier } from '@gravity-ui/icons';

function SearchInput() {
  const path = usePathname();
  const router = useRouter();       
  const searchParams = useSearchParams(); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentSearch = searchParams.get('search');
    if (currentSearch) {
      setSearchQuery(currentSearch);
    } else if (path !== '/browse') {
      setSearchQuery('');
    }
  }, [searchParams, path]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        placeholder="Search lawyers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input input-bordered w-full pl-10 bg-neutral-100 dark:bg-base-200 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-800 text-sm focus:input-primary h-10 rounded-lg placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors"
      />
      <div className="absolute left-3 top-2.5 text-neutral-400 dark:text-neutral-500">
        <Magnifier/>
      </div>
    </form>
  );
}

export default function NavbarSearch() {
  return (
    <Suspense fallback={<div className="h-10 w-full bg-neutral-100 dark:bg-base-200 animate-pulse rounded-lg" />}>
      <SearchInput />
    </Suspense>
  );
}