# Mistri — Electronics, Robotics & Home Automation Store — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack, production-grade e-commerce platform for Electronics, Robotics & Home Automation products using React + Vite, TypeScript, Tailwind CSS, Supabase (Cloud), and Stripe.

**Architecture:** React SPA (Vite + TypeScript) with TanStack Router for type-safe routing; Supabase for PostgreSQL DB (with RLS), Auth, and Storage; Stripe hosted checkout; react-query for data fetching; Zustand for cart state persisted to localStorage; Framer Motion for animations.

**Tech Stack:** React 18, TypeScript, Vite, TanStack Router, Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React, Zustand, TanStack Query, Supabase JS SDK, Stripe JS, Framer Motion, Sonner (toasts), React Hook Form + Zod.

**Spec:** Defined in conversation history — Electronics & Tech niche, Lovable Cloud (Supabase) + Stripe, 24 demo products, 5-phase delivery.

---

## Global Constraints

- TypeScript strict mode: `"strict": true` throughout; no `any` without comment explaining why.
- Tailwind CSS v4 only; no inline `style=` props except for truly dynamic values (e.g., progress bar width).
- All DB operations go through Supabase client; no raw SQL from frontend except inside Edge Functions.
- RLS enabled on every table; all reads/writes go through typed Supabase helpers.
- Accent color: acid lime `#A3E635` (Tailwind `lime-400`); never hardcoded, always via CSS variable `--accent`.
- Fonts: Syne (headings, weight 400–800), Geist (body); loaded via Google Fonts / Fontsource.
- Cart state: Zustand store persisted to `localStorage` key `mistri_cart`; works without login.
- Prices: always recomputed server-side (Edge Function) before Stripe session creation.
- Images: Supabase Storage bucket `product-images`; public read; authenticated write (admin only).
- Routes follow TanStack Router file-based conventions in `src/routes/`.
- Component library: shadcn/ui primitives; custom components in `src/components/`.
- All forms: React Hook Form + Zod validation.
- Toasts: Sonner; never browser `alert()`.

---

## Review Focus

1. **Out-of-stock race condition** — user adds last unit; another user buys it first; Stripe payment succeeds; webhook must decrement stock and handle negative stock gracefully (stock floor = 0, fulfillment alert email).
2. **Promo code client bypass** — discount must be recomputed inside the Edge Function; client total is ignored; test with a tampered request.
3. **Unauthenticated cart persistence** — cart items survive browser reload and login; on login, merge localStorage cart with any server-side saved cart.
4. **Admin RLS bypass** — non-admin user calling admin Edge Functions must receive 403, not a data leak.
5. **Stripe webhook replay** — duplicate `payment_intent.succeeded` events must not double-decrement stock or double-create orders; use idempotency key on `orders.stripe_payment_intent_id`.

---

## File Structure

```
src/
  routes/                          # TanStack Router file-based routes
    __root.tsx                     # Root layout (Navbar + Footer + Outlet)
    index.tsx                      # / — Home page
    shop.tsx                       # /shop — Catalog
    product.$slug.tsx              # /product/:slug — PDP
    checkout.tsx                   # /checkout
    order.$id.tsx                  # /order/:id — Confirmation
    auth.tsx                       # /auth — Sign in / Sign up
    reset-password.tsx             # /reset-password
    _authenticated.tsx             # Authenticated layout guard
    _authenticated.account.tsx     # /account
    _authenticated.admin.tsx       # /admin (role-gated)
    about.tsx                      # /about
    services.tsx                   # /services
    contact.tsx                    # /contact
    404.tsx                        # Not found

  components/
    layout/
      Navbar.tsx
      Footer.tsx
      CartDrawer.tsx
      CommandPalette.tsx           # Cmd+K search
      MobileDrawer.tsx
    ui/                            # shadcn/ui generated components live here
    home/
      HeroBento.tsx
      TrustTicker.tsx
      CategoryBento.tsx
      FeaturedProducts.tsx
      ValueProps.tsx
      Testimonials.tsx
      FaqAccordion.tsx
      NewsletterSignup.tsx
    shop/
      FilterSidebar.tsx
      FilterBottomSheet.tsx        # Mobile
      ProductGrid.tsx
      ProductCard.tsx
      QuickViewModal.tsx
      SortDropdown.tsx
      ViewToggle.tsx
    product/
      ImageGallery.tsx
      VariantSelector.tsx
      QuantitySelector.tsx
      ProductTabs.tsx              # Specs / Shipping / Reviews tabs
      RelatedProducts.tsx
      ReviewsList.tsx
      ReviewForm.tsx
    checkout/
      AddressForm.tsx
      ShippingMethodSelector.tsx
      OrderSummary.tsx
    account/
      OrderHistory.tsx
      WishlistTab.tsx
      AddressBook.tsx
      ProfileForm.tsx
    admin/
      ListingWizard.tsx            # 4-step product creation wizard
      ProductTable.tsx
      SalesDashboard.tsx
      ImageUploader.tsx
    auth/
      AuthForm.tsx
      PasswordStrengthMeter.tsx

  lib/
    supabase.ts                    # Supabase client singleton
    supabaseTypes.ts               # Generated DB types (from supabase gen types)
    stripe.ts                      # Stripe.js loader
    queryClient.ts                 # TanStack Query client
    utils.ts                       # cn(), formatPrice(), slugify(), etc.
    constants.ts                   # FREE_SHIPPING_THRESHOLD, ACCENT, etc.

  stores/
    cartStore.ts                   # Zustand cart store + localStorage persist
    authStore.ts                   # Supabase auth session reactive store

  hooks/
    useCart.ts
    useAuth.ts
    useWishlist.ts
    useProducts.ts
    useProduct.ts
    useOrders.ts
    useAdmin.ts

  types/
    product.ts
    order.ts
    cart.ts
    user.ts

supabase/
  migrations/
    001_schema.sql                 # All tables + RLS + grants
    002_seed_products.sql          # 24 sample products with variants + images
  functions/
    create-checkout/index.ts       # Edge Function: validate cart, create Stripe session
    stripe-webhook/index.ts        # Edge Function: handle payment_intent.succeeded
    admin-products/index.ts        # Edge Function: admin product CRUD
docs/
  superpowers/plans/
    2026-11-20-mistri-ecommerce.md  # This file
```

