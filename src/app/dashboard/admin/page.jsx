'use client';

import React from 'react';
import {  Hand, LayoutCellsLarge } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';

export default function AdminDashboard() {
 const {data:session,isPending}=authClient.useSession();
      const user = session?.user;
  return (
    <div className="space-y-6  bg-white min-h-screen dark:bg-black">
      {/* WELCOME BANNER HEADLINE */}
    <div className='flex items-center text-black  dark:text-orange-400  text-3xl r gap-5'>
        <span className='p-2.5 rounded-xl bg-orange-500/10  dark:text-orange-400 border border-orange-500/10'>  <Hand></Hand></span>
      <div>Welcome Back, ADMIN  @{user?.name}!!</div>
    </div>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-500/10 text-black dark:text-orange-400 border border-orange-500/10">
          <LayoutCellsLarge className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white">User Workspace Overview</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
             Select an operations track from the control panel panel to proceed.</p>
        </div>
      </div>

    </div>
  );
}