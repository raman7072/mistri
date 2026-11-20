// Supabase Edge Function: stripe-webhook
// Securely verifies signature and executes post-payment stock reduction and order fulfillment

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.0";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

serve(async (req: Request) => {
  const signature = req.headers.get("Stripe-Signature");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!signature || !stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    return new Response("Webhook configuration missing", { status: 400 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    // Handle payment completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      const paymentIntentId = session.payment_intent as string;

      if (!orderId) {
        console.warn("No order_id associated with session:", session.id);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // IDEMPOTENCY GUARD: Check if order is already marked paid
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .single();

      if (existingOrder && existingOrder.status === "paid") {
        console.info(`Order ${orderId} is already marked paid. Skipping duplicate webhook.`);
        return new Response(JSON.stringify({ received: true, already_processed: true }), { status: 200 });
      }

      // Mark order as paid
      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent_id: paymentIntentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      // STOCK REDUCTION: Fetch items in order and decrement stock safely
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, variant_id, quantity")
        .eq("order_id", orderId);

      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          if (item.variant_id) {
            // Decrement variant stock
            const { data: variant } = await supabase
              .from("product_variants")
              .select("stock")
              .eq("id", item.variant_id)
              .single();

            if (variant) {
              const newStock = Math.max(0, variant.stock - item.quantity);
              await supabase
                .from("product_variants")
                .update({ stock: newStock })
                .eq("id", item.variant_id);
            }
          }
        }
      }

      console.info(`Successfully fulfilled order ${orderId} and decremented inventory.`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("Stripe webhook verification error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
