-- =====================================================================
-- CHMD · Instrumento de Valoración Final — configuración de Supabase
-- Pega este archivo completo en Supabase > SQL Editor > New query > Run.
-- Se puede ejecutar más de una vez sin problema.
--
-- Modelo de seguridad
--   * Los evaluadores (anónimos, sin login) solo pueden ENVIAR su valoración.
--   * Nadie puede leer la tabla directamente con la llave pública.
--   * Los resultados solo se entregan con get_results(contraseña), que valida
--     la contraseña en el servidor. La contraseña nunca viaja en la página web.
--
-- Contraseña de administración: antes de ejecutar, reemplaza el texto
-- CAMBIA-ESTA-CONTRASEÑA en la línea marcada "CONTRASEÑA DE ADMINISTRACIÓN".
-- Hazlo en el SQL Editor de Supabase, NO en GitHub (el repositorio es público).
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

-- Seguridad por fila: los anónimos pueden insertar; nunca leer, modificar ni borrar.
alter table public.evaluations enable row level security;

revoke all on public.evaluations from anon, authenticated;
grant insert (evaluator_name, scores, comparisons, final_choice, final_reasoning)
  on public.evaluations to anon;

drop policy if exists "anon can submit" on public.evaluations;
drop policy if exists "envio anonimo" on public.evaluations;
create policy "envio anonimo" on public.evaluations
  for insert to anon with check (true);

-- La contraseña de administración vive aquí (solo en el servidor).
create or replace function public.chmd_admin_ok(p_password text)
returns boolean
language sql
immutable
as $$
  -- Escribe tu contraseña entre las comillas ANTES de ejecutar en Supabase.
  -- No la guardes en GitHub: este repositorio es público.
  -- Mientras diga CAMBIA-ESTA-CONTRASEÑA, nadie puede entrar a los resultados.
  select p_password = x.pw and x.pw <> ('CAMBIA-' || 'ESTA-CONTRASEÑA')
  from (select
    'CAMBIA-ESTA-CONTRASEÑA'   -- <<< CONTRASEÑA DE ADMINISTRACIÓN (solo esta línea)
  ::text as pw) x;
$$;
revoke all on function public.chmd_admin_ok(text) from public, anon, authenticated;

-- Devuelve todas las valoraciones, solo si la contraseña es correcta.
create or replace function public.get_results(p_password text)
returns setof public.evaluations
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.chmd_admin_ok(p_password), false) then
    raise exception 'contraseña inválida' using errcode = '28P01';
  end if;
  return query select * from public.evaluations order by created_at;
end;
$$;
revoke all on function public.get_results(text) from public;
grant execute on function public.get_results(text) to anon;

-- Permite a la administración borrar una valoración (p. ej. pruebas).
create or replace function public.delete_evaluation(p_password text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.chmd_admin_ok(p_password), false) then
    raise exception 'contraseña inválida' using errcode = '28P01';
  end if;
  delete from public.evaluations where id = p_id;
end;
$$;
revoke all on function public.delete_evaluation(text, uuid) from public;
grant execute on function public.delete_evaluation(text, uuid) to anon;
