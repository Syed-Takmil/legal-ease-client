'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, TrashBin } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function CommentsPage() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  // FIX 1: Safely evaluate user role inline using the top-level session state
  const isUser = !authLoading && user && user.role === 'user';

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalComment, setActiveModalComment] = useState(null);
  const [editText, setEditText] = useState('');

  // FIX 2: Evaluate safety routing within the useEffect hook
  useEffect(() => {
    if (authLoading) return;

    if (!session || !isUser) {
      router.push("/unauthorized");
    }
  }, [session, authLoading, isUser, router]);

  // Fetch comments specific to the authenticated client user node
  useEffect(() => {
    if (authLoading || !user?.id || !isUser) return;

    fetch(`${process.env.NEXT_PUBLIC_URL}/comments?userId=${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not parse dashboard data profile logs.");
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          setComments(res.data);
        }
      })
      .catch((err) => {
        console.error("Dashboard Comments Load Error:", err);
        toast.error("Failed to load your review history logs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id, authLoading, isUser]);

  const openEditModal = (comment) => {
    setActiveModalComment(comment);
    setEditText(comment.text);
  };

  // PUT: Update statement route mapping sync
  const handleUpdateComment = async () => {
    if (!editText.trim() || !user?.id || !activeModalComment?._id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/comments/update/${activeModalComment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: editText,
          userId: user.id // Checked on backend file block for ownership isolation
        })
      });
      
      const result = await res.json();

      if (result.success) {
        setComments(comments.map(c => c._id === activeModalComment._id ? { ...c, text: editText } : c));
        toast.success("Review updated cleanly.");
        setActiveModalComment(null);
      } else {
        toast.error(result.message || "Failed to submit updates.");
      }
    } catch (err) { 
      console.error(err); 
      toast.error("Network communication pipeline error.");
    }
  };

  // DELETE: Integrated securely with the backend delete node structure
  const handleDeleteComment = async (id) => {
    if (!confirm('Confirm definitive removal of this review statement?')) return;
    if (!user?.id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id // Passing the authenticated user ID to match backend validation checks
        })
      });

      const result = await res.json();

      if (result.success) {
        setComments(comments.filter((comment) => comment._id !== id));
        toast.success("Review retracted cleanly.");
      } else {
        toast.error(result.message || "Failed to complete deletion request.");
      }
    } catch (err) { 
      console.error(err); 
      toast.error("Network communication pipeline error.");
    }
  };

  if (authLoading || loading || !isUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-500">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-wider">Syncing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-xl font-bold text-black dark:text-white">Review Dockets</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Modify or retract ongoing profile feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4">No review statements indexed under this profile node.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="dark:bg-[#0d0d0d] bg-white border border-neutral-800 rounded-xl p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{comment.lawyerName || "Legal Advocate"}</span>
                  <span className="text-[10px] text-zinc-600">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-line">{comment.text}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-900/40">
                <button
                  type="button"
                  onClick={() => openEditModal(comment)}
                  className="h-8 px-3 rounded-lg border border-neutral-800 text-zinc-400 hover:text-orange-400 hover:bg-neutral-900 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment._id)}
                  className="h-8 px-3 rounded-lg border border-neutral-800 text-zinc-400 hover:text-red-400 hover:bg-neutral-900 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <TrashBin className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* POPUP MODAL DIALOG CONTAINER */}
      {activeModalComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white">Modify Evaluation Statement</h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-zinc-200 focus:border-orange-500 focus:outline-none transition-colors resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModalComment(null)}
                className="px-4 h-10 rounded-xl text-xs font-bold text-zinc-400 hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateComment}
                className="px-4 h-10 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs tracking-wide rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}