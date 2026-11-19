revoke all on table public.biblioteca_conceptos from anon, public;
grant select, insert, update, delete on table public.biblioteca_conceptos to authenticated;
drop policy if exists "cada quien ve su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien ve su biblioteca" on public.biblioteca_conceptos
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "cada quien guarda en su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien guarda en su biblioteca" on public.biblioteca_conceptos
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "cada quien actualiza su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien actualiza su biblioteca" on public.biblioteca_conceptos
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "cada quien quita de su biblioteca" on public.biblioteca_conceptos;
create policy "cada quien quita de su biblioteca" on public.biblioteca_conceptos
  for delete to authenticated using ((select auth.uid()) = user_id);