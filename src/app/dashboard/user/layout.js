'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Comment, Person, CardClub } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  // Evaluate the user status inline cleanly
  const isUser = !authLoading && user && user.role === 'user';

  useEffect(() => {
    if (authLoading) return;

    // Kick them out if no session exists or they don't have the right role
    if (!session || !isUser) {
      router.push("/unauthorized");
    }
  }, [session, authLoading, isUser, router]);

  const menuItems = [
    { name: 'Hiring History', href: '/dashboard/user/hiring-history', icon: Briefcase },
    { name: 'Update Profile', href: '/dashboard/user/update-profile', icon: Person },
    { name: 'My Comments', href: '/dashboard/user/comments', icon: Comment },
    { name: 'Transaction History', href: '/dashboard/user/transaction-history', icon: CardClub }
  ];

  // While checking auth state, display a loading state to prevent layout flickering
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-zinc-500 text-xs font-mono animate-pulse uppercase tracking-widest">
        Validating Security Node...
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-white dark:bg-[#0a0a0a] text-neutral-200 flex pt-16">
      {/* SIDEBAR ARCHITECTURE */}
      <aside className="w-64 h-full bg-gray-200 min-h-screen dark:bg-[#0d0d0d] border-r border-neutral-900 p-4 hidden md:flex flex-col gap-1 shrink-0">
        <div className="px-3 py-4 border-b border-neutral-950 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">LegalEase Control Panel</p>
        </div>
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
      </aside>

      {/* DASHBOARD VIEWS DISPATCHER CONTENT */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}