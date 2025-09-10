import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Esta é a rota que o Stripe chamará após um evento (ex: pagamento bem-sucedido)
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Lidando com o evento de checkout bem-sucedido
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;

    if (!userId) {
      return new NextResponse('User ID not found in session metadata', { status: 400 });
    }

    // TODO: Lógica de negócio
    // 1. Encontre o usuário no seu banco de dados com o `userId`.
    // 2. Atualize o status da assinatura do usuário para 'ativo'.
    // 3. Dê acesso ao plano Nuvem.
    console.log(`Pagamento bem-sucedido para o usuário: ${userId}`);
    console.log('Sessão de checkout:', session);
  }

  return new NextResponse('OK', { status: 200 });
}