---

## Phase 1 — Foundation: Design System, DB Schema, Navbar/Footer, Home

---

### Task 1.1: Project Setup & Design System

**Files:**
- Modify: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`
- Create: `src/index.css` (Tailwind + CSS variables)
- Create: `src/lib/utils.ts`
- Create: `src/lib/constants.ts`
- Create: `tailwind.config.ts`
- Create: `index.html` (Syne + Geist font imports)

**Interfaces:**
- Produces: `cn(...classes)` utility (clsx + tailwind-merge), `formatPrice(cents: number): string`, CSS variables `--accent`, `--background`, `--foreground`, `--muted`, `--border`, `--card`, `--glass`
- Produces: `FREE_SHIPPING_THRESHOLD = 5000` (cents), `SITE_NAME = "Mistri"`

- [ ] **Step 1:** Install dependencies
  ```bash
  npm install @tanstack/react-router @tanstack/react-query zustand @supabase/supabase-js @stripe/stripe-js framer-motion sonner react-hook-form @hookform/resolvers zod lucide-react clsx tailwind-merge
  npm install -D @types/node tailwindcss @tailwindcss/vite autoprefixer
  ```
  Run: `npm install` and verify `node_modules/` populated.

- [ ] **Step 2:** Configure `tailwind.config.ts`
  - Extend theme with `fontFamily: { syne: ["Syne", "sans-serif"], geist: ["Geist", "sans-serif"] }`
  - Extend colors: `accent: "#A3E635"`, `lime: { 400: "#A3E635" }`
  - Content paths: `["./index.html", "./src/**/*.{ts,tsx}"]`

- [ ] **Step 3:** Write `src/index.css`
  - Define CSS variables for light and dark themes in `:root` and `.dark`
  - `--accent: #A3E635; --background: #FAFAFA; --foreground: #09090B; --muted: #F4F4F5; --border: rgba(0,0,0,0.08); --card: #FFFFFF; --glass: rgba(250,250,250,0.72);`
  - Dark: `--background: #09090B; --foreground: #FAFAFA; --muted: #18181B; --border: rgba(255,255,255,0.08); --card: #18181B; --glass: rgba(9,9,11,0.72);`
  - Base font: `body { font-family: "Geist", sans-serif; }` and `h1,h2,h3,h4,h5,h6 { font-family: "Syne", sans-serif; }`

- [ ] **Step 4:** Add Google Fonts import to `index.html`
  - Syne: weights 400,600,700,800
  - Geist: weights 300,400,500,600

- [ ] **Step 5:** Write `src/lib/utils.ts`
  - `cn(...inputs: ClassValue[]): string` using `clsx` + `twMerge`
  - `formatPrice(cents: number, currency?: string): string` → `"$12.99"` (divide by 100, `Intl.NumberFormat`)
  - `slugify(str: string): string`
  - `truncate(str: string, n: number): string`

- [ ] **Step 6:** Write `src/lib/constants.ts`
  - `FREE_SHIPPING_THRESHOLD = 5000` (cents)
  - `SITE_NAME = "Mistri"`
  - `CATEGORIES = ["Robotics Kits", "Smart Home", "Components", "Gadgets"]`
  - `STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY`

- [ ] **Step 7:** Configure `vite.config.ts` with `@tailwindcss/vite` plugin and path alias `@` → `src/`

- [ ] **Step 8:** Set up shadcn/ui
  ```bash
  npx shadcn@latest init
  ```
  Choose: TypeScript, Tailwind CSS, `src/components/ui`, alias `@/`.
  Then add required components:
  ```bash
  npx shadcn@latest add button badge card dialog drawer dropdown-menu input label select separator sheet skeleton slider tabs accordion toast avatar progress
  ```

- [ ] **Step 9:** Commit
  ```bash
  git init && git add -A && git commit -m "feat: project setup, design tokens, shadcn/ui"
  ```

---

### Task 1.2: Supabase Schema — All Tables + RLS

**Files:**
- Create: `supabase/migrations/001_schema.sql`
- Create: `.env.local` template (`.env.example`)
- Create: `src/lib/supabase.ts`

**Interfaces:**
- Produces: Supabase client `supabase` exported from `src/lib/supabase.ts`
- Produces: All DB tables with correct types (types generated in Task 1.3)

