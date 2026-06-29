


import Link from 'next/link';
import { redirect } from 'next/navigation';
import { stripe } from '../lib/stripe';
import GetUser from '../lib/actions/GetUser';
import { authClient } from '../lib/auth-client';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;


  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const sessionData = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const status = sessionData.status;
  const customerEmail = sessionData.customer_details?.email;

  if (status === 'open') {
    return redirect('/');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden bg-white dark:bg-[#060606]">
      {/* Ambient background design accents */}
      <input name='' type='hidden'/>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 dark:bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full text-center space-y-8 bg-neutral-50 dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-8 shadow-xl relative z-10">
        
        {/* Animated Checkmark Badge */}
        <div className="mx-auto w-16 h-16 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 rounded-full flex items-center justify-center shadow-inner">
          <svg 
            className="w-8 h-8 text-purple-600 dark:text-purple-400 stroke-[2.5]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M4.5 12.75l6 6 9-13.5" 
            />
          </svg>
        </div>

        {/* Content Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
            Verification Successful
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-semibold">
            Account Upgraded / Initialized
          </p>
        </div>

        {/* Informational Body Block */}
        <div className="text-sm text-neutral-600 dark:text-zinc-400 space-y-4 leading-relaxed bg-white dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-900 rounded-xl p-5 text-left">
          <p>
            We appreciate your business! Your transaction cleared successfully, enabling immediate directory visibility allocation.
          </p>
          <p className="text-xs pt-2 border-t border-neutral-100 dark:border-neutral-900 text-neutral-500 dark:text-zinc-500">
            A secure layout confirmation email is routing directly to{' '}
            <span className="font-medium text-black dark:text-zinc-300 break-all">{customerEmail}</span>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard/lawyer/profile"
            className="w-full h-11 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-950/10 dark:shadow-none"
          >
            Configure Profile Card
          </Link>
          
          <div className="text-xs text-neutral-400 dark:text-zinc-500">
            Need legal infrastructure assistance? Email{' '}
            <a 
              href="mailto:support@legalease.com" 
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              support@legalease.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}