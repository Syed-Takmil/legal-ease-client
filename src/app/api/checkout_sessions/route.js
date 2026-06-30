import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/app/lib/stripe';
import { auth } from '@/app/lib/auth';

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // Parse the data sent from the client component
    const body = await req.json().catch(() => ({}));
    const { priceType, metadata = {} } = body;

    // Securely extract the user session on the server side
    const sessionData = await auth.api.getSession({
      headers: headersList,
    });

    if (!sessionData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = sessionData.user.email;

    // Dynamically assign the price ID based on the client parameter
    let targetPriceId = '';
    if (priceType === 'lawyer_license') {
      targetPriceId = 'price_1TmuBFK2lS0MpF2YfB5PBGk8';
    } else if (priceType === 'user_paying_lawyer') {
      targetPriceId = 'price_1TmyfuK2lS0MpF2YrhyRFtHg';
    } else {
      return NextResponse.json({ error: "Invalid payment item initialization type specified" }, { status: 400 });
    }

    // Build the secure Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail || undefined,
      line_items: [
        {
          price: targetPriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: priceType === 'lawyer_license' 
        ? `${origin}/dashboard/manage-legal-profile` 
        : `${origin}/dashboard/hiring-history`,
      // Pass metadata along to the webhook to identify the record later
      metadata: {
        priceType,
        userEmail: userEmail || 'unknown',
        ...metadata
      }
    });

    // Return the URL safely to the client component for top-level browser assignment
    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}