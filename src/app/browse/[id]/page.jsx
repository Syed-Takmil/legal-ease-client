'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CircleCheck, Star, Comment } from '@gravity-ui/icons';
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function LawyerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id; 

  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiring, setHiring] = useState(false); 

  // --- COMMENTING WORKSPACE STATES ---
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchLawyerDetailsAndComments = async () => {
      try {
        setLoading(true);
        
        // Fetch Lawyer Details
        const lawyerRes = await fetch(`http://localhost:5000/lawyers/${id}`);
        if (!lawyerRes.ok) throw new Error(`Profile target unavailable (Status: ${lawyerRes.status})`);
        const lawyerResult = await lawyerRes.json();
        
        if (lawyerResult.success) {
          setLawyer(lawyerResult.data);
        } else {
          setError(lawyerResult.message || "Failed to parse legal advocate file.");
          return;
        }

        // Fetch Lawyer's Comments
        const commentsRes = await fetch(`http://localhost:5000/comments?lawyerId=${id}`);
        if (commentsRes.ok) {
          const commentsResult = await commentsRes.json();
          if (commentsResult.success) {
            setComments(commentsResult.data);
          }
        }
      } catch (err) {
        console.error("Detail Fetch Error:", err);
        setError("Could not trace profile details. Check backend network logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerDetailsAndComments();
  }, [id]);

  const handleConsultationRequest = async () => {
    if (authLoading) return;

    if (!user) {
      toast.info("Please login to request a consultation.");
      router.push(`/login?redirect=/browse/${id}`);
      return;
    }

    try {
      setHiring(true);
       
      const payload = {
        lawyerId: lawyer.userId || lawyer.id || lawyer._id,
        lawyerName: lawyer.name,
        specialization: lawyer.specialization,
        fee: lawyer.hourlyRate, 
        userId: user.id,          
        userName: user.name,      
        userEmail: user.email,    
        requestDate: new Date().toISOString(),
        status: 'pending' 
      };

      const response = await fetch('http://localhost:5000/hires/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Consultation contract request logged successfully!");
        router.push('/dashboard/user/hiring-history');
      } else {
        throw new Error(result.message || "Upstream pipeline execution failure.");
      }
    } catch (err) {
      console.error("Hiring Action Error:", err);
      toast.error(err.message || "Could not complete transaction profile registry.");
    } finally {
      setHiring(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
      toast.info("Please log in to submit a comment.");
      router.push(`/login?redirect=/browse/${id}`);
      return;
    }

    try {
      setSubmittingComment(true);

      const payload = {
        lawyerId: lawyer._id,
        lawyerName: lawyer.name,
        userId: user.id,
        userName: user.name,
        text: commentText,
        rating: commentRating,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/comments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Comment published successfully!");
        setComments([result.data, ...comments]); 
        setCommentText(""); 
        setCommentRating(5);
      } else {
        throw new Error(result.message || "Failed to post review.");
      }
    } catch (err) {
      console.error("Comment Post Error:", err);
      toast.error(err.message || "Could not post your review.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-800 dark:text-zinc-200 flex flex-col items-center justify-center p-6 text-center transition-colors">
        <div className="max-w-md bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Profile Disruption</h2>
          <p className="text-sm text-neutral-500 dark:text-zinc-400">{error}</p>
          <button 
            onClick={() => router.push('/browse')}
            className="px-5 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs text-orange-600 dark:text-orange-400 font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-800 dark:text-zinc-200 p-4 sm:p-8 pt-24 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <button 
          onClick={() => router.push('/browse')}
          className="flex items-center gap-2 text-xs text-neutral-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors group mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
          Back to Directory
        </button>

        {loading ? (
          /* ==================================================================== */
          /* PREMIUM LAYOUT SKELETON PLACEHOLDERS                                  */
          /* ==================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-pulse">
            
            {/* LEFT SIDE: BIOMETRIC CARD SKELETON */}
            <div className="lg:col-span-1 bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5 flex flex-col items-center">
              <div className="w-32 h-32 rounded-2xl bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800" />
              <div className="space-y-2 w-full flex flex-col items-center">
                <div className="h-5 bg-neutral-300 dark:bg-neutral-800 rounded w-2/3" />
                <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800/60 rounded w-1/2" />
              </div>
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-900/60 flex items-center justify-around w-full">
                <div className="w-12 h-8 bg-neutral-200 dark:bg-neutral-800/60 rounded" />
                <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-900" />
                <div className="w-12 h-8 bg-neutral-200 dark:bg-neutral-800/60 rounded" />
              </div>
            </div>

            {/* RIGHT SIDE: PANELS SKELETONS */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Statement Skeleton */}
              <div className="bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="h-4 bg-neutral-300 dark:bg-neutral-800 rounded w-1/4 mb-2" />
                <div className="space-y-2.5">
                  <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800/60 rounded w-full" />
                  <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800/60 rounded w-11/12" />
                  <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800/60 rounded w-4/5" />
                </div>
              </div>

              {/* Retainer Pricing Bar Skeleton */}
              <div className="bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-2 w-1/2">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800/60 rounded w-1/3" />
                  <div className="h-8 bg-neutral-300 dark:bg-neutral-800 rounded w-1/2" />
                </div>
                <div className="h-12 bg-neutral-300 dark:bg-neutral-800 rounded-xl w-full sm:w-40" />
              </div>

              {/* Comment & Review System Skeleton */}
              <div className="bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="h-4 bg-neutral-300 dark:bg-neutral-800 rounded w-1/5" />
                <div className="h-24 bg-neutral-200 dark:bg-neutral-800/50 rounded-xl w-full" />
                <div className="h-10 bg-neutral-300 dark:bg-neutral-800 rounded-lg w-28" />
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================================== */
          /* RENDER COMPONENT INSTANCE AFTER FULL PIPELINE SETTLEMENT            */
          /* ==================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT SIDE: BIOMETRIC CARD */}
            <div className="lg:col-span-1 bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5 text-center relative overflow-hidden shadow-sm dark:shadow-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 relative">
                <Image
                  width={100}
                  height={70}
                  src={lawyer.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"} 
                  alt={lawyer.name} 
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
                  {lawyer.name}
                  {lawyer.status !== 'Busy' && <CircleCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                </h1>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-500">{lawyer.specialization}</p>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-900/60 flex items-center justify-around text-xs text-neutral-500 dark:text-zinc-400">
                <div className="text-center">
                  <span className="block text-neutral-900 dark:text-white font-bold text-sm">{lawyer.experience || "5+"} Yrs</span>
                  <span className="text-[10px] text-neutral-400 dark:text-zinc-500 uppercase">Practice</span>
                </div>
                <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-900" />
                <div className="text-center">
                  <span className="block text-neutral-900 dark:text-white font-bold text-sm flex items-center gap-0.5 justify-center">
                    <Star className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" /> {lawyer.rating || "4.9"}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-zinc-500 uppercase">Rating</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: DETAILS, RETAINER, AND COMMENTS PANEL */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm dark:shadow-none">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3">Professional Statement</h2>
                <p className="text-sm text-neutral-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {lawyer.bio || "No professional biography has been cataloged for this attorney profile node."}
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm dark:shadow-none">
                <div className="space-y-1">
                  <span className="text-xs text-neutral-400 dark:text-zinc-500 font-semibold uppercase tracking-wide">Standard Consultation Retainer</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">${lawyer.hourlyRate}</span>
                    <span className="text-sm text-neutral-500 dark:text-zinc-400">/ billing hour</span>
                  </div>
                </div>

                <button 
                  onClick={handleConsultationRequest}
                  disabled={lawyer.status === 'Busy' || hiring}
                  className={`w-full sm:w-auto px-6 h-12 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-sm ${
                    lawyer.status === 'Busy'
                      ? 'bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-400 dark:text-zinc-600 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white font-medium hover:shadow-lg hover:shadow-orange-500/10'
                  }`}
                >
                  {lawyer.status === 'Busy' ? 'Currently Retained / Busy' : hiring ? 'Processing Request...' : 'Request Consultation'}
                </button>
              </div>

              {/* --- REVIEWS & COMMENTS SPACE --- */}
              <div className="bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-3 flex items-center gap-2">
                  <Comment className="w-4 h-4 text-orange-500" /> Client Reviews ({comments.length})
                </h2>

                {user ? (
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-xs text-neutral-500 dark:text-zinc-400 uppercase font-bold">Your Rating:</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setCommentRating(star)}
                            className="text-amber-500 focus:outline-none"
                          >
                            <Star className={`w-5 h-5 ${star <= commentRating ? 'fill-amber-500' : 'text-zinc-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your client experience review here..."
                        disabled={submittingComment}
                        className="w-full p-4 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-5 h-10 rounded-lg text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black font-bold tracking-wide hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-sm"
                    >
                      {submittingComment ? "Posting Review..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="p-6 rounded-xl bg-neutral-100/50 dark:bg-neutral-900/30 border border-dashed border-neutral-300 dark:border-neutral-800 text-center space-y-3">
                    <p className="text-sm text-neutral-500 dark:text-zinc-400">
                      Only verified clients can submit consultation feedback and community ratings.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push(`/login?redirect=/browse/${id}`)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-md transition-all"
                    >
                      Sign In to Leave a Review
                    </button>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-900">
                  {comments.length === 0 ? (
                    <p className="text-center text-xs text-neutral-400 dark:text-zinc-600 py-4">No reviews have been added for this counselor yet.</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="p-4 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-900/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">{comment.userName}</span>
                          <div className="flex gap-0.5 text-amber-500">
                            {Array.from({ length: comment.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-700 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                          {comment.text}
                        </p>
                        <div className="text-[10px] text-neutral-400 dark:text-zinc-600 font-mono text-right">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}