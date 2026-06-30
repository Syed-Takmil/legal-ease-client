'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { 
  ArrowRightFromSquare, 
  Bars, 
  House,
  PlanetEarth,
  Dice4,
  ChevronDown
} from '@gravity-ui/icons';
import NavLink from './NavLink';
import { authClient } from '@/app/lib/auth-client';
import Image from 'next/image';
import Logo from './Logo';
import NavbarSearch from '../NavbarSearch';

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userRole = user?.role;
  const path = usePathname();
  
  // State to manage dropdown behaviors
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDashDropdownOpen, setIsDashDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const dashDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (dashDropdownRef.current && !dashDropdownRef.current.contains(event.target)) {
        setIsDashDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to generate sub-navigation based on role
  const getDashboardLinks = (role) => {
    switch(role) {
      case 'user':
        return [
          { name: 'Hiring History', href: '/dashboard/user/hiring-history' },
          { name: 'Update Profile', href: '/dashboard/user/update-profile' },
          { name: 'Comment Management', href: '/dashboard/user/comments' },
          { name: 'Transaction History', href: '/dashboard/user/transaction-history' },
        ];
      case 'lawyer':
        return [
          { name: 'Hiring History', href: '/dashboard/lawyer/hiring-history' },
          { name: 'Manage Profile', href: '/dashboard/lawyer/manage-legal-profile' },
          { name: 'Transaction History', href: '/dashboard/lawyer/transaction-history' },
        ];
      case 'admin':
        return [
          { name: 'Manage Users', href: '/dashboard/admin/manage-users' },
          { name: 'All Transactions', href: '/dashboard/admin/all-transactions' },
          { name: 'Analytics', href: '/dashboard/admin/analytics' },
        ];
      default:
        return [];
    }
  };

  const roleDashboardLinks = getDashboardLinks(userRole);

  const links = (
    <>
      <NavLink href={'/'}>Home</NavLink>
      <NavLink href={'/browse'}>Browse Lawyers</NavLink>
      
      {/* Desktop Dashboard Dropdown */}
      {user && roleDashboardLinks.length > 0 && (
        <div className="relative" ref={dashDropdownRef}>
          <button 
            onClick={() => setIsDashDropdownOpen(!isDashDropdownOpen)}
            className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${path.startsWith('/dashboard') ? 'text-orange-600 dark:text-orange-500' : 'hover:text-orange-600'}`}
          >
            Dashboard <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDashDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDashDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-2 z-50">
              <Link 
                href={userRole === 'admin' ? '/dashboard/admin/analytics' : `/dashboard/${userRole}`}
                onClick={() => setIsDashDropdownOpen(false)}
                className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                Overview ({userRole})
              </Link>
              <div className="border-t border-neutral-100 dark:border-neutral-800 my-1"></div>
              {roleDashboardLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsDashDropdownOpen(false)}
                  className={`block px-4 py-2 text-sm transition-colors ${path === link.href ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-500 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  const sideLinks = (
    <>
      <Link 
        href={'/'}
        className={`flex gap-2 rounded-xl p-2 items-center ${path === '/' ? 'bg-base-300 text-orange-600 dark:text-orange-500 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500'}`}
      > 
        <House/> Home
      </Link>
      <Link 
        href={'/browse'}
        className={`flex rounded-xl gap-2 p-2 items-center ${path === '/browse' ? 'bg-base-300 text-orange-600 dark:text-orange-500 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:text-orange-500 hover:bg-base-300'}`}
      >  
        <PlanetEarth/> Browse Lawyers
      </Link>

      {/* Mobile Responsive Accordion Menu for Dashboard */}
      {user && roleDashboardLinks.length > 0 && (
        <div className="space-y-1">
          <div className={`flex rounded-xl gap-2 p-2 items-center text-neutral-700 dark:text-neutral-300 ${path.startsWith('/dashboard') ? 'bg-base-300 font-medium' : ''}`}>
            <Dice4/> <span>Dashboard ({userRole})</span>
          </div>
          <ul className="pl-6 space-y-1 border-l-2 border-neutral-200 dark:border-neutral-800 ml-4">
            {roleDashboardLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={`block p-2 text-sm rounded-lg transition-colors ${path === link.href ? 'text-orange-600 dark:text-orange-500 font-medium bg-neutral-100 dark:bg-neutral-900' : 'text-neutral-600 dark:text-neutral-400 hover:text-orange-500'}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="drawer mx-auto w-full transition-colors duration-200">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" /> 
      
      <div className="drawer-content flex flex-col w-full bg-base-100 text-neutral-900 dark:text-neutral-100">
        
        <div className="navbar border-b border-neutral-200 dark:border-neutral-900 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md sticky top-0 z-40 shadow-sm p-0 md:px-4 lg:px-8 w-full transition-colors duration-200">
          
          <div className="navbar-start lg:w-1/4">
            <label htmlFor="navbar-drawer" aria-label="open sidebar" className="btn btn-ghost btn-circle lg:hidden text-neutral-800 dark:text-neutral-200">
              <Bars/>
            </label>
            <Link href="/" >
              <Logo />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="navbar-center hidden md:flex lg:w-1/4 w-fit max-w-md">
            <NavbarSearch/>
          </div>

          <div className="navbar-end lg:w-2/4 gap-4">
            <div className="hidden lg:flex items-center gap-6 text-neutral-700 dark:text-neutral-300">
              {links}
            </div>
            <div className='hidden lg:block h-6 border-l border-neutral-200 dark:border-neutral-800'></div>
            {
              user && user.image ?
              /* Profile Pic Dropdown Container */
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none transition-transform active:scale-95"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <Image 
                    width={48} 
                    height={48} 
                    src={user.image} 
                    alt='profile pic'
                    className='rounded-full w-12 h-12 object-cover border border-neutral-200 dark:border-neutral-800 p-1 hover:border-orange-500 dark:hover:border-orange-500 transition-colors'
                  />
                </button>

                {/* Dropdown Menu Overlay */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-2">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="px-2">
                      <button 
                        onClick={handleLogout} 
                        className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors'
                      >
                        Sign Out 
                        <ArrowRightFromSquare className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              :
              <div className='flex items-center gap-3 px-2 sm:px-0'>
                <Link href={'/login'}><button className='cursor-pointer text-orange-600 dark:text-orange-500 font-semibold text-sm hover:opacity-80 transition-opacity'>Sign In</button></Link>
                <Link href={"/register"}><button className='btn btn-sm sm:btn-md bg-orange-500 hover:bg-orange-600 text-white border-none rounded-3xl font-medium transition-colors'>Get Started</button></Link>
              </div>
            }
          </div>
        </div>

      </div> 

      {/* Mobile Responsive Drawer Side Panel */}
      <div className="drawer-side z-[9999]">
        <label htmlFor="navbar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-60 md:w-80 min-h-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-r border-neutral-200 dark:border-neutral-900 space-y-4 shadow-xl transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-900">
            <Logo />
          </div>
          
          {/* Mobile Search Input */}
          <div className="md:hidden w-full">
            <NavbarSearch />
          </div>

          <div className="space-y-3 text-lg">
            {sideLinks}
          </div>
        </div>
      </div>
    </div>
  );
}