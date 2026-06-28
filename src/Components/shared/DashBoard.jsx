



import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const DashBoard = ({menuItems}) => {
    const pathname=usePathname()
    return ( 
        <aside className="w-64  bg-gray-200 min-h-screen dark:bg-[#0d0d0d] border-r border-neutral-900 rounded-lg p-4 hidden md:flex flex-col gap-1 shrink-0">
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
    );
};

export default DashBoard;