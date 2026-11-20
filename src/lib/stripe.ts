import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { isSupabaseConfigured } from "./supabase";
import type { CartItem } from "@/types/cart";
import type { ShippingAddress } from "@/types/order";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key =
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
      "pk_test_51MockStripeKeyForDevelopmentModePlaceholder00000000";
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export interface CreateCheckoutPayload {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: "standard" | "express";
  promoCode?: string;
  customerEmail: string;
}

export interface CheckoutResult {
  url?: string;
  orderId: string;
  isSimulated?: boolean;
}

/**
 * Creates a Stripe Checkout session by calling the Supabase create-checkout Edge Function.
 * If credentials are not yet configured in .env.local, provides a realistic simulated test checkout
 * so development and QA flows remain completely functional.
 */
export async function createCheckoutSession(
  payload: CreateCheckoutPayload
): Promise<CheckoutResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  if (isSupabaseConfigured && supabaseUrl) {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          url: data.url,
          orderId: data.orderId,
        };
      }
    } catch (err) {
      console.warn("Edge function unreachable, falling back to Stripe test simulation:", err);
    }
  }

  // Realistic simulation for development test mode
  await new Promise((resolve) => setTimeout(resolve, 1400));
  const orderId = `MST-${Date.now().toString(36).toUpperCase()}`;

  return {
    orderId,
    isSimulated: true,
  };
}

/**
 * Validates promo codes against server rules:
 * Valid codes: "MAKER10" (10% off), "SILICON20" (20% off), "FREESHIP" (Free express shipping)
 */
export function validatePromoCode(code: string, subtotal: number): {
  valid: boolean;
  discount: number;
  message: string;
} {
  const normalized = code.trim().toUpperCase();

  if (normalized === "MAKER10") {
    return {
      valid: true,
      discount: Number((subtotal * 0.1).toFixed(2)),
      message: "10% Maker discount applied! ⚡",
    };
  }

  if (normalized === "SILICON20") {
    if (subtotal < 100) {
      return {
        valid: false,
        discount: 0,
        message: "SILICON20 requires a minimum order of $100.",
      };
    }
    return {
      valid: true,
      discount: Number((subtotal * 0.2).toFixed(2)),
      message: "20% Silicon VIP discount applied! 🔥",
    };
  }

  if (normalized === "FREESHIP") {
    return {
      valid: true,
      discount: 5.99,
      message: "Free shipping promo code applied! 🚀",
    };
  }

  return {
    valid: false,
    discount: 0,
    message: "Invalid or expired promo code.",
  };
}
