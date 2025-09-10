import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";

export async function POST(req: Request) {
  const {priceId, quantity = 1} = await req.json();

  if (!priceId) {
    return new NextResponse("Price ID is required", {status: 400});
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/home`,
      cancel_url: `${req.headers.get("origin")}/home`,
    });

    return NextResponse.json({sessionId: session.id});
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

