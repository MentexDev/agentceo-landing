-- Lista de espera de agentceo.io  (pégalo en Supabase → SQL Editor → Run)
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  business text,
  source text,
  referrer text,
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
-- Sin políticas: desde la web nadie puede leer ni tocar la tabla directamente.
-- La página sólo puede llamar a esta función, que guarda (o completa) un registro.
create or replace function public.join_waitlist(p_email text, p_business text default null, p_source text default null, p_referrer text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_email is null or length(p_email) > 254 or p_email !~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' then
    raise exception 'correo no válido';
  end if;
  insert into public.waitlist (email, business, source, referrer)
  values (lower(trim(p_email)), left(p_business, 60), left(p_source, 40), left(p_referrer, 300))
  on conflict (email) do update set business = coalesce(excluded.business, waitlist.business);
end $$;
revoke all on function public.join_waitlist(text, text, text, text) from public;
grant execute on function public.join_waitlist(text, text, text, text) to anon, authenticated;
