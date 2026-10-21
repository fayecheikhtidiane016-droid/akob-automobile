create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.profiles p on p.id = u.id
    where u.id = (select auth.uid())
      and lower(u.email) = lower('fayecheikhtidiane016@gmail.com')
      and p.role = 'owner'
  )
$$;

grant execute on function public.current_user_is_admin() to anon, authenticated;

update public.profiles p
set developer_access = false
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('fayecheikhtidiane016@gmail.com');

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.vehicles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%listing_type%'
  loop
    execute format('alter table public.vehicles drop constraint %I', constraint_name);
  end loop;
end;
$$;

update public.vehicles
set listing_type = 'sale',
    daily_rate = null,
    status = case when status in ('reserved', 'rented') then 'available'::public.vehicle_status else status end;

alter table public.vehicles
  add constraint vehicles_sales_only check (listing_type = 'sale');

drop policy if exists "profiles_read_self_or_manager" on public.profiles;
drop policy if exists "profiles_manage_owner_developer" on public.profiles;
create policy "profiles_read_self_or_admin" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.current_user_is_admin()));
create policy "profiles_manage_admin" on public.profiles for all to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "vehicles_read_published" on public.vehicles;
drop policy if exists "vehicles_insert_staff" on public.vehicles;
drop policy if exists "vehicles_update_staff" on public.vehicles;
drop policy if exists "vehicles_delete_owner_developer" on public.vehicles;
create policy "vehicles_read_published" on public.vehicles for select to anon, authenticated
  using (published or (select public.current_user_is_admin()));
create policy "vehicles_insert_admin" on public.vehicles for insert to authenticated
  with check ((select public.current_user_is_admin()));
create policy "vehicles_update_admin" on public.vehicles for update to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));
create policy "vehicles_delete_admin" on public.vehicles for delete to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "vehicle_photos_read_published" on public.vehicle_photos;
drop policy if exists "vehicle_photos_manage_staff" on public.vehicle_photos;
create policy "vehicle_photos_read_published" on public.vehicle_photos for select to anon, authenticated
  using (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.published)
    or (select public.current_user_is_admin()));
create policy "vehicle_photos_manage_admin" on public.vehicle_photos for all to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "reservations_insert_public_request" on public.reservations;
drop policy if exists "reservations_read_staff" on public.reservations;
drop policy if exists "reservations_update_staff" on public.reservations;
drop policy if exists "reservations_delete_owner_developer" on public.reservations;
create policy "reservations_admin_only" on public.reservations for all to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "contact_messages_read_staff" on public.contact_messages;
drop policy if exists "contact_messages_delete_owner_developer" on public.contact_messages;
create policy "contact_messages_read_admin" on public.contact_messages for select to authenticated
  using ((select public.current_user_is_admin()));
create policy "contact_messages_delete_admin" on public.contact_messages for delete to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "agency_settings_manage_owner_developer" on public.agency_settings;
create policy "agency_settings_manage_admin" on public.agency_settings for all to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "vehicle_photo_objects_read_published" on storage.objects;
drop policy if exists "vehicle_photo_objects_insert_staff" on storage.objects;
drop policy if exists "vehicle_photo_objects_update_staff" on storage.objects;
drop policy if exists "vehicle_photo_objects_delete_staff" on storage.objects;
create policy "vehicle_photo_objects_read_published" on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'vehicle-photos'
    and (
      exists (select 1 from public.vehicle_photos p join public.vehicles v on v.id = p.vehicle_id
        where p.storage_path = name and v.published)
      or (select public.current_user_is_admin())
    )
  );
create policy "vehicle_photo_objects_insert_admin" on storage.objects for insert to authenticated
  with check (bucket_id = 'vehicle-photos' and (select public.current_user_is_admin()));
create policy "vehicle_photo_objects_update_admin" on storage.objects for update to authenticated
  using (bucket_id = 'vehicle-photos' and (select public.current_user_is_admin()))
  with check (bucket_id = 'vehicle-photos' and (select public.current_user_is_admin()));
create policy "vehicle_photo_objects_delete_admin" on storage.objects for delete to authenticated
  using (bucket_id = 'vehicle-photos' and (select public.current_user_is_admin()));
