create table if not exists public.biblioteca_conceptos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concepto_id text not null,
  nombre text not null,
  definicion text not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint biblioteca_conceptos_user_concepto_key unique (user_id, concepto_id),
  constraint biblioteca_conceptos_id_no_vacio check (length(trim(concepto_id)) > 0),
  constraint biblioteca_conceptos_nombre_no_vacio check (length(trim(nombre)) > 0)
);
create index if not exists biblioteca_conceptos_user_actualizado_idx
  on public.biblioteca_conceptos (user_id, actualizado_en desc);
alter table public.biblioteca_conceptos enable row level security;
drop policy if exists "cada quien ve su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien ve su biblioteca" on public.biblioteca_conceptos
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "cada quien guarda en su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien guarda en su biblioteca" on public.biblioteca_conceptos
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "cada quien actualiza su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien actualiza su biblioteca" on public.biblioteca_conceptos
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "cada quien quita de su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien quita de su biblioteca" on public.biblioteca_conceptos
  for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.biblioteca_conceptos to authenticated;
