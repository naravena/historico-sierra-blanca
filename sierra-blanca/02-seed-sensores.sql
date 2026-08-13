-- Catálogo de sensores de Sierra Blanca, extraído de su dashboard Lovelace.
-- Ejecutar DESPUÉS de 01-schema.sql, en el mismo proyecto de Supabase.
--
-- ⚠️ Unidades marcadas "por confirmar": el dashboard no especifica
-- unit_of_measurement (eso solo se ve en Developer Tools -> States de
-- ESE Home Assistant). Antes de dar por buena la Fase 1 de esta vivienda,
-- confirma ahí si "energia_consumida"/"producida" vienen en kWh o en Wh -
-- si es Wh, cambia MAIN_CONSUMPTION_UNIT=Wh en el .env (ver NUEVA-VIVIENDA.md).

insert into sensors (entity_id, friendly_name, category, unit, priority, value_type, is_cumulative) values
  -- Resumen general de la vivienda
  ('sensor.sierra_blanca_total_power', 'Potencia total vivienda', 'energia', 'W', 'alta', 'reading', false),
  ('sensor.sierra_blanca_tension', 'Tensión de red', 'energia', 'V', 'media', 'reading', false),
  ('sensor.sierra_blanca_frecuencia', 'Frecuencia de red', 'energia', 'Hz', 'media', 'reading', false),

  -- Planta Baja
  ('sensor.sierra_blanca_potencia_a', 'Potencia actual — Planta Baja', 'energia', 'W', 'alta', 'reading', false),
  ('sensor.sierra_blanca_corriente_a', 'Corriente — Planta Baja', 'energia', 'A', 'media', 'reading', false),
  ('sensor.sierra_blanca_power_factor_a', 'Factor de potencia — Planta Baja', 'energia', null, 'baja', 'reading', false),
  ('sensor.sierra_blanca_energia_consumida_a', 'Energía consumida — Planta Baja', 'energia', 'kWh', 'alta', 'reading', true),
  ('sensor.sierra_blanca_energia_producida_a', 'Energía producida — Planta Baja', 'energia', 'kWh', 'alta', 'reading', true),

  -- Planta Alta
  ('sensor.sierra_blanca_potencia_b', 'Potencia actual — Planta Alta', 'energia', 'W', 'alta', 'reading', false),
  ('sensor.sierra_blanca_corriente_b', 'Corriente — Planta Alta', 'energia', 'A', 'media', 'reading', false),
  ('sensor.sierra_blanca_power_factor_b', 'Factor de potencia — Planta Alta', 'energia', null, 'baja', 'reading', false),
  ('sensor.sierra_blanca_energia_consumida_b', 'Energía consumida — Planta Alta', 'energia', 'kWh', 'alta', 'reading', true),
  ('sensor.sierra_blanca_energia_producida_b', 'Energía producida — Planta Alta', 'energia', 'kWh', 'alta', 'reading', true),

  -- Total (este es el sensor que se usará como MAIN_CONSUMPTION_ENTITY_ID)
  ('sensor.sierra_blanca_energia_consumida', 'Energía consumida — Total vivienda', 'energia', 'kWh', 'alta', 'reading', true);

-- No se incluye number.sierra_blanca_reporting_rate: es un parámetro de
-- configuración del equipo medidor, no una lectura histórica (mismo
-- criterio que se aplicó en la Fase 1 de la vivienda principal).
