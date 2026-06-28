


'use client';

import React, { useState, useEffect } from 'react';
import LawyerCard from '@/Components/LawyerCard';
import LawyerSkeleton from '@/Components/LawyerSkeleton';
import { Magnifier, CircleXmark } from '@gravity-ui/icons';

const SPECIALIZATIONS = [
  "All Categories",
  "Corporate Law",
  "Criminal Defense",
  "Family & Divorce Law",
  "Intellectual Property",
  "Labor & Employment",
  "Real Estate & Property Law",
  "Tax & Fiscal Law",
  "Cyber Security & Data Privacy"
];

export default function BrowseLawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search Local States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        
        // Using native fetch instead of axios
        const response = await fetch('http://localhost:5000/lawyers');
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();

        if (result?.success) {
          setLawyers(result.data);
        } else {
          setError(result?.message || "Failed to parse legal catalog.");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Frontend Lawyer Fetch Error:", err);
        setError("Could not retrieve legal catalog. Please check your backend connection.");
        setLoading(false);
      }
    };
    
    fetchLawyers();
  }, []);

  // Filter logic remains reactive and clean
  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = 
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.bio.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      lawyer.specialization.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Sorting handlers
  const sortedLawyers = [...filteredLawyers].sort((a, b) => {
    if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'price-high') return b.hourlyRate - a.hourlyRate;
    return 0;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-neutral-200 p-4 sm:p-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-neutral-900 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
            Explore <span className="text-orange-500">Legal Advisors</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Review professional specializations, view hourly rates, and hire vetted attorneys. Public access requires no authentication profiles.
          </p>
        </div>

        {/* Controls */}
        <div className="flex  flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-neutral-800 p-4 rounded-xl shadow-md w-full">
          
          {/* Search box */}
          <div className="relative w-full md:max-w-md">
            <span className=" w-5 h-5  absolute border-3 border-black bott left-7 flex items-center pl-3 pointer-events-none cursor-crosshair text-zinc-500">
              <Magnifier className="bg-black border-black text-black w-5 h-5" />
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search legal counselors by name, bio keywords..."
              className="input bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-800 w-full pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none transition-colors h-10 rounded-lg text-black dark:text-white"
            />
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-fit md:w-auto justify-end">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select w-sm text-black bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-800 text-sm h-10 rounded-lg  dark:text-zinc-300 focus:border-orange-500 focus:outline-none px-3"
            >
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select w-sm text-black bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-800 text-sm h-10 rounded-lg dark:text-zinc-300 focus:border-orange-500 focus:outline-none px-3"
            >
              <option value="default">Sort Options</option>
              <option value="price-low">Fee: Low to High</option>
              <option value="price-high">Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Dynamic States Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, idx) => <LawyerSkeleton key={idx} />)}
          </div>
        ) : sortedLawyers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 dark:border border-dashed border-neutral-800 rounded-2xl bg-white dark:bg-[#0d0d0d]/40 max-w-md mx-auto space-y-3">
            <CircleXmark className="w-8 h-8 text-orange-500/80" />
            <h3 className="text-lg font-bold text-black dark:text-white">No Advocates Located</h3>
            <p className="text-xs text-black dark:text-zinc-400 leading-relaxed">
              We couldn't track down any verified lawyer records aligning with your active search terms or category adjustments.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All Categories'); setSortBy('default'); }}
              className="btn btn-sm bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs text-orange-400 font-medium tracking-wide mt-2 px-4 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedLawyers.map((lawyer) => (
              <LawyerCard key={lawyer._id || lawyer.id} lawyer={lawyer} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}