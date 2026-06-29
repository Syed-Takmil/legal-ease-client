

'use client';

import React, { useState, useEffect } from 'react';
import { TrashBin, ShieldCheck } from '@gravity-ui/icons';

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users array from the Express server node
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/users`)
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (Array.isArray(res)) {
          setUsers(res); // Fallback if data array is sent un-nested
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user indexes:", err);
        setLoading(false);
      });
  }, []);

  const handleChangeRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'user' ? 'lawyer' : currentRole === 'lawyer' ? 'admin' : 'user';
    if (!confirm(`Elevate/Change target identity matrix node to: [${nextRole.toUpperCase()}]?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setUsers(prevUsers => prevUsers.map(u => u._id === userId ? { ...u, role: nextRole } : u));
      } else {
        alert(data.message || "Failed to update target user role configuration node.");
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('DANGER: Irreversibly delete this user account from cluster index files?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/users/${userId}`, { 
        method: 'DELETE' 
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      } else {
        alert(data.message || "Failed to remove user node context record.");
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Identity Access Registry</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Modify workspace operational permissions and delete obsolete accounts.</p>
      </div>

      <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-neutral-50 dark:border-neutral-900 dark:bg-neutral-950 text-neutral-700 dark:text-zinc-400 font-medium text-xs tracking-wider uppercase">
                <th className="p-4">Identified User</th>
                <th className="p-4">Email Coordinates</th>
                <th className="p-4">System Role Tag</th>
                <th className="p-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900/60 text-neutral-800 dark:text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-xs text-purple-500 uppercase tracking-widest animate-pulse font-mono">
                    Parsing Records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-sm text-zinc-500">
                    No registered profiles mapped to database nodes.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors">
                    <td className="p-4 font-bold text-neutral-900 dark:text-white">
                      {user.name || 'Anonymous User'}
                    </td>
                    <td className="p-4 text-neutral-600 dark:text-zinc-400 text-xs font-mono">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-md ${
                        user.role === 'admin' ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/50' :
                        user.role === 'lawyer' ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' :
                        'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-zinc-400 border-neutral-200 dark:border-neutral-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleChangeRole(user._id, user.role)}
                          className="h-8 px-3 rounded-lg border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Toggle Role
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user._id)}
                          className="h-8 px-3 rounded-lg border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <TrashBin className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
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