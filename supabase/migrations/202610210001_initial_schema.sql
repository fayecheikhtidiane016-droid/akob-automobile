create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create type public.app_role as enum ('owner', 'assistant', 'developer');
create type public.listing_type as enum ('rent', 'sale', 'both');
create type public.vehicle_status as enum ('available', 'reserved', 'rented', 'sold', 'unavailable');
create type public.reservation_status as enum ('pending', 'confirmed', 'declined', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null,
  developer_access boolean not null default false,
  full_name text,
  created_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  year integer not null check (year between 1950 and 2100),
  category text not null,
  daily_rate integer check (daily_rate is null or daily_rate >= 0),
  sale_price bigint check (sale_price is null or sale_price >= 0),
  mileage integer check (mileage is null or mileage >= 0),
  fuel text not null default '',
  transmission text not null default '',
  seats integer not null default 5 check (seats between 1 and 20),
  color text not null default '',
  description text not null default '',
  features jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  listing_type public.listing_type not null,
  status public.vehicle_status not null default 'available',
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (listing_type <> 'rent' or daily_rate is not null),
  check (listing_type <> 'sale' or sale_price is not null),
  check (listing_type <> 'both' or (daily_rate is not null and sale_price is not null))
);

create table public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '',
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index vehicle_photos_one_primary_per_vehicle
  on public.vehicle_photos(vehicle_id) where is_primary;
create index vehicle_photos_vehicle_order_idx on public.vehicle_photos(vehicle_id, sort_order);
create index vehicles_public_listing_idx on public.vehicles(published, listing_type, status);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 40),
  email text check (email is null or char_length(email) <= 254),
  start_at timestamptz not null,
  end_at timestamptz not null,
  pickup_location text not null,
  return_location text not null,
  customer_notes text,
  internal_notes text,
  status public.reservation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

alter table public.reservations add constraint reservations_no_confirmed_overlap
  exclude using gist (vehicle_id with =, tstzrange(start_at, end_at, '[)') with &&)
  where (status = 'confirmed');
create index reservations_vehicle_dates_idx on public.reservations(vehicle_id, start_at, end_at);
create index reservations_status_created_idx on public.reservations(status, created_at desc);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 40),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 5 and 3000),
  created_at timestamptz not null default now()
);

create table public.agency_settings (
  id boolean primary key default true check (id),
  agency_name text not null default 'Akob Automobile',
  phone text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  address text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  updated_at timestamptz not null default now()
);

create function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = (select auth.uid())
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vehicles_set_updated_at before update on public.vehicles
  for each row execute function public.set_updated_at();
create trigger reservations_set_updated_at before update on public.reservations
  for each row execute function public.set_updated_at();
create trigger agency_settings_set_updated_at before update on public.agency_settings
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_photos enable row level security;
alter table public.reservations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.agency_settings enable row level security;

create policy "profiles_read_self_or_manager" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.current_user_role()) in ('owner', 'developer'));
create policy "profiles_manage_owner_developer" on public.profiles for all to authenticated
  using ((select public.current_user_role()) in ('owner', 'developer'))
  with check ((select public.current_user_role()) in ('owner', 'developer'));

create policy "vehicles_read_published" on public.vehicles for select to anon, authenticated
  using (published or (select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "vehicles_insert_staff" on public.vehicles for insert to authenticated
  with check ((select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "vehicles_update_staff" on public.vehicles for update to authenticated
  using ((select public.current_user_role()) in ('owner', 'assistant', 'developer'))
  with check ((select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "vehicles_delete_owner_developer" on public.vehicles for delete to authenticated
  using ((select public.current_user_role()) in ('owner', 'developer'));

create policy "vehicle_photos_read_published" on public.vehicle_photos for select to anon, authenticated
  using (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.published)
    or (select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "vehicle_photos_manage_staff" on public.vehicle_photos for all to authenticated
  using ((select public.current_user_role()) in ('owner', 'assistant', 'developer'))
  with check ((select public.current_user_role()) in ('owner', 'assistant', 'developer'));

create policy "reservations_insert_public_request" on public.reservations for insert to anon, authenticated
  with check (
    status = 'pending' and internal_notes is null
    and start_at > now()
    and exists (select 1 from public.vehicles v where v.id = vehicle_id and v.published and v.listing_type in ('rent', 'both'))
  );
create policy "reservations_read_staff" on public.reservations for select to authenticated
  using ((select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "reservations_update_staff" on public.reservations for update to authenticated
  using ((select public.current_user_role()) in ('owner', 'assistant', 'developer'))
  with check ((select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "reservations_delete_owner_developer" on public.reservations for delete to authenticated
  using ((select public.current_user_role()) in ('owner', 'developer'));

create policy "contact_messages_insert_public" on public.contact_messages for insert to anon, authenticated
  with check (true);
create policy "contact_messages_read_staff" on public.contact_messages for select to authenticated
  using ((select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "contact_messages_delete_owner_developer" on public.contact_messages for delete to authenticated
  using ((select public.current_user_role()) in ('owner', 'developer'));

create policy "agency_settings_read_public" on public.agency_settings for select to anon, authenticated using (true);
create policy "agency_settings_manage_owner_developer" on public.agency_settings for all to authenticated
  using ((select public.current_user_role()) in ('owner', 'developer'))
  with check ((select public.current_user_role()) in ('owner', 'developer'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-photos', 'vehicle-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "vehicle_photo_objects_read_published" on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'vehicle-photos'
    and (
      exists (select 1 from public.vehicle_photos p join public.vehicles v on v.id = p.vehicle_id
        where p.storage_path = name and v.published)
      or (select public.current_user_role()) in ('owner', 'assistant', 'developer')
    )
  );
create policy "vehicle_photo_objects_insert_staff" on storage.objects for insert to authenticated
  with check (bucket_id = 'vehicle-photos' and (select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "vehicle_photo_objects_update_staff" on storage.objects for update to authenticated
  using (bucket_id = 'vehicle-photos' and (select public.current_user_role()) in ('owner', 'assistant', 'developer'))
  with check (bucket_id = 'vehicle-photos' and (select public.current_user_role()) in ('owner', 'assistant', 'developer'));
create policy "vehicle_photo_objects_delete_staff" on storage.objects for delete to authenticated
  using (bucket_id = 'vehicle-photos' and (select public.current_user_role()) in ('owner', 'assistant', 'developer'));