- [ ] **Step 1:** Write `supabase/migrations/001_schema.sql` — create all tables in order:

  ```sql
  -- Enable UUID extension
  create extension if not exists "pgcrypto";

  -- categories
  create table categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    image_url text,
    parent_id uuid references categories(id),
    created_at timestamptz default now()
  );

  -- products
  create table products (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    description text,
    price integer not null, -- cents
    compare_at_price integer,
    category_id uuid references categories(id),
    brand text,
    is_featured boolean default false,
    status text check (status in ('draft','active','archived')) default 'active',
    tags text[],
    weight_grams integer,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  -- product_images
  create table product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade,
    url text not null,
    alt text,
    position integer default 0,
    created_at timestamptz default now()
  );

  -- product_variants
  create table product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade,
    title text not null,
    sku text unique,
    price integer not null, -- cents; overrides product price when set
    stock integer not null default 0,
    options jsonb default '{}'::jsonb,
    created_at timestamptz default now()
  );

  -- profiles (mirror of auth.users)
  create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  -- user_roles
  create table user_roles (
    user_id uuid references profiles(id) on delete cascade,
    role text check (role in ('buyer','seller','admin')) default 'buyer',
    primary key (user_id, role)
  );

  -- helper function
  create or replace function has_role(uid uuid, r text) returns boolean as $$
    select exists (select 1 from user_roles where user_id = uid and role = r);
  $$ language sql security definer stable;

  -- orders
  create table orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    status text check (status in ('pending','paid','shipped','delivered','cancelled')) default 'pending',
    total_amount integer not null,
    subtotal integer not null,
    tax integer default 0,
    shipping_fee integer default 0,
    shipping_address jsonb not null,
    shipping_method text,
    stripe_payment_intent_id text unique,
    stripe_session_id text unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  -- order_items
  create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    product_id uuid references products(id),
    variant_id uuid references product_variants(id),
    quantity integer not null,
    unit_price integer not null,
    created_at timestamptz default now()
  );

  -- wishlist_items
  create table wishlist_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade,
    product_id uuid references products(id) on delete cascade,
    created_at timestamptz default now(),
    unique(user_id, product_id)
  );

  -- reviews
  create table reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    rating integer check (rating between 1 and 5) not null,
    comment text,
    verified_purchase boolean default false,
    created_at timestamptz default now(),
    unique(product_id, user_id)
  );

  -- addresses
  create table addresses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) on delete cascade,
    label text,
    full_name text not null,
    line1 text not null,
    line2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    country text default 'US',
    is_default boolean default false,
    created_at timestamptz default now()
  );

  -- contact_messages
  create table contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    subject text,
    message text not null,
    ticket_id text unique not null,
    created_at timestamptz default now()
  );

  -- service_inquiries
  create table service_inquiries (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    service_type text,
    message text not null,
    created_at timestamptz default now()
  );

  -- newsletter_subscribers
  create table newsletter_subscribers (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    created_at timestamptz default now()
  );

  -- promo_codes
  create table promo_codes (
    id uuid primary key default gen_random_uuid(),
    code text unique not null,
    discount_type text check (discount_type in ('percent','fixed')) not null,
    discount_value integer not null,
    min_order_cents integer default 0,
    max_uses integer,
    used_count integer default 0,
    expires_at timestamptz,
    is_active boolean default true,
    created_at timestamptz default now()
  );
  ```

- [ ] **Step 2:** Add RLS policies in `001_schema.sql`

  ```sql
  -- Enable RLS on all tables
  alter table categories enable row level security;
  alter table products enable row level security;
  alter table product_images enable row level security;
  alter table product_variants enable row level security;
  alter table profiles enable row level security;
  alter table user_roles enable row level security;
  alter table orders enable row level security;
  alter table order_items enable row level security;
  alter table wishlist_items enable row level security;
  alter table reviews enable row level security;
  alter table addresses enable row level security;
  alter table contact_messages enable row level security;
  alter table service_inquiries enable row level security;
  alter table newsletter_subscribers enable row level security;
  alter table promo_codes enable row level security;

  -- Public read: categories, products, product_images, product_variants
  create policy "public read categories" on categories for select using (true);
  create policy "public read products" on products for select using (status = 'active');
  create policy "public read images" on product_images for select using (true);
  create policy "public read variants" on product_variants for select using (true);

  -- Profiles: owner read/update
  create policy "own profile" on profiles for all using (auth.uid() = id);

  -- user_roles: owner read
  create policy "own roles" on user_roles for select using (auth.uid() = user_id);

  -- Orders: owner read
  create policy "own orders" on orders for select using (auth.uid() = user_id);
  create policy "own order items" on order_items for select
    using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

  -- Wishlist: owner CRUD
  create policy "own wishlist" on wishlist_items for all using (auth.uid() = user_id);

  -- Reviews: public read; owner insert/delete
  create policy "public read reviews" on reviews for select using (true);
  create policy "own review insert" on reviews for insert with check (auth.uid() = user_id);
  create policy "own review delete" on reviews for delete using (auth.uid() = user_id);

  -- Addresses: owner CRUD
  create policy "own addresses" on addresses for all using (auth.uid() = user_id);

  -- Contact / newsletter: insert only (anon allowed)
  create policy "insert contact" on contact_messages for insert with check (true);
  create policy "insert inquiry" on service_inquiries for insert with check (true);
  create policy "insert newsletter" on newsletter_subscribers for insert with check (true);

  -- Promo codes: public read (validation happens server-side)
  create policy "public read promos" on promo_codes for select using (is_active = true);

  -- Admin write policies (via has_role)
  create policy "admin write products" on products for all
    using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));
  create policy "admin write categories" on categories for all
    using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));
  create policy "admin write images" on product_images for all
    using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));
  create policy "admin write variants" on product_variants for all
    using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));
  ```

- [ ] **Step 3:** Create `src/lib/supabase.ts`
  ```typescript
  import { createClient } from "@supabase/supabase-js";
  import type { Database } from "./supabaseTypes";

  export const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  ```

