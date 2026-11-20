-- ============================================================
-- Mistri E-Commerce — Full Schema Migration
-- File: 001_schema.sql
-- ============================================================

-- ----------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ================================================================
-- TABLES
-- ================================================================

-- ----------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- products
-- ----------------------------------------------------------------
create table if not exists products (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  slug              text not null unique,
  description       text,
  price             integer not null,          -- stored in smallest currency unit (paise/cents)
  compare_at_price  integer,
  category_id       uuid references categories(id) on delete set null,
  brand             text,
  status            text not null default 'active' check (status in ('active', 'draft', 'archived')),
  is_featured       boolean not null default false,
  tags              text[] not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- product_images
-- ----------------------------------------------------------------
create table if not exists product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  alt         text,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- product_variants
-- ----------------------------------------------------------------
create table if not exists product_variants (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  title       text not null,
  sku         text unique,
  price       integer not null,
  stock       integer not null default 0,
  options     jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- profiles  (mirrors auth.users 1-to-1)
-- ----------------------------------------------------------------
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_url   text,
  phone        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- user_roles
-- ----------------------------------------------------------------
create table if not exists user_roles (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'buyer' check (role in ('buyer', 'admin', 'vendor')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- ----------------------------------------------------------------
-- has_role() helper function
-- ----------------------------------------------------------------
create or replace function has_role(user_id uuid, role_name text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_roles
    where user_roles.user_id = $1
      and user_roles.role    = $2
  );
$$;

-- ----------------------------------------------------------------
-- orders
-- ----------------------------------------------------------------
create table if not exists orders (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete restrict,
  status          text not null default 'pending'
                    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  total_amount    integer not null,
  shipping_address jsonb,
  payment_method  text,
  payment_id      text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- order_items
-- ----------------------------------------------------------------
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  variant_id  uuid references product_variants(id) on delete set null,
  title       text not null,
  sku         text,
  price       integer not null,
  quantity    integer not null check (quantity > 0),
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- wishlist_items
-- ----------------------------------------------------------------
create table if not exists wishlist_items (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ----------------------------------------------------------------
-- reviews
-- ----------------------------------------------------------------
create table if not exists reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  title       text,
  body        text,
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

-- ----------------------------------------------------------------
-- addresses
-- ----------------------------------------------------------------
create table if not exists addresses (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  label        text,                             -- e.g. 'Home', 'Office'
  full_name    text not null,
  phone        text,
  line1        text not null,
  line2        text,
  city         text not null,
  state        text not null,
  postal_code  text not null,
  country      text not null default 'IN',
  is_default   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- contact_messages
-- ----------------------------------------------------------------
create table if not exists contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- service_inquiries
-- ----------------------------------------------------------------
create table if not exists service_inquiries (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  phone        text,
  service_type text,
  description  text not null,
  budget       text,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- newsletter_subscribers
-- ----------------------------------------------------------------
create table if not exists newsletter_subscribers (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  subscribed_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- promo_codes
-- ----------------------------------------------------------------
create table if not exists promo_codes (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  description     text,
  discount_type   text not null check (discount_type in ('percentage', 'fixed')),
  discount_value  integer not null,          -- percentage (0-100) or fixed amount
  min_order_value integer,
  max_uses        integer,
  used_count      integer not null default 0,
  is_active       boolean not null default true,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

alter table categories             enable row level security;
alter table products               enable row level security;
alter table product_images         enable row level security;
alter table product_variants       enable row level security;
alter table profiles               enable row level security;
alter table user_roles             enable row level security;
alter table orders                 enable row level security;
alter table order_items            enable row level security;
alter table wishlist_items         enable row level security;
alter table reviews                enable row level security;
alter table addresses              enable row level security;
alter table contact_messages       enable row level security;
alter table service_inquiries      enable row level security;
alter table newsletter_subscribers enable row level security;
alter table promo_codes            enable row level security;

-- ================================================================
-- RLS POLICIES
-- ================================================================

-- ----------------------------------------------------------------
-- categories — public read, admin write
-- ----------------------------------------------------------------
create policy "categories: public read"
  on categories for select
  using (true);

create policy "categories: admin insert"
  on categories for insert
  with check (has_role(auth.uid(), 'admin'));

create policy "categories: admin update"
  on categories for update
  using (has_role(auth.uid(), 'admin'));

create policy "categories: admin delete"
  on categories for delete
  using (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------
-- products — public read (active only), admin write
-- ----------------------------------------------------------------
create policy "products: public read active"
  on products for select
  using (status = 'active');

create policy "products: admin insert"
  on products for insert
  with check (has_role(auth.uid(), 'admin'));

create policy "products: admin update"
  on products for update
  using (has_role(auth.uid(), 'admin'));

create policy "products: admin delete"
  on products for delete
  using (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------
-- product_images — public read, admin write
-- ----------------------------------------------------------------
create policy "product_images: public read"
  on product_images for select
  using (true);

create policy "product_images: admin insert"
  on product_images for insert
  with check (has_role(auth.uid(), 'admin'));

create policy "product_images: admin update"
  on product_images for update
  using (has_role(auth.uid(), 'admin'));

create policy "product_images: admin delete"
  on product_images for delete
  using (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------
-- product_variants — public read, admin write
-- ----------------------------------------------------------------
create policy "product_variants: public read"
  on product_variants for select
  using (true);

create policy "product_variants: admin insert"
  on product_variants for insert
  with check (has_role(auth.uid(), 'admin'));

create policy "product_variants: admin update"
  on product_variants for update
  using (has_role(auth.uid(), 'admin'));

create policy "product_variants: admin delete"
  on product_variants for delete
  using (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------
-- profiles — owner all
-- ----------------------------------------------------------------
create policy "profiles: owner select"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: owner insert"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles: owner update"
  on profiles for update
  using (auth.uid() = id);

create policy "profiles: owner delete"
  on profiles for delete
  using (auth.uid() = id);

-- ----------------------------------------------------------------
-- user_roles — owner select only
-- ----------------------------------------------------------------
create policy "user_roles: owner select"
  on user_roles for select
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- orders — owner select
-- ----------------------------------------------------------------
create policy "orders: owner select"
  on orders for select
  using (auth.uid() = user_id);

create policy "orders: owner insert"
  on orders for insert
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- order_items — owner select via orders join
-- ----------------------------------------------------------------
create policy "order_items: owner select"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id      = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- wishlist_items — owner all
-- ----------------------------------------------------------------
create policy "wishlist_items: owner select"
  on wishlist_items for select
  using (auth.uid() = user_id);

create policy "wishlist_items: owner insert"
  on wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "wishlist_items: owner update"
  on wishlist_items for update
  using (auth.uid() = user_id);

create policy "wishlist_items: owner delete"
  on wishlist_items for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- reviews — public select, owner insert/delete
-- ----------------------------------------------------------------
create policy "reviews: public select"
  on reviews for select
  using (true);

create policy "reviews: owner insert"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews: owner delete"
  on reviews for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- addresses — owner all
-- ----------------------------------------------------------------
create policy "addresses: owner select"
  on addresses for select
  using (auth.uid() = user_id);

create policy "addresses: owner insert"
  on addresses for insert
  with check (auth.uid() = user_id);

create policy "addresses: owner update"
  on addresses for update
  using (auth.uid() = user_id);

create policy "addresses: owner delete"
  on addresses for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- contact_messages — insert only (anon + authenticated)
-- ----------------------------------------------------------------
create policy "contact_messages: insert only"
  on contact_messages for insert
  with check (true);

-- ----------------------------------------------------------------
-- service_inquiries — insert only (anon + authenticated)
-- ----------------------------------------------------------------
create policy "service_inquiries: insert only"
  on service_inquiries for insert
  with check (true);

-- ----------------------------------------------------------------
-- newsletter_subscribers — insert only (anon + authenticated)
-- ----------------------------------------------------------------
create policy "newsletter_subscribers: insert only"
  on newsletter_subscribers for insert
  with check (true);

-- ----------------------------------------------------------------
-- promo_codes — public select (is_active = true)
-- ----------------------------------------------------------------
create policy "promo_codes: public read active"
  on promo_codes for select
  using (is_active = true);

create policy "promo_codes: admin insert"
  on promo_codes for insert
  with check (has_role(auth.uid(), 'admin'));

create policy "promo_codes: admin update"
  on promo_codes for update
  using (has_role(auth.uid(), 'admin'));

create policy "promo_codes: admin delete"
  on promo_codes for delete
  using (has_role(auth.uid(), 'admin'));

-- ================================================================
-- TRIGGER: auto-create profile + buyer role on new user sign-up
-- ================================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'buyer');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
