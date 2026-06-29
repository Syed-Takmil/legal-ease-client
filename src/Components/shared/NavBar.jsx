

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { 
  ArrowRightFromSquare, 
  Bars, 
  House,
  PlanetEarth,
  Dice4
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

  const DashBoardLink = 
    userRole === "user" ? "/dashboard/user" : 
    userRole === "admin" ? "/dashboard/admin" : 
    "/dashboard/lawyer";

  const links = (
    <>
      <NavLink href={'/'}>Home</NavLink>
      <NavLink href={'/browse'}>Browse Lawyers</NavLink>
      <NavLink href={DashBoardLink}>DashBoard</NavLink>
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
        href={DashBoardLink}
        className={`flex rounded-xl gap-2 p-2 justify-items-center items-center ${path.startsWith('/dashboard') ? 'text-orange-600 dark:text-orange-500 bg-base-300 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:text-orange-500 hover:bg-base-300'}`}
      >
        <Dice4/> DashBoard
      </Link>
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

          {/* Desktop Search Bar (Wrapped in Suspense internally inside NavbarSearch) */}
          <div className="navbar-center hidden md:flex lg:w-1/4 w-fit max-w-md">
            <NavbarSearch/>
          </div>

          <div className="navbar-end lg:w-2/4 gap-4">
            <div className="hidden lg:flex items-center gap-4 text-neutral-700 dark:text-neutral-300">
              {links}
            </div>
            <div className='hidden lg:block h-6 border-l border-neutral-200 dark:border-neutral-800'></div>
            {
              user && user.image ?
              <div className='flex items-center gap-2'>
                <Image 
                  width={48} 
                  height={48} 
                  src={user.image} 
                  alt='profile pic'
                  className='rounded-full w-12 h-12 object-cover border border-neutral-200 dark:border-neutral-800 p-1'
                />
                <button onClick={handleLogout} className='btn rounded-xl bg-orange-600 hover:bg-orange-700 text-white border-none'>
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
        <div className="menu p-4 w-60 md:w-80 min-h-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-r border-neutral-200 dark:border-neutral-900 space-y-4 shadow-xl transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-900">
            <Logo />
          </div>
          
          {/* Mobile Search Input (Reused the responsive component) */}
          <div className="md:hidden w-full">
            <NavbarSearch />
          </div>

          <ul className="space-y-1 text-lg grid">
            {sideLinks}
          </ul>
        </div>
      </div>
    </div>
  );
}