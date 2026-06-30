'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/app/lib/auth-client';
import { CardDiamond } from '@gravity-ui/icons';
import { useRouter } from 'next/navigation';

export default function UserTransactionHistoryPage() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  // Safely check user role
  const isUser = !authLoading && user && user.role === 'user';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Client-side route guard protection
  useEffect(() => {
    if (authLoading) return;

    if (!session || !isUser) {
      router.push("/unauthorized");
    }
  }, [session, authLoading, isUser, router]);

  // Fetch the transactions using your synced endpoint structure
  useEffect(() => {
    if (authLoading || !user?.id || !isUser) return;
    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_URL}/transactions/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) setTransactions(data.data || []);
      })
      .catch((err) => console.error("Error loading user payments:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [user?.id, authLoading, isUser]);

  if (authLoading || !isUser) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-zinc-500 text-xs font-mono animate-pulse uppercase tracking-widest">
        Validating Ledger Security...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-zinc-500 text-xs font-mono animate-pulse uppercase tracking-widest">
        Syncing Payment Ledger...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white text-black dark:bg-black min-h-screen">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            <CardDiamond className="w-5 h-5 text-purple-500 animate-pulse" />
            Your Payments Ledger
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Review licensing logs and retainer invoices assigned to your account profile.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">No payment transaction blocks found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-zinc-400 font-medium text-xs uppercase tracking-wider">
                  <th className="p-4">Transaction Reference ID</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-900 text-zinc-700 dark:text-zinc-300">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors">
                    {/* Maps flawlessly to transactionId string format from your backend */}
                    <td className="p-4 font-mono text-xs text-purple-500">
                      {tx.transactionId ? tx.transactionId.slice(-16) : tx._id}
                    </td>
                    <td className="p-4 text-xs font-medium">
                      {tx.priceType === 'lawyer_license' 
                        ? 'Lifetime Placement License' 
                        : 'Retainer Consultation Deposit'}
                    </td>
                    <td className="p-4 text-xs text-zinc-400 font-mono">
                      {tx.createdAt 
                        ? new Date(tx.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
                        : 'Recent'
                      }
                    </td>
                    <td className="p-4 text-right font-bold text-black dark:text-white">
                      ${tx.amount}
                    </td>
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