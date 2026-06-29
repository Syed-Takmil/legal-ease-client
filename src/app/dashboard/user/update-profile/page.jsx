'use client';

import { authClient } from '@/app/lib/auth-client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function UpdateProfilePage() {
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Safely fallback to default image if left blank or cleared out
    const finalImageUrl = photoUrl.trim() ? photoUrl : '/profile.png';

    try {
      // 1. Update the user profile info inside Better Auth
      const { data, error } = await authClient.updateUser({
        name: fullName,
        image: finalImageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to sync local auth values.");
        setSaving(false);
        return;
      }

      // 2. Synchronize the data change with your Express backend API
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/users`, {
        method: 'POST', // Changed to POST to match your backend upsert endpoint
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: data?.user?.id || data?.id, // Passing user context reference to backend
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