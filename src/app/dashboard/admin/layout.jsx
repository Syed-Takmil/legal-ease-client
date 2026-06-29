'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartPie, CreditCard, ShieldCheck, Bars, Xmark } from '@gravity-ui/icons';

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Analytics Overview', href: '/dashboard/admin/analytics', icon: ChartPie },
    { name: 'All Transactions', href: '/dashboard/admin/all-transactions', icon: CreditCard },
    { name: 'Manage Users', href: '/dashboard/admin/manage-users', icon: ShieldCheck },
  ];

  // This is a plain JSX variable fragment block
  const SideNavLinks = (
    <>
      <div className="px-3 py-4 border-b border-neutral-900 mb-4 hidden md:block">
        <p className="text-xs font-black uppercase tracking-widest text-orange-400">Admin Command Center</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 h-11 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-400 hover:bg-neutral-900 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* MOBILE RESPONSIVE HAMBURGER BAR */}
      <div className="md:hidden w-full h-14 bg-white dark:bg-[#0d0d0d] border-b border-neutral-900 px-4 flex items-center justify-between sticky top-16 z-30">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Admin Panel</span>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center bg-neutral-900 rounded-lg text-zinc-400 hover:text-white"
        >
          {mobileOpen ? <Xmark className="w-5 h-5" /> : <Bars className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[120px] bg-white dark:bg-[#0d0d0d] border-b border-neutral-900 p-4 z-40 shadow-2xl animate-in slide-in-from-top duration-200">
          {/* RENDERED DIRECTLY AS A VARIABLE EXPRESSION */}
          {SideNavLinks}
        </div>
      )}

      {/* FIXED DESKTOP SIDEBAR */}
      <aside className="w-64  bg-white dark:bg-[#0d0d0d] border-r border-neutral-900 p-4 hidden md:flex flex-col shrink-0">
        {/* RENDERED DIRECTLY AS A VARIABLE EXPRESSION */}
        {SideNavLinks}
      </aside>

      {/* CORE CONTENT ROUTER PAGE MOUNT */}
      <main className="flex-1  overflow-y-auto">
        <div className="max-w-5xl  mx-auto">{children}</div>
      </main>
    </div>
  );
}