// Supabase Edge Function: create-checkout
// Follows Deno & Supabase Edge Runtime standards

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.0";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing server environment variables (STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { cartItems, shippingAddress, shippingMethod, promoCode, customerEmail } = body;

    if (!cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. RECOMPUTE PRICES SERVER-SIDE FROM DATABASE (Never trust client prices)
    const productIds = cartItems.map((item: any) => item.productId);
    const { data: dbProducts, error: prodError } = await supabase
      .from("products")
      .select("id, title, price, compare_at_price, slug")
      .in("id", productIds);

    if (prodError || !dbProducts) {
      throw new Error("Failed to fetch product catalog from database");
    }

    const variantIds = cartItems
      .filter((item: any) => item.variantId)
      .map((item: any) => item.variantId);

    let dbVariants: any[] = [];
    if (variantIds.length > 0) {
      const { data: vData } = await supabase
        .from("product_variants")
        .select("id, title, price, stock")
        .in("id", variantIds);
      if (vData) dbVariants = vData;
    }

    // Build verified line items with server-verified prices
    let subtotalCents = 0;
    const stripeLineItems = cartItems.map((cartItem: any) => {
      const dbProd = dbProducts.find((p: any) => p.id === cartItem.productId);
      const dbVar = dbVariants.find((v: any) => v.id === cartItem.variantId);

      const verifiedPriceCents = dbVar ? dbVar.price : dbProd ? dbProd.price : cartItem.price * 100;
      subtotalCents += verifiedPriceCents * cartItem.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: dbProd?.title || cartItem.title,
            description: dbVar?.title ? `Configuration: ${dbVar.title}` : undefined,
            images: cartItem.image ? [cartItem.image] : undefined,
          },
          unit_amount: verifiedPriceCents,
        },
        quantity: cartItem.quantity,
      };
    });

    // 2. SERVER-SIDE PROMO CODE VALIDATION
    let discountCents = 0;
    if (promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase().trim())
        .eq("is_active", true)
        .single();

      if (promo) {
        if (promo.discount_type === "percent") {
          discountCents = Math.round((subtotalCents * promo.discount_value) / 100);
        } else if (promo.discount_type === "fixed") {
          discountCents = promo.discount_value;
        }
      }
    }

    // 3. SHIPPING FEE COMPUTATION
    const isFreeShipping = subtotalCents >= 5000;
    const shippingFeeCents =
      shippingMethod === "express" ? 1499 : isFreeShipping ? 0 : 599;

    const totalCents = Math.max(0, subtotalCents - discountCents) + shippingFeeCents;

    // 4. CREATE DATABASE PENDING ORDER
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        status: "pending",
        total_amount: totalCents,
        subtotal: subtotalCents,
        shipping_fee: shippingFeeCents,
        shipping_address: shippingAddress,
        shipping_method: shippingMethod,
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      throw new Error(`Failed to create order record: ${orderErr?.message}`);
    }

    // Insert order items
    const orderItemsRows = cartItems.map((item: any) => {
      const dbProd = dbProducts.find((p: any) => p.id === item.productId);
      const dbVar = dbVariants.find((v: any) => v.id === item.variantId);
      const verifiedPriceCents = dbVar ? dbVar.price : dbProd ? dbProd.price : item.price * 100;

      return {
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: item.quantity,
        unit_price: verifiedPriceCents,
      };
    });

    await supabase.from("order_items").insert(orderItemsRows);

    // 5. CREATE STRIPE CHECKOUT SESSION
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: order.id,
      metadata: {
        order_id: order.id,
        promo_code: promoCode || "",
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingFeeCents,
              currency: "usd",
            },
            display_name:
              shippingMethod === "express" ? "Priority Express Air" : "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: shippingMethod === "express" ? 1 : 5 },
              maximum: { unit: "business_day", value: shippingMethod === "express" ? 2 : 7 },
            },
          },
        },
      ],
      success_url: `${origin}/order/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    // Update order with stripe session ID
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        url: session.url,
        orderId: order.id,
        sessionId: session.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
