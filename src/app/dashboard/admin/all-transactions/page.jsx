"use client";

import React, { useState, useEffect } from 'react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint root URL if needed
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/admin/transactions`)

        const resData = await response.json();
        if (resData.success) {
          setTransactions(resData.data);
        } else {
          throw new Error(resData.message || "Failed to fetch master ledger records.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, []);

  // Filter logic for quick searching across IDs and emails
  const filteredTransactions = transactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    return (
      tx.transactionId?.toLowerCase().includes(term) ||
      tx.userEmail?.toLowerCase().includes(term) ||
      tx.lawyerEmail?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded shadow-sm">
          <p className="font-bold">System Connection Failure</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Master Financial Ledger</h1>
            <p className="text-sm text-gray-500 mt-1">Global audit view of all transactions processed via platform hooks.</p>
          </div>
          
          {/* Quick Search */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search TXID, User or Lawyer Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Lawyer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Type / Hire Link</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                      No ledger matching parameters found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* TX ID */}
                      <td className="px-6 py-4 font-mono text-xs text-gray-600 font-medium">
                        {tx.transactionId}
                      </td>
                      
                      {/* Timestamp */}
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(tx.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>

                      {/* User Email */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{tx.userName || "—"}</div>
                        <div className="text-xs text-gray-400">{tx.userEmail || "no-email@logged"}</div>
                      </td>

                      {/* Lawyer Email */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{tx.lawyerName || "—"}</div>
                        <div className="text-xs text-gray-400">{tx.lawyerEmail || "no-email@logged"}</div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${Number(tx.amount).toFixed(2)}
                      </td>

                      {/* Scope Description */}
                      <td className="px-6 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded block w-fit mb-1">
                          {tx.priceType}
                        </span>
                        {tx.hireId ? (
                          <span className="text-[11px] font-mono text-blue-500">Hire: {tx.hireId}</span>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Direct Deposit</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          tx.status === 'succeeded' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Summary Footer bar */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between text-xs text-gray-500">
            <div>
              Showing <b>{filteredTransactions.length}</b> records out of <b>{transactions.length}</b> total lines.
            </div>
            <div className="font-semibold text-gray-700">
              Filtered Sum: ${filteredTransactions.reduce((acc, current) => acc + Number(current.amount), 0).toFixed(2)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}