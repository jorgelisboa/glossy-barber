import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return new NextResponse('User ID not found', { status: 400 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      // Adicionamos o ID do usuário nos metadados da sessão
      metadata: {
        userId: userId,
      },
      success_url: `${appUrl}/?payment=success`,
      cancel_url: `${appUrl}/?payment=cancelled`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