- [ ] **Step 4:** Create `.env.example`
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # server only
  STRIPE_SECRET_KEY=sk_test_...                   # server only
  STRIPE_WEBHOOK_SECRET=whsec_...                 # server only
  ```

- [ ] **Step 5:** Commit
  ```bash
  git add -A && git commit -m "feat: supabase schema, RLS policies"
  ```

---

### Task 1.3: Seed — 24 Sample Products

**Files:**
- Create: `supabase/migrations/002_seed_products.sql`

**Interfaces:**
- Produces: 4 categories × 6 products each = 24 products, each with 1–3 variants and 2–3 images using Unsplash URLs
- Produces: `is_featured = true` on first 6 products

- [ ] **Step 1:** Write seed SQL inserting categories
  ```sql
  insert into categories (name, slug, image_url) values
    ('Robotics Kits',  'robotics-kits',  'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800'),
    ('Smart Home',     'smart-home',     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'),
    ('Components',     'components',     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'),
    ('Gadgets',        'gadgets',        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800');
  ```

- [ ] **Step 2:** Insert 6 Robotics Kits products with realistic names, slugs, prices in cents, descriptions, 2 variants, and images.

  Example template (repeat for all 24):
  ```sql
  with cat as (select id from categories where slug = 'robotics-kits')
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Arduino Mega 2560 Pro Kit',
    'arduino-mega-2560-pro-kit',
    'Complete robotics starter kit featuring Arduino Mega 2560, 65 components, motor drivers, and sensors. Perfect for beginners and educators.',
    8999, 12999,
    (select id from cat),
    'Arduino',
    true,
    array['robotics','arduino','starter','educational']
  );
  ```
  Insert variants and images in follow-up inserts referencing the product slug.

- [ ] **Step 3:** Repeat Step 2 for all 24 products across 4 categories:
  - **Robotics Kits (6):** Arduino Mega Pro Kit, Raspberry Pi 5 Robotics Bundle, 6-DOF Robotic Arm Kit, Line-Following Robot Kit, ESP32 IoT Rover, Drone Building Kit
  - **Smart Home (6):** Smart Dimmer Switch 4-Pack, Zigbee Hub Pro, Smart Lock Deadbolt, Wi-Fi Outdoor Camera 4K, Smart Thermostat Gen 3, Smart Plug 10-Pack
  - **Components (6):** Precision Soldering Station, Oscilloscope 100MHz, Breadboard & Jumper Kit, Resistor Capacitor Assortment 1200pcs, Raspberry Pi Zero 2W, Component Storage Cabinet
  - **Gadgets (6):** Mini Laser Engraver, 3D Pen Pro, Portable Lab Power Supply, Digital Multimeter Auto-Ranging, USB Logic Analyzer 24MHz, Foldable Drone with FPV

- [ ] **Step 4:** Commit
  ```bash
  git add -A && git commit -m "feat: seed 24 sample products with variants and images"
  ```

---

### Task 1.4: TanStack Router Setup + Root Layout

**Files:**
- Create: `src/routes/__root.tsx`
- Create: `src/routes/index.tsx` (placeholder)
- Create: `src/main.tsx` (router provider)
- Create: `src/lib/queryClient.ts`
- Create: `src/stores/authStore.ts`

**Interfaces:**
- Produces: `RootRoute` with `Navbar`, `<Outlet />`, `Footer`, `<Toaster />` (Sonner)
- Produces: `authStore` — `{ session, user, isAdmin, isLoading }` reactive to `supabase.auth.onAuthStateChange`
- Produces: `queryClient` singleton

- [ ] **Step 1:** Install TanStack Router Vite plugin
  ```bash
  npm install @tanstack/router-plugin
  ```
  Add to `vite.config.ts`: `plugins: [TanStackRouterVite(), react(), tailwindcss()]`

- [ ] **Step 2:** Write `src/lib/queryClient.ts` — export `QueryClient` with `staleTime: 60_000`

- [ ] **Step 3:** Write `src/stores/authStore.ts` using Zustand
  - State: `session: Session | null`, `isLoading: boolean`
  - Computed getter `isAdmin`: calls `supabase.rpc("has_role", { uid: user.id, r: "admin" })`
  - Effect: subscribe to `supabase.auth.onAuthStateChange` on creation

- [ ] **Step 4:** Write `src/routes/__root.tsx`
  - Wraps in `QueryClientProvider`, `Toaster` (Sonner, position bottom-right)
  - Renders `<Navbar />`, `<Outlet />`, `<Footer />`

- [ ] **Step 5:** Write `src/main.tsx` — create router from route tree; wrap in `RouterProvider`

- [ ] **Step 6:** Verify dev server starts:
  ```bash
  npm run dev
  ```
  Expected: blank page with no console errors.

- [ ] **Step 7:** Commit
  ```bash
  git add -A && git commit -m "feat: tanstack router setup, root layout, auth store"
  ```

---

### Task 1.5: Navbar Component

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/MobileDrawer.tsx`
- Create: `src/components/layout/CommandPalette.tsx`
- Create: `src/stores/cartStore.ts` (skeleton — full in Phase 2)

**Interfaces:**
- Produces: `<Navbar />` — sticky, glassmorphism (`backdrop-blur-md bg-(--glass)`), z-50
- Produces: `<CartDrawer />` trigger button showing `cartStore.totalItems`
- Produces: `<CommandPalette />` triggered by `Cmd+K` keyboard shortcut
- Consumes: `authStore.session` for conditional Auth button

- [ ] **Step 1:** Write `src/stores/cartStore.ts` skeleton
  - State: `items: CartItem[]` (CartItem: `{ productId, variantId, quantity, price, title, image }`)
  - Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
  - Computed: `totalItems: number`, `subtotalCents: number`
  - Persist to `localStorage` key `mistri_cart` using Zustand `persist` middleware

- [ ] **Step 2:** Write `src/components/layout/Navbar.tsx`
  - Structure: `<header className="fixed top-0 inset-x-0 z-50 h-16 backdrop-blur-md bg-(--glass) border-b border-(--border)">`
  - Left: `<Link to="/">Mistri</Link>` in Syne bold
  - Center (desktop only): nav links — Shop, About, Services, Contact
  - Right: Search icon (Cmd+K trigger), Wishlist icon, Cart button with `totalItems` badge, Auth avatar/button
  - Mobile: Hamburger → `<MobileDrawer />`
  - Dark mode toggle: button cycling `document.documentElement.classList.toggle("dark")`

- [ ] **Step 3:** Write `src/components/layout/MobileDrawer.tsx`
  - Uses shadcn `<Sheet>` from the left
  - Lists nav links; closes on link click via `useNavigate`

- [ ] **Step 4:** Write `src/components/layout/CommandPalette.tsx`
  - Uses shadcn `<Dialog>` opened by `Cmd+K` via `useEffect` + `keydown` listener
  - Input for search query; placeholder product results (wired to real data in Phase 2)

- [ ] **Step 5:** Verify Navbar renders correctly in dev; mobile hamburger opens drawer.

- [ ] **Step 6:** Commit
  ```bash
  git add -A && git commit -m "feat: navbar, mobile drawer, cmd+k palette skeleton"
  ```

---

### Task 1.6: Footer Component

**Files:**
- Create: `src/components/layout/Footer.tsx`

**Interfaces:**
- Produces: `<Footer />` — 4-column grid on desktop, stacked on mobile

- [ ] **Step 1:** Write `src/components/layout/Footer.tsx`
  - Column 1: Brand (logo, tagline, social icons — Twitter/X, GitHub, Instagram, YouTube)
  - Column 2: Shop (All Products, Robotics Kits, Smart Home, Components, Gadgets)
  - Column 3: Company (About, Services, Blog, Careers)
  - Column 4: Support (Contact, FAQ, Returns, Shipping, Track Order)
  - Bottom bar: copyright, Privacy Policy, Terms, Refund Policy links; "Made with ♥ in India"
  - Newsletter input field (wired to DB in Phase 5)
  - Region/currency selector dropdown (display only for now)
  - Social icon hover: magnetic effect using `onMouseMove` transform

- [ ] **Step 2:** Commit
  ```bash
  git add -A && git commit -m "feat: footer component"
  ```

---

### Task 1.7: Home Page — All Sections

**Files:**
- Create: `src/routes/index.tsx`
- Create: `src/components/home/HeroBento.tsx`
- Create: `src/components/home/TrustTicker.tsx`
- Create: `src/components/home/CategoryBento.tsx`
- Create: `src/components/home/FeaturedProducts.tsx`
- Create: `src/components/home/ValueProps.tsx`
- Create: `src/components/home/Testimonials.tsx`
- Create: `src/components/home/FaqAccordion.tsx`
- Create: `src/components/home/NewsletterSignup.tsx`
- Create: `src/hooks/useProducts.ts`

**Interfaces:**
- Consumes: `supabase.from("products").select("*,product_images(*),product_variants(*),categories(*)")` where `is_featured=true` and `status=active`, limit 8
- Consumes: `supabase.from("categories").select("*")` for category bento
- Produces: Fully rendered Home page reading real data from seed

- [ ] **Step 1:** Write `src/hooks/useProducts.ts`
  - `useFeaturedProducts()` → TanStack Query `queryKey: ["products","featured"]` → Supabase query above
  - `useCategories()` → `queryKey: ["categories"]` → `supabase.from("categories").select("*")`

- [ ] **Step 2:** Write `src/components/home/HeroBento.tsx`
  - Full-viewport hero with editorial headline: "The Future Runs on Silicon. Shop Mistri."
  - Subheadline: "Premium electronics, robotics kits, and smart home gear — curated for makers."
  - Two CTAs: `<Button>` "Explore Shop" (links to /shop) + "View Catalog" (outlined)
  - Bento floating chips: "24+ Products", "Free Shipping over $50", "5★ Reviews"
  - Framer Motion: staggered fade-up on mount
  - Background: subtle grid pattern or grainy gradient via CSS

- [ ] **Step 3:** Write `src/components/home/TrustTicker.tsx`
  - Infinite horizontal marquee using CSS `animation: marquee linear infinite`
  - Items: "🔒 Secure Checkout", "🚀 Express Worldwide", "♻️ Carbon Neutral", "✅ Authenticity Verified", "💬 24/7 Support", "🔄 30-Day Returns"

- [ ] **Step 4:** Write `src/components/home/CategoryBento.tsx`
  - 4-cell bento grid (2×2 on mobile, 1×4 or asymmetric on desktop)
  - Each cell: category image, name pill, item count
  - Links to `/shop?category=slug`
  - Hover: scale 1.02 with smooth transition

- [ ] **Step 5:** Write `src/components/home/FeaturedProducts.tsx`
  - Section heading "Featured Products" with acid lime underline accent
  - Horizontal scroll on mobile; 4-column grid on desktop
  - Renders `<ProductCard />` for each featured product (import from `src/components/shop/ProductCard.tsx`)
  - Skeleton loaders while loading (shadcn `<Skeleton />`)

- [ ] **Step 6:** Write `src/components/shop/ProductCard.tsx` (needed by FeaturedProducts)
  - Props: `product: Product` (with first image, price, title, slug, is_featured, compare_at_price, avg_rating)
  - Card: image with hover-zoom via CSS `group-hover:scale-105`, discount badge, title, brand, price with strikethrough, wishlist heart button, "Add to Cart" button
  - Quick View trigger button on image hover

- [ ] **Step 7:** Write `src/components/home/ValueProps.tsx`
  - 3 columns: "Free Shipping over $50" (Truck icon), "Authenticity Verified" (ShieldCheck icon), "30-Day Returns" (RotateCcw icon)
  - Animated counter on scroll-into-view (Framer Motion `useInView`)

- [ ] **Step 8:** Write `src/components/home/Testimonials.tsx`
  - Static testimonials array (5 entries with name, role, review text, 5-star rating, avatar initial)
  - Auto-advancing carousel with dot pagination
  - Verified buyer badge in accent lime

- [ ] **Step 9:** Write `src/components/home/FaqAccordion.tsx`
  - 7 FAQ items using shadcn `<Accordion>`
  - Questions: shipping times, return policy, payment methods, international shipping, warranty, product authenticity, bulk orders

- [ ] **Step 10:** Write `src/components/home/NewsletterSignup.tsx`
  - Email input + "Subscribe" button, full-width dark section
  - On submit: `supabase.from("newsletter_subscribers").insert({ email })` with duplicate handling (409 → "Already subscribed!")
  - Success: Sonner toast "🎉 You're on the list!"

- [ ] **Step 11:** Compose all sections in `src/routes/index.tsx`
  - Order: HeroBento → TrustTicker → CategoryBento → FeaturedProducts → ValueProps → Testimonials → FaqAccordion → NewsletterSignup

- [ ] **Step 12:** Verify Home page renders with real products from DB (requires `.env.local` with Supabase keys).

- [ ] **Step 13:** Commit
  ```bash
  git add -A && git commit -m "feat: home page - all sections reading real DB data"
  ```

---

## Phase 2 — Shop, Product Page, Cart Drawer

---

### Task 2.1: Shop Page (Catalog)

**Files:**
- Create: `src/routes/shop.tsx`
- Create: `src/components/shop/FilterSidebar.tsx`
- Create: `src/components/shop/FilterBottomSheet.tsx`
- Create: `src/components/shop/ProductGrid.tsx`
- Create: `src/components/shop/SortDropdown.tsx`
- Create: `src/components/shop/ViewToggle.tsx`
- Create: `src/components/shop/QuickViewModal.tsx`

**Interfaces:**
- Consumes: `useProducts(filters)` hook — query Supabase with `category`, `minPrice`, `maxPrice`, `brand`, `minRating`, `inStock`, `sort`, `search` params
- Produces: Filterable, sortable, searchable product grid with live Supabase queries via URL search params

- [ ] **Step 1:** Extend `useProducts.ts` with `useProducts(filters: ProductFilters)` — debounced search (300ms), Supabase `.ilike("title", "%q%")`, `.gte("price", min)`, `.lte("price", max)`, `.eq("status", "active")`, `.order(sortField, sortDir)`

- [ ] **Step 2:** Write `src/routes/shop.tsx`
  - Read filter state from URL search params via TanStack Router `useSearch()`
  - Layout: sidebar (desktop) / filter sheet trigger (mobile) + product grid + sort/view controls

- [ ] **Step 3:** Write `FilterSidebar.tsx` — price range (shadcn `Slider`), category checkboxes, brand checkboxes, rating filter, in-stock toggle; updates URL params

- [ ] **Step 4:** Write `FilterBottomSheet.tsx` — same filters in a shadcn `<Sheet>` from bottom for mobile

- [ ] **Step 5:** Write `ProductGrid.tsx` — grid/list view toggle; maps products to `<ProductCard>`; empty state illustration + "Clear filters" CTA when no results

- [ ] **Step 6:** Write `SortDropdown.tsx` — options: Newest, Price: Low to High, Price: High to Low, Best Rated, Most Popular

- [ ] **Step 7:** Write `QuickViewModal.tsx` — shadcn `<Dialog>` with product image, title, price, variant selector, quantity, Add to Cart button

- [ ] **Step 8:** Commit `git commit -m "feat: shop page with filters, sort, grid/list, quick view"`

---

### Task 2.2: Product Detail Page (PDP)

**Files:**
- Create: `src/routes/product.$slug.tsx`
- Create: `src/components/product/ImageGallery.tsx`
- Create: `src/components/product/VariantSelector.tsx`
- Create: `src/components/product/QuantitySelector.tsx`
- Create: `src/components/product/ProductTabs.tsx`
- Create: `src/components/product/RelatedProducts.tsx`
- Create: `src/hooks/useProduct.ts`

**Interfaces:**
- Consumes: `useProduct(slug)` → `supabase.from("products").select("*,product_images(*),product_variants(*),reviews(*,profiles(full_name)),categories(name)").eq("slug", slug).single()`
- Produces: Full PDP with image gallery, variant selection, stock awareness, add-to-cart

- [ ] **Step 1:** Write `useProduct(slug: string)` hook

- [ ] **Step 2:** Write `ImageGallery.tsx` — main image with hover-zoom (`object-fit: cover`, scale on hover), thumbnail strip, Framer Motion lightbox on click

- [ ] **Step 3:** Write `VariantSelector.tsx` — pill buttons for each variant option; selected state in accent lime; shows stock count per variant (`variant.stock > 0` else "Out of Stock" greyed)

- [ ] **Step 4:** Write `QuantitySelector.tsx` — `[−] [n] [+]` capped at selected variant stock; min 1

- [ ] **Step 5:** Write `ProductTabs.tsx` — shadcn `<Tabs>`: "Description", "Specs", "Shipping & Returns", "Reviews"; Reviews tab renders `<ReviewsList />` and `<ReviewForm />`

- [ ] **Step 6:** Write `src/routes/product.$slug.tsx` — 2-column layout (gallery left, info right); sticky "Add to Bag" + "Buy Now" buttons on mobile bottom; share button

- [ ] **Step 7:** Write `RelatedProducts.tsx` — same category, excluding current product, limit 4

- [ ] **Step 8:** Commit `git commit -m "feat: product detail page - gallery, variants, tabs, related"`

---

### Task 2.3: Cart Store + Cart Drawer

**Files:**
- Modify: `src/stores/cartStore.ts` (complete implementation)
- Create: `src/components/layout/CartDrawer.tsx`

**Interfaces:**
- Consumes: `cartStore` — `items`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `totalItems`, `subtotalCents`
- Produces: Slide-over cart drawer with free shipping progress bar, promo code input, checkout CTA

- [ ] **Step 1:** Complete `cartStore.ts` with Zustand `persist` middleware; type `CartItem` exactly as: `{ productId: string; variantId: string; quantity: number; price: number; title: string; image: string; variantTitle: string }`

- [ ] **Step 2:** Write `CartDrawer.tsx` using shadcn `<Sheet>` from the right
  - Item list: thumbnail, title, variant, unit price, qty inc/dec, remove button
  - Free shipping bar: `<Progress value={(subtotal / FREE_SHIPPING_THRESHOLD) * 100} />` with text "X more for free shipping!" or "🎉 Free shipping unlocked!"
  - Promo code: input + "Apply" button → calls `/api/validate-promo` Edge Function (Phase 3); for now, placeholder
  - Totals: Subtotal, Shipping (Free or $5.99), Estimated Total
  - "Proceed to Checkout" button → navigates to `/checkout`
  - Empty state: illustration + "Start Shopping" CTA

- [ ] **Step 3:** Add `addItem` calls in `ProductCard.tsx`, `QuickViewModal.tsx`, PDP "Add to Bag" button; show Sonner toast on add

- [ ] **Step 4:** Verify cart persists across page refreshes (check localStorage key `mistri_cart`)

- [ ] **Step 5:** Commit `git commit -m "feat: cart store with persistence, cart drawer"`

---

## Phase 3 — Auth, Checkout, Orders

---

### Task 3.1: Auth Page

**Files:**
- Create: `src/routes/auth.tsx`
- Create: `src/routes/reset-password.tsx`
- Create: `src/components/auth/AuthForm.tsx`
- Create: `src/components/auth/PasswordStrengthMeter.tsx`

**Interfaces:**
- Consumes: `supabase.auth.signUp`, `supabase.auth.signInWithPassword`, `supabase.auth.signInWithOAuth({ provider: "google" })`, `supabase.auth.resetPasswordForEmail`
- Produces: Tabbed sign-in/sign-up form with Google OAuth, magic link, password reset

- [ ] **Step 1:** Write `AuthForm.tsx` with React Hook Form + Zod schemas: `signInSchema` (email, password), `signUpSchema` (email, password min 8 chars, confirmPassword)

- [ ] **Step 2:** Write `PasswordStrengthMeter.tsx` — 4-segment bar; levels: Weak / Fair / Good / Strong based on length + special chars + numbers

- [ ] **Step 3:** On successful sign-up, insert row into `profiles` table (triggered also by DB trigger, but handle in app as fallback)

- [ ] **Step 4:** Redirect authenticated user away from `/auth` to `/account`

- [ ] **Step 5:** Write `reset-password.tsx` — email input → `supabase.auth.resetPasswordForEmail`; handle `#access_token` in URL hash for new password form

- [ ] **Step 6:** Commit `git commit -m "feat: auth page - sign up, sign in, google oauth, password reset"`

---

### Task 3.2: Stripe Checkout Edge Functions

**Files:**
- Create: `supabase/functions/create-checkout/index.ts`
- Create: `supabase/functions/stripe-webhook/index.ts`
- Create: `src/routes/checkout.tsx`
- Create: `src/routes/order.$id.tsx`
- Create: `src/components/checkout/AddressForm.tsx`
- Create: `src/components/checkout/ShippingMethodSelector.tsx`
- Create: `src/components/checkout/OrderSummary.tsx`

**Interfaces:**
- `create-checkout` Edge Function signature: POST body `{ cartItems: CartItem[], promoCode?: string, shippingAddress: Address, shippingMethod: "standard"|"express" }` → returns `{ url: string }` (Stripe hosted checkout URL)
- `stripe-webhook` Edge Function: verifies `Stripe-Signature` header; on `checkout.session.completed` → creates `orders` row + `order_items` rows + decrements `product_variants.stock`
- Produces: Multi-step checkout page, order confirmation page

- [ ] **Step 1:** Write `create-checkout/index.ts`
  - Recompute prices from DB (never trust client prices)
  - Validate promo code from `promo_codes` table server-side
  - Apply shipping fee: standard $5.99 (free ≥ $50), express $14.99
  - Create Stripe Checkout Session with `line_items`, `success_url=/order/{id}`, `cancel_url=/checkout`
  - Return `{ url }` to client

- [ ] **Step 2:** Write `stripe-webhook/index.ts`
  - Verify signature: `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`
  - On `checkout.session.completed`: parse metadata → insert `orders` + `order_items` → decrement stock (floor at 0) → idempotency guard on `stripe_session_id`

- [ ] **Step 3:** Write `src/routes/checkout.tsx` — 3-step accordion page:
  1. Address (renders `AddressForm.tsx`; prefills from saved addresses if logged in)
  2. Shipping Method (Standard 5–7 days / Express 1–2 days)
  3. Review + Pay (renders `OrderSummary.tsx`; "Pay Now" button calls `create-checkout` Edge Function then `window.location.href = url`)

- [ ] **Step 4:** Write `src/routes/order.$id.tsx`
  - Fetches order by ID: `supabase.from("orders").select("*,order_items(*,products(title),product_variants(title))").eq("id", id).single()`
  - Animated checkmark (Framer Motion draw SVG), order number, items, shipping address, status timeline (Pending → Paid → Shipped → Delivered)
  - "Continue Shopping" and "View Account" CTAs

- [ ] **Step 5:** Verify Stripe test flow end-to-end using test card `4242 4242 4242 4242`

- [ ] **Step 6:** Commit `git commit -m "feat: stripe checkout, webhook, order confirmation"`

---

## Phase 4 — Wishlist, Reviews, Addresses, Admin

---

### Task 4.1: Account Dashboard

**Files:**
- Create: `src/routes/_authenticated.tsx`
- Create: `src/routes/_authenticated.account.tsx`
- Create: `src/components/account/OrderHistory.tsx`
- Create: `src/components/account/WishlistTab.tsx`
- Create: `src/components/account/AddressBook.tsx`
- Create: `src/components/account/ProfileForm.tsx`

**Interfaces:**
- Consumes: `useOrders()`, `useWishlist()`, auth session
- Produces: Tabbed account dashboard — Orders, Wishlist, Addresses, Profile, Security

- [ ] **Step 1:** Write `_authenticated.tsx` layout — redirect to `/auth` if no session; renders `<Outlet />`

- [ ] **Step 2:** Write `src/hooks/useOrders.ts` — `supabase.from("orders").select("*,order_items(*)").eq("user_id", uid).order("created_at", { ascending: false })`

- [ ] **Step 3:** Write `OrderHistory.tsx` — table of orders with status badge, total, date, "View Details" link to `/order/$id`

- [ ] **Step 4:** Write `src/hooks/useWishlist.ts` — wishlist CRUD; optimistic updates on toggle

- [ ] **Step 5:** Write `WishlistTab.tsx` — grid of wishlisted products with remove button and "Add to Cart"

- [ ] **Step 6:** Write `AddressBook.tsx` — list saved addresses; "Add Address" form (shadcn Dialog); set default address

- [ ] **Step 7:** Write `ProfileForm.tsx` — update `profiles.full_name` and `avatar_url`; "Change Password" button → email reset flow

- [ ] **Step 8:** Compose in `_authenticated.account.tsx` with shadcn `<Tabs>`

- [ ] **Step 9:** Commit `git commit -m "feat: account dashboard - orders, wishlist, addresses, profile"`

---

### Task 4.2: Reviews

**Files:**
- Create: `src/components/product/ReviewsList.tsx`
- Create: `src/components/product/ReviewForm.tsx`

**Interfaces:**
- Consumes: `reviews` table joined to `profiles`
- Produces: Star rating input, review form (verified purchase only), distribution chart, paginated list

- [ ] **Step 1:** Write `ReviewsList.tsx`
  - Rating distribution: 5 rows, each showing `<Progress value={pct} />` + count
  - Paginated reviews (10/page) with star display, reviewer name + initial avatar, date, comment

- [ ] **Step 2:** Write `ReviewForm.tsx`
  - Star click rating input (1–5); comment textarea; Zod schema
  - Submit: `supabase.from("reviews").insert(...)`, invalidate query on success
  - Show only if user is authenticated; show "Purchase to review" if `verified_purchase=false`

- [ ] **Step 3:** Commit `git commit -m "feat: product reviews - list, distribution, write review"`

---

### Task 4.3: Admin Dashboard + Listing Wizard

**Files:**
- Create: `src/routes/_authenticated.admin.tsx`
- Create: `src/components/admin/ListingWizard.tsx`
- Create: `src/components/admin/ProductTable.tsx`
- Create: `src/components/admin/SalesDashboard.tsx`
- Create: `src/components/admin/ImageUploader.tsx`
- Create: `supabase/functions/admin-products/index.ts`

**Interfaces:**
- Consumes: `has_role(uid, "admin")` check; `admin-products` Edge Function for write operations
- Produces: 4-step product listing wizard; product management table; sales metrics; Supabase Storage image upload

- [ ] **Step 1:** Write `_authenticated.admin.tsx` layout — redirect to `/` if `!isAdmin`

- [ ] **Step 2:** Write `admin-products/index.ts` Edge Function — CRUD product operations using service role key; validates caller has admin role

- [ ] **Step 3:** Write `ImageUploader.tsx`
  - Drag-and-drop zone (react-dropzone or native)
  - Accept: `image/jpeg`, `image/png`, `image/webp`; max size: 5MB per file
  - Upload to Supabase Storage: `supabase.storage.from("product-images").upload(path, file)`
  - Preview thumbnails with reorder (drag) and delete

- [ ] **Step 4:** Write `ListingWizard.tsx` — 4-step wizard with progress bar:
  - Step 1: Title, category, brand, tags, description (rich textarea)
  - Step 2: Image upload via `ImageUploader.tsx`
  - Step 3: Price, compare-at price, variants table (add/edit/remove variant rows with SKU, price, stock)
  - Step 4: Shipping (weight, dimensions) + publish toggle
  - Submit: calls `admin-products` Edge Function; redirects to product page on success

- [ ] **Step 5:** Write `ProductTable.tsx` — data table of all products (shadcn Table); columns: image, title, category, price, stock, status badge; row actions: Edit (opens wizard prefilled), Archive, Toggle Featured

- [ ] **Step 6:** Write `SalesDashboard.tsx` — 4 metric cards: Total Revenue, Total Orders, Products Listed, Low Stock Alerts; simple bar chart of orders per day (last 30 days) using Recharts or CSS bars

- [ ] **Step 7:** Compose in `_authenticated.admin.tsx` — tabs: Dashboard, Products, Add Product

- [ ] **Step 8:** Commit `git commit -m "feat: admin dashboard, listing wizard, image upload, sales metrics"`

---

## Phase 5 — Secondary Pages, SEO, Newsletter, E2E Polish

---

### Task 5.1: About, Services, Contact Pages

**Files:**
- Create: `src/routes/about.tsx`
- Create: `src/routes/services.tsx`
- Create: `src/routes/contact.tsx`

- [ ] **Step 1:** Write `about.tsx` — brand manifesto, milestone timeline (Framer Motion scroll-triggered), values grid (6 icons), team section with initials avatars

- [ ] **Step 2:** Write `services.tsx`
  - 4 service tiers: Bespoke Sourcing, Installation Support, Extended Warranty, Custom Build
  - Comparison matrix table (shadcn Table)
  - Inquiry modal (opens `<Dialog>` with form writing to `service_inquiries` table)

- [ ] **Step 3:** Write `contact.tsx`
  - 2-column: left = contact info (email, phone, hours) + map placeholder div with styled CSS
  - Right = React Hook Form + Zod: name, email, subject dropdown, message textarea
  - On submit: generate `ticket_id = "MST-" + Date.now().toString(36).toUpperCase()`, insert into `contact_messages`, show toast with ticket ID

- [ ] **Step 4:** Wire newsletter form in `Footer.tsx` to Supabase

- [ ] **Step 5:** Add page titles + Open Graph meta tags to every route using TanStack Router `<Head>` or a `useSeoMeta` utility

- [ ] **Step 6:** Write `src/routes/404.tsx` — animated 404 page with "Go Home" CTA

- [ ] **Step 7:** Write `src/components/layout/CartDrawer.tsx` — wire promo code validation to `create-checkout` Edge Function (or a dedicated `/api/validate-promo` function)

- [ ] **Step 8:** Full E2E test checklist:
  - [ ] Browse Home → category bento → Shop
  - [ ] Filter by price + category; search a product
  - [ ] Open product page → select variant → add to cart
  - [ ] Open cart drawer → apply promo → proceed to checkout
  - [ ] Fill address → select shipping → Stripe test card `4242 4242 4242 4242` → pay
  - [ ] Land on order confirmation page; verify order in DB
  - [ ] Check product stock decremented
  - [ ] Log in → check order in `/account`
  - [ ] Add review on product page
  - [ ] Admin: list a new product via wizard → verify on Shop page

- [ ] **Step 9:** Final commit
  ```bash
  git add -A && git commit -m "feat: about, services, contact, SEO, newsletter, full E2E tested"
  ```

---

## Deployment Checklist (Post-Phase 5)

- [ ] Set `VITE_STRIPE_PUBLISHABLE_KEY` to live key; `STRIPE_SECRET_KEY` to live secret
- [ ] Disable Stripe test mode
- [ ] Configure Stripe Tax in Stripe Dashboard (business address, tax settings)
- [ ] Set up Supabase Storage bucket `product-images` with public read policy
- [ ] Deploy Edge Functions: `supabase functions deploy create-checkout stripe-webhook admin-products`
- [ ] Register Stripe webhook endpoint in Stripe Dashboard → `https://your-project.supabase.co/functions/v1/stripe-webhook`
- [ ] Set up custom domain in Supabase Auth → Site URL
- [ ] Add Google OAuth credentials in Supabase Auth providers
- [ ] Deploy frontend to Vercel/Netlify; set all `VITE_` env vars
