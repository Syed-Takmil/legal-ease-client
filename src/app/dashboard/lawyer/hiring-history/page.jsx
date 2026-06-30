'use client';

import React, { useState, useEffect } from 'react';
import { Check, Xmark } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';
import CheckRole from '@/app/lib/actions/CheckRole';
import { useRouter } from 'next/navigation';

export default function LawyerHiringHistoryPage() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const lawyer = session?.user;

  // Unconditionally execute the role checking hook at the top level
  const hasLawyerRole = CheckRole("lawyer");
  const isLawyer = !authLoading && hasLawyerRole;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Security Check Routing Loop
  useEffect(() => {
    if (authLoading) return;

    if (!session || !isLawyer) {
      router.push("/unauthorized");
    }
  }, [session, authLoading, isLawyer, router]);

  // 2. Clear Inbound Requests Data Sync
  useEffect(() => {
    if (authLoading || !lawyer?.id || !isLawyer) return;

    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_URL}/hires/lawyer/${lawyer.id}`)
      .then(res => res.json())
      .then(res => {
        if (!isMounted) return;
        if (res.success) setRequests(res.data || []);
      })
      .catch((err) => {
        console.error("Error syncing requests:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lawyer?.id, authLoading, isLawyer]);

  const handleAction = async (requestId, decision) => {
    const confirmationText = decision === 'active' ? 'accept' : 'reject';
    if (!confirm(`Are you sure you want to ${confirmationText} this hiring request?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/hires/lawyer/action/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision }) 
      });
      
      if (res.ok) {
        setRequests(requests.map(req => 
          req._id === requestId ? { ...req, status: decision } : req
        ));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const isDataLoading = authLoading || loading;

  return (
    <div className="space-y-6 bg-white text-black dark:bg-black dark:text-white p-6">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white">Client Retainer Inquiries</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage and review your inbound professional hiring proposals.</p>
      </div>

      <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-zinc-500 dark:text-zinc-400 font-medium text-xs tracking-wider uppercase">
                <th className="p-4">Client Name</th>
                <th className="p-4">Request Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-900/60 text-zinc-700 dark:text-zinc-300">
              {isDataLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Syncing Intake Files...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-sm text-zinc-500">No active client hiring records found.</td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors">
                    <td className="p-4 font-bold text-black dark:text-white">
                      {request.userName || request.userId?.name || request.clientId?.name || "Unknown Client"}
                    </td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400 text-xs font-mono">
                      {request.requestDate 
                        ? new Date(request.requestDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
                        : 'N/A'
                      }
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-md ${
                        request.status === 'active' || request.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                        request.status === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                        'bg-neutral-100 dark:bg-neutral-900 text-zinc-500 dark:text-zinc-400 border-neutral-200 dark:border-neutral-800'
                      }`}>
                        {request.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {(!request.status || request.status === 'pending') ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleAction(request._id, 'active')} 
                            className="h-8 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(request._id, 'rejected')}
                            className="h-8 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Xmark className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 dark:text-zinc-600 italic px-3">Resolved</span>
                      )}
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