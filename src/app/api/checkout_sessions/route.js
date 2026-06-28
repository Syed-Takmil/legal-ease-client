import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/app/lib/stripe';
import { auth } from '@/app/lib/auth';

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // Securely extract the user session on the server side
    const sessionData = await auth.api.getSession({
      headers: headersList,
    });

    const userEmail = sessionData?.user?.email;

    // Create the secure Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail || undefined, 
      line_items: [
        {
          price: 'price_1TmuBFK2lS0MpF2YfB5PBGk8',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/manage-legal-profile`,
    });

    // 🚀 FIX: Redirect the browser directly to Stripe instead of sending JSON text strings
    return NextResponse.redirect(session.url, 303);

  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}