'use client';

import React, { useState, useEffect } from 'react';
import { CardClub } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';

export default function HiringHistoryPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until auth state is confirmed and user data is present
    if (authLoading || !user?.id) return;

    fetch(`http://localhost:5000/hires/user/${user.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setHistory(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
  }, [user?.id, authLoading]);

  const getStatusStyle = (status) => {
    if (status === 'accepted') return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60';
    if (status === 'rejected') return 'bg-red-950/40 text-red-400 border-red-900/60';
    return 'bg-zinc-900 text-zinc-400 border-neutral-800';
  };

  // Keep the component loading while authentication is initializing
  const isDataLoading = authLoading || loading;

  return (
    <div className="space-y-6 bg-white text-black  dark:bg-black">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white">Hiring Registry</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Track case status updates and process counselor payments.</p>
      </div>

      <div className="dark:bg-[#0d0d0d] bg-white border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className='bg-white dark:bg-black'>
              <tr className="border-b border-neutral-900 bg-white dark:bg-neutral-950 dark:text-zinc-400 font-medium text-xs tracking-wider uppercase">
                <th className="p-4">Lawyer Info</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Fee Structure</th>
                <th className="p-4">Hiring Date</th>
                <th className="p-4">Action Status</th>
                <th className="p-4 text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60">
              {isDataLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-xs text-zinc-500 uppercase tracking-widest animate-pulse">
                    Streaming Cases...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm text-zinc-500">No active hiring dockets logged.</td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record._id} className="hover:bg-neutral-900/20 transition-colors">
                    <td className="p-4 font-bold text-black dark:text-white">{record.lawyerName}</td>
                    <td className="p-4 text-black dark:text-zinc-400 text-xs">{record.specialization}</td>
                    <td className="p-4 text-black dark:text-white font-medium">${record.fee} <span className="text-[10px] text-zinc-500">/ hr</span></td>
                    <td className="p-4 text-black dark:text-zinc-400 text-xs">
                      {record.requestDate 
                        ? new Date(record.requestDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                        : 'N/A'
                      }
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-md ${getStatusStyle(record.status)}`}>
                        {record.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={record.status !== 'accepted'}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide inline-flex items-center gap-1.5 transition-all ${
                          record.status === 'accepted'
                            ? 'bg-orange-500 text-black hover:bg-orange-400'
                            : 'bg-neutral-900 border border-neutral-800 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        <CardClub className="w-3.5 h-3.5" /> Pay Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}