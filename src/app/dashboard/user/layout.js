


'use client';

import { Briefcase, Comment, LayoutGrid, LayoutCellsLarge, Person } from '@gravity-ui/icons';
import DashBoard from '@/Components/shared/DashBoard';
 function UserDashboardLayout({ children }) {

  const menuItems = [
   
    { name: 'Hiring History', href: '/dashboard/user/hiring-history', icon: Briefcase },
    { name: 'Update Profile', href: '/dashboard/user/update-profile', icon: Person },
    { name: 'My Comments', href: '/dashboard/user/comments', icon: Comment },
  ];

  return (
    <div className="min-h-screen h-full bg-white dark:bg-[#0a0a0a] text-neutral-200 flex pt-16">
      {/* SIDEBAR ARCHITECTURE */}
     <DashBoard menuItems={menuItems}/>

      {/* DASHBOARD VIEWS DISPATCHER CONTENT */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default UserDashboardLayout;
