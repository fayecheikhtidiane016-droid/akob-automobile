alter table public.profiles
  add column if not exists developer_access boolean not null default false;