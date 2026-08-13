-- Esquema completo para una nueva vivienda que reutiliza el proyecto.
-- Incluye ya todo lo que en la vivienda principal se fue añadiendo por
-- fases sueltas (Fase 2 + migración is_cumulative de la Fase 5 +
-- report_definitions del portal) - aquí va todo de una vez.
--
-- Ejecutar en el SQL Editor del proyecto de Supabase NUEVO de Sierra Blanca
-- (no el de la vivienda principal).

create table sensors (
  id bigserial primary key,
  entity_id text unique not null,
  friendly_name text,
  category text not null check (category in ('energia', 'clima', 'infraestructura')),
  unit text,
  device_class text,
  priority text check (priority in ('alta', 'media', 'baja')),
  value_type text not null check (value_type in ('reading', 'event')),
  is_cumulative boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table readings (
  id bigserial primary key,
  entity_id text not null references sensors(entity_id),
  recorded_at timestamptz not null,
  value numeric not null,
  unique (entity_id, recorded_at)
);
create index idx_readings_entity_time on readings (entity_id, recorded_at desc);
create index idx_readings_time on readings (recorded_at desc);

create table events (
  id bigserial primary key,
  entity_id text not null references sensors(entity_id),
  occurred_at timestamptz not null,
  state text not null,
  previous_state text
);
create index idx_events_entity_time on events (entity_id, occurred_at desc);

create table report_definitions (
  id bigserial primary key,
  name text not null,
  entity_ids text[] not null,
  date_from date not null,
  date_to date not null,
  created_at timestamptz not null default now()
);

-- Seguridad: todo cerrado salvo para el backend (conexión directa / service_role)
alter table sensors enable row level security;
alter table readings enable row level security;
alter table events enable row level security;
alter table report_definitions enable row level security;
-- Sin policies para anon/authenticated a propósito - ver Fase 2 del proyecto original.
