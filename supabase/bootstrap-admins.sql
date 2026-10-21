-- Run this in Supabase SQL Editor after inviting the owner in Authentication > Users.
-- Assign permissions before opening the invitation link.
do $$
declare
  owner_user_id uuid;
begin
  select id into owner_user_id
  from auth.users
  where lower(email) = lower('fayecheikhtidiane016@gmail.com')
  limit 1;

  if owner_user_id is null then
    raise exception 'Invite fayecheikhtidiane016@gmail.com in Supabase Authentication > Users first.';
  end if;

  insert into public.profiles (id, role, developer_access, full_name)
  values (owner_user_id, 'owner', false, 'Faye Cheikh Tidiane')
  on conflict (id) do update
    set role = excluded.role,
        developer_access = excluded.developer_access,
        full_name = excluded.full_name;
end;
$$;