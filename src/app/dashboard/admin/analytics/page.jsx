'use client';

import { authClient } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation'; // FIX: Replaced raw redirect with router hook
import React, { useState, useEffect } from 'react';

export default function AdminAnalyticsDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  // Clean, unconditional role assessment at the top level
  const isAdmin = !isPending && session?.user?.role === "admin";

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalHires: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // 1. Structural Security Routing Guard Loop
  useEffect(() => {
    if (isPending) return;

    if (!session || !isAdmin) {
      router.push("/unauthorized");
    }
  }, [session, isPending, isAdmin, router]);

  // 2. Data Fetching Sync with Component Unmount Guard
  useEffect(() => {
    if (isPending || !isAdmin) return;
    
    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_URL}/admin/analytics-summary`)
      .then(res => res.json())
      .then(res => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setMetrics(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [session, isPending, isAdmin]);

  // 3. Complete Security Render Gate to eliminate layout flashing
  if (isPending || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-500 min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-wider">Authenticating...</p>
      </div>
    );
  }

  // Configured with rigid defensive programming fallbacks to stop crash risks on null/undefined numbers
  const cardConfig = [
    { label: 'Total Registered Users', value: metrics.totalUsers, format: (v) => Number(v || 0).toLocaleString() },
    { label: 'Accredited Attorneys', value: metrics.totalLawyers, format: (v) => Number(v || 0).toLocaleString() },
    { label: 'Successful Retainers', value: metrics.totalHires, format: (v) => Number(v || 0).toLocaleString() },
    { label: 'Gross Platform Revenue', value: metrics.totalRevenue, format: (v) => `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, highlight: true },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">System Performance Engine</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Aggregated Key Performance Indicators across the LegalEase platform cluster.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800/80 rounded-xl animate-pulse" />
          ))
        ) : (
          cardConfig.map((card, idx) => (
            <div 
              key={idx} 
              className={`p-5 bg-white dark:bg-[#0d0d0d] border rounded-xl space-y-2 flex flex-col justify-center min-h-[112px] shadow-sm dark:shadow-none transition-all ${
                card.highlight 
                  ? 'border-orange-200 dark:border-orange-500/20 bg-gradient-to-br from-orange-50/50 to-orange-100/20 dark:from-[#0d0d0d] dark:to-orange-950/10' 
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{card.label}</span>
              <span className={`text-3xl font-black tracking-tight ${card.highlight ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-900 dark:text-white'}`}>
                {card.format(card.value)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}