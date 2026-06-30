'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/app/lib/auth-client';
import { CreditCard, ShieldCheck, Briefcase, Star, Eye } from '@gravity-ui/icons';
import CheckRole from '@/app/lib/actions/CheckRole';
import { useRouter } from 'next/navigation';

export default function LawyerDashboardHome() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [profile, setProfile] = useState(null); 
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [licensing, setLicensing] = useState(false);

  useEffect(() => {
    if (!authLoading && !CheckRole("lawyer")) {
      router.push("/unauthorized");
    }
  }, [authLoading, router]);

  useEffect(() => {
    if (authLoading || !user?.id) return;

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_URL}/lawyers/${user.id}`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_URL}/hires/lawyer/${user.id}`).then(res => res.json())
    ])
      .then(([profileRes, hiresRes]) => {
        if (profileRes.success) setProfile(profileRes.data);
        if (hiresRes.success) setHires(hiresRes.data);
      })
      .catch(err => console.error("Error reading dashboard state parameters:", err))
      .finally(() => setLoading(false));
  }, [user?.id, authLoading]);

  const handleLicensePayment = async (e) => {
    e.preventDefault();
    try {
      setLicensing(true);
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType: 'lawyer_license' })
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        alert(data.error || "Failed to trigger licensing payment routing configuration.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLicensing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-zinc-500">
        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-widest font-mono">Loading Dashboard Workspace...</p>
      </div>
    );
  }

  if (!profile?.isPaid) {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-purple-500 dark:text-white tracking-tight">LegalEase Premium Portal</h1>
          <p className="text-xs text-zinc-400">Unlock your digital public registry listing card placement.</p>
        </div>

        <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-6 space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto text-purple-400">
            <CreditCard className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-black dark:text-white">One-Time Publishing Placement Fee</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Pay once to retain lifetime editing, case metrics logging, tracking history, and dashboard search visibility.
            </p>
            <div className="text-3xl font-black text-purple-400 pt-3">$149<span className="text-xs text-zinc-500 font-normal"> / fixed license</span></div>
          </div>

          <form onSubmit={handleLicensePayment}>
            <button
              type="submit"
              disabled={licensing}
              className="w-full h-11 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {licensing ? 'Syncing Gateway...' : 'Secure Placement License'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!profile?.specialization) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5">
        <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-orange-500 dark:text-white">Workspace License Activated</h2>
          <p className="text-xs text-zinc-400">Your licensing node is active. Complete profile parameters to populate directory charts.</p>
        </div>
        <Link
          href="/dashboard/lawyer/profile"
          className="inline-flex items-center justify-center h-11 px-6 bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold rounded-xl transition-all"
        >
          Initialize Directory Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Counsel Center: Advocate Node</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Track case load request configurations and listing exposure metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${profile?.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Listing State: {profile?.isPublished ? 'Live on Registry' : 'Offline / Hidden'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Allocated Files</span>
            <Briefcase className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white">{hires.length}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Pending Approvals</span>
            <Eye className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-500">{hires.filter(h => h.status === 'pending').length}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Assigned Fee Rate</span>
            <Star className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-purple-400">
            ${profile?.hourlyRate || profile?.fee || 0}
            <span className="text-xs text-zinc-600 font-normal"> / hr</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Hiring System History Records</h3>
        <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl overflow-hidden">
          {hires.length === 0 ? (
            <p className="p-6 text-xs text-zinc-500 text-center">No hiring consultation files mapped to this lawyer node yet.</p>
          ) : (
            <div className="divide-y divide-neutral-900 overflow-x-auto">
              {hires.map((record) => (
                <div key={record._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-zinc-200">Client ID: {record.userId ? record.userId.slice(-8) : 'Anonymous'}</p>
                    <p className="text-[10px] text-zinc-500">{new Date(record.requestDate || record.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <span className="text-zinc-400 font-mono">${record.fee || 'Retainer'}</span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      record.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                      record.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}