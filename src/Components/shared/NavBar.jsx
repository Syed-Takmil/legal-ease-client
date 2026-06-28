


'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; 
import { 
  ChevronDown, 
  Magnifier, 
  Person, 
  ArrowRightFromSquare, 
  Bars, 
  House,
  PlanetEarth,
  Dice4
} from '@gravity-ui/icons';
import NavLink from './NavLink';
import Image from 'next/image';
import Logo from './Logo';
import { authClient } from '@/app/lib/auth-client';
import GetUser from '@/app/lib/actions/GetUser';

export default function Navbar() {

    const { data: session,isPending}=authClient.useSession()
    const user=session?.user
 
  const path = usePathname();
  const router = useRouter();             
  const searchParams = useSearchParams(); //  Read current URL params
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Keep search input synced if user changes pages or reloads
  useEffect(() => {
    const currentSearch = searchParams.get('search');
    if (currentSearch) {
      setSearchQuery(currentSearch);
    } else if (path !== '/browse') {
      setSearchQuery(''); // Clear search if navigating away from browse
    }
  }, [searchParams, path]);



  // ✅ Global Search Handler: redirects to browse page with your query parameter
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse'); // If search is cleared, show all
    }
  };

  const links = (
    <>
      <NavLink href={'/'}>Home</NavLink>
      <NavLink href={'/browse'}>Browse Lawyers</NavLink>
      <NavLink href={'/dashboard'}>DashBoard</NavLink>
    </>
  );

  const sideLinks = (
    <>
      <Link 
        href={'/'}
        className={`flex gap-2 rounded-xl p-2 justify-items-center items-center ${path === '/' ? 'bg-base-300 text-orange-600 dark:text-orange-500 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500'}`}
      > 
        <House/> Home
      </Link>
      <Link 
        href={'/browse'}
        className={`flex rounded-xl gap-2 p-2 justify-items-center items-center ${path === '/browse' ? 'bg-base-300 text-orange-600 dark:text-orange-500 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:text-orange-500 hover:bg-base-300'}`}
      >  
        <PlanetEarth/> Browse Lawyers
      </Link>
      <Link 
        href={'/dashboard'}
        className={`flex rounded-xl gap-2 p-2 justify-items-center items-center ${path.startsWith('/dashboard') ? 'text-orange-600 dark:text-orange-500 bg-base-300 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:text-orange-500 hover:bg-base-300'}`}
      >
        <Dice4/> DashBoard
      </Link>
    </>
  );

 

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

          {/* Desktop Search Bar (Always visible) */}
          <div className="navbar-center hidden md:flex lg:w-1/4 w-fit max-w-md">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10 bg-neutral-100 dark:bg-base-200 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-800 text-sm focus:input-primary h-10 rounded-lg placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors"
              />
              <div className="absolute left-3 top-2.5 text-neutral-400 dark:text-neutral-500">
                <Magnifier/>
              </div>
            </form>
          </div>

          <div className="navbar-end lg:w-2/4 gap-4">
            <div className="hidden lg:flex items-center gap-4 text-neutral-700 dark:text-neutral-300">
              {links}
            </div>
            <div className='hidden lg:block h-6 border-l border-neutral-200 dark:border-neutral-800'></div>
            {
              user ?
              <div className='flex items-center gap-2'>
                <Image 
                  width={48} 
                  height={48} 
                  src={user?.image} 
                  alt='profile pic'
                  className='rounded-full w-12 h-12 object-cover border border-neutral-200 dark:border-neutral-800 p-1'
                />
                <button  className='btn rounded-xl bg-orange-600 hover:bg-orange-700 text-white border-none'>
                  Sign Out <ArrowRightFromSquare/>
                </button>
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
        <div className="menu p-4 w-80 min-h-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-r border-neutral-200 dark:border-neutral-900 space-y-4 shadow-xl transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-900">
            <Logo />
          </div>
          {/* Mobile Search Input */}
          <form onSubmit={handleSearch} className="relative w-full md:hidden">
            <input
              type="text"
              placeholder="Search lawyers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 bg-neutral-100 dark:bg-base-300 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-800 text-sm focus:input-primary h-10 rounded-lg placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            <div className="absolute left-3 top-2.5 text-neutral-400 dark:text-neutral-500">
              <Magnifier/>
            </div>
          </form>
          <ul className="space-y-1 text-lg grid">
            {sideLinks}
          </ul>
        </div>
      </div>
    </div>
  );
}