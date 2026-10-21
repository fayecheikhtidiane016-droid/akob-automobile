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
      and pg_get_constraintdef(oid) ilike '%sale_price%'
  loop
    execute format('alter table public.vehicles drop constraint %I', constraint_name);
  end loop;
end;
$$;
