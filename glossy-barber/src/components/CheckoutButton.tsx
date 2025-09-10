"use client";

import {loadStripe} from "@stripe/stripe-js";

export function CheckoutButton({priceId}: { priceId: string }) {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({priceId}),
      });

      const {sessionId} = await res.json();

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
      );

      if (!stripe) {
        console.error("Stripe.js failed to load.");
        return;
      }

      await stripe.redirectToCheckout({sessionId});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Buy Now
    </button>
  );
}
