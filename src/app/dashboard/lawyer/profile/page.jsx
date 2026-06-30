'use client';

import React, { useState, useEffect } from 'react';
import { PencilToLine } from '@gravity-ui/icons';
import Image from 'next/image';
import { authClient } from '@/app/lib/auth-client';
import { redirect, useRouter } from 'next/navigation'; // Changed from redirect
import { toast } from 'react-toastify';
import CheckRole from '@/app/lib/actions/CheckRole';

export default function LawyerManageProfilePage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;
  const router = useRouter(); // Initialize router hook

  if(!CheckRole("lawyer")){
    redirect("/unauthorized")
  }

  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (authLoading || !user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_URL}/lawyers/${user.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProfile(res.data);
        }
      })
      .catch(err => console.error("Database tracking read failure:", err))
      .finally(() => setFetching(false));
  }, [user?.id, authLoading]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const formFields = Object.fromEntries(formData);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/lawyers/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,          
          ...formFields,        
          userId: user.id, // 🔥 CRITICAL FIX: Explicitly pass user.id as the userId foreign key
          hourlyRate: Number(formFields.fee), 
          isPaid: true,        
          isPublished: profile?.isPublished ?? false
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile properties verified and updated.");
        setProfile(prev => ({ ...prev, ...formFields, fee: Number(formFields.fee) }));
        
        // Clean routing transition redirect
        router.push('/dashboard/lawyer');
      } else {
        toast.error(data.message || "Failed to update backend profile parameters.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during submission.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || fetching) {
    return <div className="text-center py-12 text-xs text-zinc-500 font-mono">Syncing Database Workspace Profile Log...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white">Counsel Profile Management</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Configure representation data strings mapped to the public database layout.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="bg-white dark:bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Professional Name</label>
            <input 
              type="text" 
              name="name" 
              required
              defaultValue={profile?.name || ''} 
              className="w-full h-11 px-4 bg-white dark:bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Specialization / Core Practice Area</label>
            <input 
              type="text" 
              name="specialization"
              placeholder="e.g. Criminal Defense, Corporate Law"
              required
              defaultValue={profile?.specialization || ''} 
              className="w-full h-11 px-4 bg-white dark:bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Hourly Retainer Fee (USD)</label>
          <input 
            type="number" 
            name="fee"
            required
            defaultValue={profile?.fee || ''} 
            className="w-full h-11 px-4 bg-white dark:bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Professional Biography</label>
          <textarea 
            rows="4"
            name="bio"
            required
            defaultValue={profile?.bio || ''} 
            className="w-full p-4 bg-white dark:bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
          />
        </div>

        <div className="space-y-1.5 border-t border-neutral-900/80 pt-4">
          <label className="text-xs font-medium text-zinc-400">Image Resource Address URL</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <input 
              type="url" 
              name="photoUrl"
              placeholder="https://example.com/your-photo.jpg"
              defaultValue={profile?.photoUrl || ''} 
              onChange={e => setProfile(prev => ({ ...prev, photoUrl: e.target.value }))} 
              className="flex-1 h-11 px-4 bg-white dark:bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            {profile?.photoUrl && (
              <div className="relative w-11 h-11 shrink-0 mx-auto sm:mx-0">
                <Image
                  src={profile.photoUrl} 
                  alt="Avatar Mirror Preview" 
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-xl object-cover border border-neutral-800 bg-neutral-950" 
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 disabled:text-zinc-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-950/20 transition-all flex items-center gap-2"
          >
            <PencilToLine className="w-4 h-4" /> {saving ? 'Committing Changes...' : 'Save Profile Properties'}
          </button>
        </div>
      </form>
    </div>
  );
}