'use client';

import { authClient } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function UpdateProfilePage() {
  const router = useRouter();
  
  // 1. Get the session directly here at the top level
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // 2. Safely process the redirect based on the top-level user data
  useEffect(() => {
    if (authLoading) return;

    // Check the role directly from the session's user object
    if (!user || user.role !== 'user') {
      router.push("/unauthorized");
    }
  }, [user, authLoading, router]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const finalImageUrl = photoUrl.trim() ? photoUrl : '/profile.png';

    try {
      const { data, error } = await authClient.updateUser({
        name: fullName,
        image: finalImageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to sync local auth values.");
        setSaving(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: data?.user?.id || data?.id,
          name: fullName, 
          image: finalImageUrl 
        })
      });

      if (res.ok) {
        toast.success('Identity record processed successfully!');
      } else {
        toast.error('Auth updated, but failed to update user collection data.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected runtime exception occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white">Identity Configuration</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Maintain system-wide account display values safely.</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="dark:bg-[#0d0d0d] bg-white border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-xl">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Account Holder Name</label>
          <input
            type="text"
            required
            value={fullName}
            name="name"
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full h-11 bg-white dark:bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-black dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Photo input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Avatar Photo URL <span className="text-zinc-600 lowercase">(optional)</span></label>
          <input
            type="url"
            value={photoUrl}
            name="image"
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://i.ibb.co/..."
            className="w-full h-11 bg-white dark:bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-black dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Submit action */}
        <button
          type="submit"
          disabled={saving}
          className="w-full h-11 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm tracking-wide rounded-xl shadow-md transition-colors disabled:opacity-50"
        >
          {saving ? 'Processing Update...' : 'Update Profile Record'}
        </button>
      </form>
    </div>
  );
}