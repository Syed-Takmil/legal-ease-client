'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Gear,  Bars, Xmark } from '@gravity-ui/icons';

export default function LawyerDashboardLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Hiring History', href: '/dashboard/lawyer/hiring-history', icon: Briefcase },
    { name: 'Manage Services', href: '/dashboard/lawyer/manage-legal-profile', icon: Gear },
  ];

  const SideNavLinks = 
    <>
      <div className="px-3 py-4 border-b border-neutral-200 dark:border-neutral-900 mb-4 hidden md:block">
        <p className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">Counsel Workspace</p>
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
                  ? 'bg-purple-600/10 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                  : 'text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>


  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] transition-colors duration-200">
      {/* MOBILE BAR */}
      <div className="md:hidden w-full h-14 bg-neutral-50 dark:bg-[#0d0d0d] border-b border-neutral-200 dark:border-neutral-900 px-4 flex items-center justify-between sticky top-16 z-30 transition-colors duration-200">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Lawyer Panel</span>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-lg text-neutral-600 dark:text-zinc-400"
        >
          {mobileOpen ? <Xmark className="w-5 h-5" /> : <Bars className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[120px] bg-neutral-50 dark:bg-[#0d0d0d] border-b border-neutral-200 dark:border-neutral-900 p-4 z-40 shadow-xl transition-colors duration-200">
          {SideNavLinks }
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-neutral-50 dark:bg-[#0d0d0d] border-r border-neutral-200 dark:border-neutral-900 p-4 hidden md:flex flex-col shrink-0 transition-colors duration-200">
        {SideNavLinks}      
      </aside>

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}