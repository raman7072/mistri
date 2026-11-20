export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number; // in dollars (e.g. 89.99)
  title: string;
  variantTitle?: string;
  image?: string;
  slug: string;
}
