-- Fase 5 (portal web) - tabla para guardar informes creados desde la interfaz
create table if not exists report_definitions (
  id bigserial primary key,
  name text not null,
  entity_ids text[] not null,
  date_from date not null,
  date_to date not null,
  created_at timestamptz not null default now()
);

alter table report_definitions enable row level security;
-- Sin policies para anon/authenticated: solo el backend (service_role / conexión directa) puede acceder.
