-- BAZ schema + RLS. Run in Supabase SQL editor.
create table profiles(id uuid primary key references auth.users on delete cascade, full_name text, phone text, role text not null default 'customer');
create function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
create function handle_new_user() returns trigger language plpgsql security definer as $$ begin insert into profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function handle_new_user();

create table categories(id serial primary key, slug text unique, name_en text, name_ar text, sort int default 0);
create table products(id uuid primary key default gen_random_uuid(), category_id int references categories, name_en text not null, name_ar text, desc_en text, desc_ar text,
  vehicle_types text[] default '{car,truck,4x4}', price numeric(10,2), stock text default 'in_stock', specs jsonb default '{}', images text[] default '{}', featured bool default false, active bool default true, created_at timestamptz default now());
create table inhouse_items(id uuid primary key default gen_random_uuid(), name_en text, name_ar text, desc_en text, desc_ar text, materials text, colors text[], production_time text, price_from numeric(10,2), images text[] default '{}', active bool default true);
create table orders(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users default auth.uid(), items jsonb, total numeric(10,2), payment_method text, address text, status text default 'new', created_at timestamptz default now());
create table requests(id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users default auth.uid(), kind text, details jsonb, status text default 'new', created_at timestamptz default now());
create table settings(key text primary key, value text);

alter table profiles enable row level security; alter table categories enable row level security; alter table products enable row level security;
alter table inhouse_items enable row level security; alter table orders enable row level security; alter table requests enable row level security; alter table settings enable row level security;
create policy "own profile" on profiles for select using (id=auth.uid() or is_admin());
create policy "own profile edit" on profiles for update using (id=auth.uid()) with check (id=auth.uid() and role='customer');
create policy "admin profiles" on profiles for all using (is_admin());
create policy "public read" on categories for select using (true);
create policy "public read" on settings for select using (true);
create policy "public read" on products for select using (active or is_admin());
create policy "public read" on inhouse_items for select using (active or is_admin());
create policy "admin all" on categories for all using (is_admin()); create policy "admin all" on products for all using (is_admin());
create policy "admin all" on inhouse_items for all using (is_admin()); create policy "admin all" on settings for all using (is_admin());
create policy "own orders" on orders for select using (user_id=auth.uid() or is_admin());
create policy "place order" on orders for insert with check (user_id=auth.uid());
create policy "admin orders" on orders for update using (is_admin());
create policy "own requests" on requests for select using (user_id=auth.uid() or is_admin());
create policy "send request" on requests for insert with check (user_id=auth.uid());
create policy "admin requests" on requests for update using (is_admin());

insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
create policy "media read" on storage.objects for select using (bucket_id='media');
create policy "media admin write" on storage.objects for all using (bucket_id='media' and is_admin());
-- After creating your account in the site, make yourself admin:
-- update profiles set role='admin' where id=(select id from auth.users where email='YOUR_EMAIL');
