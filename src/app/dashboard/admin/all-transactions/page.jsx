
'use client';

import { authClient } from '@/app/lib/auth-client';
import { redirect } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function AdminTransactionsLedgerPage() {
  const { data: session, isPending } = authClient.useSession();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth and Data Fetching Logic
  useEffect(() => {
    if (isPending) return;

    // Security Check
    if (!session || session.user?.role !== "admin") {
      redirect("/unauthorized");
    }

    // Fetch Transactions
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/admin/transactions`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const result = await res.json();
        // Assuming your API returns { success: true, data: [...] }
        setTxns(result.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session, isPending]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? 'Pending' : parsedDate.toLocaleDateString();
  };

  if (isPending) return <div className="p-10">Loading security protocols...</div>;

  return (
     <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Financial Audit Clearinghouse</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Cross-examine continuous system-wide retainment transaction captures from database storage.</p>
      </div>

      <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-zinc-400 font-medium text-xs tracking-wider uppercase">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Client (Payer)</th>
                <th className="p-4">Lawyer (Counsel)</th>
                <th className="p-4">Settled Amount</th>
                <th className="p-4 text-right">Clearing Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900/60 text-neutral-800 dark:text-zinc-300 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-xs text-purple-500 uppercase tracking-widest animate-pulse font-sans">
                    Compiling Accounting Invoices from Database Records...
                  </td>
                </tr>
              ) : txns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-sm text-zinc-500 font-sans">
                    No payment ledgers captured to date.
                  </td>
                </tr>
              ) : (
                txns.map((txn) => (
                  <tr key={txn._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors">
                    {/* Transaction ID */}
                    <td className="p-4 font-mono text-orange-600 dark:text-orange-400 font-bold select-all">
                      {txn.transactionId || 'N/A'}
                    </td>
                    
                    {/* Client Column */}
                    <td className="p-4 font-sans">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {txn.userEmail.split('@')[0]} {/* Fallback name clean up if needed */}
                      </div>
                      <div className="text-[11px] text-zinc-400">{txn.userEmail}</div>
                    </td>

                    {/* Lawyer Column */}
                    <td className="p-4 font-sans">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        Legal Counsel
                      </div>
                      <div className="text-[11px] text-zinc-400">{txn.lawyerEmail}</div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold text-sm font-sans">
                      ${Number(txn.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-neutral-500 dark:text-zinc-500 text-right font-sans">
                      {formatDate(txn.date)}
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