'use client';

import React, { useEffect } from 'react';
import { Hand, LayoutCellsLarge } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation'; // FIX: Swapped out raw redirect hook

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const user = session?.user;
  const isAdmin = !isPending && user?.role === "admin";

  useEffect(() => {
    if (isPending) return;

    if (!session || !isAdmin) {
      router.push("/unauthorized");
    }
  }, [session, isPending, isAdmin, router]);

  // Loading state gate guarantees user profile string elements can't parse un-evaluated fields
  if (isPending || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-500 min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-wider">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white min-h-screen dark:bg-black p-6">
      {/* WELCOME BANNER HEADLINE */}
      <div className="flex items-center text-black dark:text-orange-400 text-3xl gap-5">
        <span className="p-2.5 rounded-xl bg-orange-500/10 dark:text-orange-400 border border-orange-500/10">
          <Hand />
        </span>
        <div className="font-sans font-bold">Welcome Back, ADMIN @{user?.name || 'User'}!!</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-500/10 text-black dark:text-orange-400 border border-orange-500/10">
          <LayoutCellsLarge className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white">User Workspace Overview</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select an operations track from the control panel to proceed.
          </p>
        </div>
      </div>
    </div>
  );
}