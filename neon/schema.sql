begin;
create table if not exists public.app_members(user_id text primary key,role text not null default 'Vendedor' check(role in('Administrador','Vendedor')));
create table if not exists public.app_state(id integer primary key check(id=1),version bigint not null default 0,state jsonb not null default '{"clients":[],"trips":[],"sales":[],"settings":{"company":"Rota Viva Excursões","owner":"Magno Jorge de Castro Nascimento","ownerCpf":"804.914.801-72","phone":"","email":"","address":"","reservationPrefix":"RV","lastReservation":0,"commissionRate":0}}'::jsonb);
insert into public.app_state(id) values(1) on conflict do nothing;
alter table public.app_members enable row level security;alter table public.app_state enable row level security;
revoke all on public.app_members,public.app_state from public;
do $$ declare r text;begin for r in select rolname from pg_roles where rolname in('anonymous','anon','authenticated') loop execute format('revoke all on public.app_members,public.app_state from %I',r);end loop;end $$;
commit;
