export const SITE_NAME = "Mistri";
export const SITE_TAGLINE = "The Future Runs on Silicon";
export const FREE_SHIPPING_THRESHOLD = 5000; // cents ($50.00)
export const STANDARD_SHIPPING_FEE = 599;    // cents ($5.99)
export const EXPRESS_SHIPPING_FEE = 1499;    // cents ($14.99)

export const CATEGORIES = [
  { name: "Robotics Kits", slug: "robotics-kits", emoji: "🤖" },
  { name: "Smart Home",    slug: "smart-home",    emoji: "🏠" },
  { name: "Components",   slug: "components",    emoji: "⚡" },
  { name: "Gadgets",      slug: "gadgets",       emoji: "🎮" },
] as const;

export const SORT_OPTIONS = [
  { label: "Newest",             value: "created_at:desc" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Best Rated",         value: "avg_rating:desc" },
] as const;

export const TRUST_ITEMS = [
  "🔒 Secure Checkout",
  "🚀 Express Worldwide",
  "♻️ Carbon Neutral",
  "✅ Authenticity Verified",
  "💬 24/7 Support",
  "🔄 30-Day Returns",
  "📦 Fast Dispatch",
  "🛡️ 2-Year Warranty",
] as const;

export const FAQ_ITEMS = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5–7 business days. Express shipping delivers in 1–2 business days. Free standard shipping on orders over $50.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day hassle-free return policy. Items must be in original condition and packaging. Contact us to initiate a return.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay — all processed securely through Stripe.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship worldwide. International shipping rates and times vary by destination. Customs fees may apply.",
  },
  {
    question: "Are your products covered by warranty?",
    answer: "All products come with a minimum 1-year manufacturer warranty. Many items include our extended 2-year Mistri warranty.",
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also view your order status in your Account dashboard.",
  },
  {
    question: "Can I place a bulk or wholesale order?",
    answer: "Absolutely! We offer special pricing for bulk orders of 10+ units. Contact us via our Services page or email bulk@mistri.in.",
  },
] as const;
