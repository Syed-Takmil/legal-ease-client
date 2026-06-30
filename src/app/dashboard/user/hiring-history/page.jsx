'use client';

import React, { useState, useEffect } from 'react';
import { CardClub } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';
import CheckRole from '@/app/lib/actions/CheckRole';
import { useRouter } from 'next/navigation';

export default function HiringHistoryPage() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  // Run validation unconditionally at the top level to adhere to Rules of Hooks
  const hasUserRole = CheckRole("user");
  const isUser = !authLoading && hasUserRole;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  // Safe client-side role guard redirection loop
  useEffect(() => {
    if (authLoading) return;

    if (!session || !isUser) {
      router.push("/unauthorized");
    }
  }, [session, authLoading, isUser, router]);

  // Synchronize Inbound Client Data Records
  useEffect(() => {
    if (authLoading || !user?.id || !isUser) return;

    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_URL}/hires/user/${user.id}`)
      .then(res => res.json())
      .then(res => {
        if (!isMounted) return;
        if (res.success) {
          setHistory(res.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading, isUser]);

  // Dynamic Stripe Trigger Handler
  const handlePayment = async (recordId) => {
    try {
      setPayingId(recordId);
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceType: 'user_paying_lawyer',
          metadata: { recordId: recordId }
        })
      });
      
      const data = await res.json();
      if (data.url) {
        // Leave payingId set to lock the UI button state while window unloads
        window.location.assign(data.url);
      } else {
        alert(data.error || "Failed to initialize payment gateway.");
        setPayingId(null);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPayingId(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'accepted' || status === 'active')
      return 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60';
    if (status === 'rejected')
      return 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/60';
    return 'bg-gray-100 text-gray-600 border border-gray-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-neutral-800';
  };

  // Top-Level Security Gate: Eliminates dynamic screen flashing for unauthorized requests
  if (authLoading || !isUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-500">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-wider">Validating Node Security...</p>
      </div>
    );
  }

  const isDataLoading = loading;

  return (
    <div className="space-y-6 bg-white text-black dark:bg-black p-6">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white">Hiring Registry</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Track case status updates and process counselor payments.</p>
      </div>

      <div className="dark:bg-[#0d0d0d] bg-white border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white dark:bg-black">
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
                        onClick={() => handlePayment(record._id)}
                        disabled={
                          (record.status !== 'accepted' && record.status !== 'active') || 
                          record.paid || 
                          payingId !== null
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide inline-flex items-center gap-1.5 transition-all ${
                          record.paid
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 cursor-default'
                            : (record.status === 'accepted' || record.status === 'active')
                            ? 'bg-orange-500 text-black hover:bg-orange-400 cursor-pointer'
                            : 'bg-gray-100 border border-gray-300 text-gray-500 dark:bg-neutral-900 dark:border-neutral-800 dark:text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        <CardClub className="w-3.5 h-3.5" />
                        {payingId === record._id ? 'Routing...' : record.paid ? 'Paid' : 'Pay Now'}
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