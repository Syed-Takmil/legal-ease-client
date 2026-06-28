



"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
const NavLink = ({children,href}) => {
     const path=usePathname();
        const isActive= href==path
    return (
       
<Link className={`${isActive?"border-b-2 text-amber-400 border-b-orange-500":"hover:text-amber-500"}`} href={href}>{children}</Link>
    );
};

export default NavLink;