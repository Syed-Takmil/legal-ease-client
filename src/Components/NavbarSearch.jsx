'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; 
import { Magnifier } from '@gravity-ui/icons';

function SearchInput() {
  const path = usePathname();
  const router = useRouter();       
  const searchParams = useSearchParams(); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Added state to hold the live backend data directly inside this component
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const currentSearch = searchParams.get('search');
    if (currentSearch) {
      setSearchQuery(currentSearch);
    } else if (path !== '/browse') {
      setSearchQuery('');
    }
  }, [searchParams, path]);

  // LIVE API CALL EFFECT: Runs whenever the user types into the search box
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const cleanBaseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "");

    // Directly hitting the Express backend route we created
    fetch(`${cleanBaseUrl}/browse?search=${encodeURIComponent(searchQuery.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSearchResults(data.data || []); // Your backend data is now here!
          console.log("Found lawyers accurately:", data.data);
        }
      })
      .catch((err) => console.error("Search API execution fault:", err));
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  return (
    <div className="relative w-full">
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

      {/* DROPDOWN PREVIEW: Displays live backend data right below your input bar */}
      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
          {searchResults.map((lawyer) => (
            <div 
              key={lawyer._id} 
              onClick={() => {
                router.push(`/lawyers/${lawyer.userId || lawyer._id}`);
                setSearchResults([]);
              }}
              className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
            >
              <p className="text-xs font-bold text-black dark:text-white">{lawyer.name}</p>
              <p className="text-[10px] text-purple-500 font-medium tracking-wide uppercase">{lawyer.specialization}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavbarSearch() {
  return (
    <Suspense fallback={<div className="h-10 w-full bg-neutral-100 dark:bg-base-200 animate-pulse rounded-lg" />}>
      <SearchInput />
    </Suspense>
  );
}