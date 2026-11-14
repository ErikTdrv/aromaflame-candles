-- AromaFlame Candles — Supabase setup
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- It is safe to run more than once.

-- ---------------------------------------------------------------------------
-- 1. Admins: which logged-in users may manage products and see orders
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  scent_notes text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  size text not null default '',
  burn_time text not null default '',
  description text not null default '',
  accent_from text not null default '#f0c9a0',
  accent_to text not null default '#c97c4b',
  image_url text not null default '',
  occasion text not null default 'Универсален',
  badge text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Several photos per product. The first one is the cover and is also kept
-- in image_url.
alter table public.products
  add column if not exists images text[] not null default '{}';

update public.products
set images = array[image_url]
where images = '{}' and image_url <> '';

alter table public.products enable row level security;

drop policy if exists "Anyone can see active products" on public.products;
create policy "Anyone can see active products"
  on public.products for select
  using (active or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  phone text not null check (char_length(phone) between 5 and 40),
  email text check (email is null or char_length(email) <= 160),
  city text not null check (char_length(city) between 1 and 120),
  address text not null check (char_length(address) between 1 and 300),
  delivery text not null default 'econt' check (char_length(delivery) <= 40),
  note text check (note is null or char_length(note) <= 1000),
  items jsonb not null check (
    jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 50
  ),
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'shipped', 'done', 'cancelled'))
);

alter table public.orders enable row level security;

-- Visitors can only add a new order. They cannot read anyone's orders.
drop policy if exists "Anyone can place an order" on public.orders;
create policy "Anyone can place an order"
  on public.orders for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders"
  on public.orders for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete orders" on public.orders;
create policy "Admins delete orders"
  on public.orders for delete
  to authenticated
  using (public.is_admin());

grant insert on public.orders to anon, authenticated;
grant select, update, delete on public.orders to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Photo storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. The five current products (skipped if they already exist)
-- ---------------------------------------------------------------------------
insert into public.products
  (id, name, scent_notes, price, size, burn_time, description, accent_from, accent_to, image_url, occasion, badge, sort_order)
values
  ('koshnica-tsvetya', 'Кошница с ароматни цветя', 'Рози, ванилия и полски билки', 42,
   'Плетена кутия с дръжка, ~20 см', '9 восъчни цветя, всяко до 5 ч.',
   'Богат букет от ръчно оформени восъчни цветя в розово, оранжево и лилаво, подреден в елегантна кутия с дръжка и декориран със сухи метлички. Универсален подарък за всеки повод.',
   '#f0c9a0', '#c97c4b', '/images/products/basket-mixed.jpg', 'Универсален', 'Любимо', 1),
  ('rozhden-den', 'Честит Рожден Ден', 'Праскова, ванилия и кехлибар', 36,
   'Подаръчна кутия със златна верижка', '7 восъчни цветя, всяко до 4 ч.',
   'Топла есенна палитра от восъчни цветя в прасковено и бежово, увенчана със златен надпис „Happy Birthday“. Перфектен подарък за рожден ден.',
   '#e8b98a', '#a8451f', '/images/products/birthday-box.jpg', 'Рожден ден', null, 2),
  ('uspeh-abiturient', 'Успех, Абитуриент!', 'Божур, рози и мускус', 38,
   'Розова кутия със златна верижка', '6 восъчни цветя, всяко до 4 ч.',
   'Нежен розов букет от восъчни цветя с декоративна пеперуда и миниатюрна абитуриентска шапка. Специален подарък за завършване.',
   '#f0c9d1', '#c15c72', '/images/products/graduation-box.jpg', 'Абитуриент', null, 3),
  ('abiturientska-vaza', 'Абитуриентска ваза', 'Бяла роза, божур и ванилия', 40,
   'Керамична ваза с диплома-топер', '5 восъчни цветя, всяко до 5 ч.',
   'Елегантна композиция от бели и розови восъчни цветя, поставена в керамична ваза с декоративна диплома и пискюл. Запомнящ се подарък за абитуриент.',
   '#f5e6c8', '#d9a441', '/images/products/graduation-vase.jpg', 'Абитуриент', null, 4),
  ('rozova-naslada', 'Розова наслада', 'Роза, божур и бял мускус', 32,
   'Декоративна кутия с флорален десен', '9 восъчни рози, всяка до 3 ч.',
   'Компактен букет от розови и бели восъчни рози, подреден в декоративна кутия с флорални мотиви. Идеален за спалня или тоалетка.',
   '#e8b9d1', '#a8457a', '/images/products/rose-tin.jpg', 'Романтичен', 'Ново', 5)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 6. Make your login an admin
--    First create the user in Authentication → Users → Add user, then run this.
--    To add another admin later, run just this statement with their email.
-- ---------------------------------------------------------------------------
insert into public.admins (user_id)
select id from auth.users where email = 'eriktdrv@gmail.com'
on conflict (user_id) do nothing;
