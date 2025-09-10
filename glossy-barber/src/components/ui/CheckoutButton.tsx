'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';

// Simulação de autenticação e dados do usuário
// Em um app real, isso viria de um contexto de autenticação (AuthContext, useUser, etc.)
const useUser = () => {
  return {
    // Mude para `true` para simular um usuário logado
    isLoggedIn: false, 
    // ID do usuário que será enviado para o Stripe
    userId: 'user_placeholder_12345', 
  };
};

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn, userId } = useUser();

  const handleCheckout = async () => {
    setIsLoading(true);

    if (!isLoggedIn) {
      // Se não estiver logado, redireciona para a página de cadastro
      router.push('/cadastro');
      return;
    }

    try {
      // 1. Cria a sessão de checkout no nosso backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error('Failed to create checkout session');
      }

      // 2. Redireciona para o checkout do Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Stripe.js failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Ocorreu um erro ao iniciar o pagamento. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className="w-full mt-auto">
      {isLoading ? 'Carregando...' : 'Assinar o Plano Nuvem'}
    </Button>
  );
}
