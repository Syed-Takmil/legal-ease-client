'use client';

import React, { useEffect } from 'react';
import { Hand, LayoutCellsLarge } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;
  console.log(user)

  // Evaluate the user status inline cleanly
  const isUser = !authLoading && user && user.role === 'user';

  useEffect(() => {
    if (authLoading) return;

    // Redirect if unauthorized
    if (!session || !isUser) {
      router.push("/unauthorized");
    }
  }, [session, authLoading, isUser, router]);

  // While loading or if session isn't validated yet, show the loader safely
  if (authLoading || !session || !isUser) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-zinc-500 text-xs font-mono animate-pulse uppercase tracking-widest">
        Validating Security Node...
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white min-h-screen dark:bg-black">
      <div className='flex items-center text-black dark:text-orange-400 text-3xl gap-5'>
        <span className='p-2.5 rounded-xl bg-orange-500/10 dark:text-orange-400 border border-orange-500/10'>
          <Hand />
        </span>
        <div>Welcome Back, {user?.name}!!</div>
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