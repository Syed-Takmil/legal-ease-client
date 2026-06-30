'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/app/lib/auth-client';
import { CardDiamond } from '@gravity-ui/icons';

export default function LawyerTransactionHistoryPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const lawyer = session?.user;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !lawyer?.id) return;
    let isMounted = true;

    const cleanBaseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "");

    // Pointing directly to your clean parameters-based endpoint
    fetch(`${cleanBaseUrl}/transactions/lawyer/${lawyer.id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success) setTransactions(data.data || []);
      })
      .catch((err) => console.error("Error loading lawyer workspace earnings:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [lawyer?.id, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-zinc-500 text-xs font-mono animate-pulse uppercase tracking-widest">
        Syncing Processing Ledger...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white text-black dark:bg-black min-h-screen">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
          <CardDiamond className="w-5 h-5 text-purple-500 animate-pulse" />
          Earnings & Licensing Statements
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Track your activated premium workspace licenses and incoming processed client legal retains.</p>
      </div>

      <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">No payout or gateway transactions linked to this counselor node.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-zinc-400 font-medium text-xs uppercase tracking-wider">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Client Source</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Gateway State</th>
                  <th className="p-4 text-right">Gross Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-900 text-zinc-700 dark:text-zinc-300">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-purple-500">
                      {tx.transactionId ? tx.transactionId.slice(-16) : String(tx._id).slice(-16)}
                    </td>
                    <td className="p-4 text-xs font-medium text-black dark:text-zinc-300">
                      {tx.userEmail || "Anonymous Client"}
                    </td>
                    <td className="p-4 text-xs font-mono text-zinc-400">
                      {tx.date || tx.createdAt 
                        ? new Date(tx.date || tx.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
                        : 'Recent'
                      }
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tx.status || 'Succeeded'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-black dark:text-white">${tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}