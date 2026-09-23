-- =====================================================================
-- CHMD · Committee Scoring Tool — Supabase setup
-- Paste this whole file into Supabase > SQL Editor > New query > Run.
-- It is safe to run more than once.
--
-- Security model
--   * Evaluators (anonymous, no login) can only INSERT their evaluation.
--   * Nobody can read the table directly with the public key.
--   * Results are only returned by get_results(password), which checks the
--     admin password on the server. The password never ships in the web page.
--
-- To change the admin password: edit the ONE line below marked
-- "ADMIN PASSWORD", then run this file again.
-- =====================================================================

create table if not exists public.evaluations (
  id              uuid primary key default gen_random_uuid(),
  evaluator_name  text not null check (char_length(trim(evaluator_name)) between 2 and 80),
  evaluator_key   text generated always as (lower(trim(evaluator_name))) stored,
  scores          jsonb not null,
  comparisons     jsonb not null,
  final_choice    text not null check (final_choice in ('Daniela', 'Lila')),
  final_reasoning jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  constraint evaluations_one_per_name unique (evaluator_key)
);

-- Row Level Security: anonymous users may insert, never read/update/delete.
alter table public.evaluations enable row level security;

revoke all on public.evaluations from anon, authenticated;
grant insert (evaluator_name, scores, comparisons, final_choice, final_reasoning)
  on public.evaluations to anon;

drop policy if exists "anon can submit" on public.evaluations;
create policy "anon can submit" on public.evaluations
  for insert to anon with check (true);

-- Admin password lives here (server side only).
create or replace function public.chmd_admin_ok(p_password text)
returns boolean
language sql
immutable
as $$
  select p_password = 'MaguenDavid-2026';   -- <<< ADMIN PASSWORD
$$;
revoke all on function public.chmd_admin_ok(text) from public, anon, authenticated;

-- Returns every evaluation, only if the password is correct.
create or replace function public.get_results(p_password text)
returns setof public.evaluations
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.chmd_admin_ok(p_password), false) then
    raise exception 'invalid admin password' using errcode = '28P01';
  end if;
  return query select * from public.evaluations order by created_at;
end;
$$;
revoke all on function public.get_results(text) from public;
grant execute on function public.get_results(text) to anon;

-- Lets the admin delete one evaluation (e.g. test entries).
create or replace function public.delete_evaluation(p_password text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.chmd_admin_ok(p_password), false) then
    raise exception 'invalid admin password' using errcode = '28P01';
  end if;
  delete from public.evaluations where id = p_id;
end;
$$;
revoke all on function public.delete_evaluation(text, uuid) from public;
grant execute on function public.delete_evaluation(text, uuid) to anon;
