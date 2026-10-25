-- Catálogo inicial de Sierra Blanca. Ejecutar solo si necesitas estos sensores.
-- INSERT OR IGNORE evita sobrescribir sensores existentes.

INSERT OR IGNORE INTO sensors
  (entity_id, friendly_name, category, unit, priority, value_type, is_cumulative)
VALUES
  ('sensor.sierra_blanca_total_power', 'Potencia total vivienda', 'energia', 'W', 'alta', 'reading', 0),
  ('sensor.sierra_blanca_tension', 'Tensión de red', 'energia', 'V', 'media', 'reading', 0),
  ('sensor.sierra_blanca_frecuencia', 'Frecuencia de red', 'energia', 'Hz', 'media', 'reading', 0),
  ('sensor.sierra_blanca_potencia_a', 'Potencia actual — Planta Baja', 'energia', 'W', 'alta', 'reading', 0),
  ('sensor.sierra_blanca_corriente_a', 'Corriente — Planta Baja', 'energia', 'A', 'media', 'reading', 0),
  ('sensor.sierra_blanca_power_factor_a', 'Factor de potencia — Planta Baja', 'energia', NULL, 'baja', 'reading', 0),
  ('sensor.sierra_blanca_energia_consumida_a', 'Energía consumida — Planta Baja', 'energia', 'kWh', 'alta', 'reading', 1),
  ('sensor.sierra_blanca_energia_producida_a', 'Energía producida — Planta Baja', 'energia', 'kWh', 'alta', 'reading', 1),
  ('sensor.sierra_blanca_potencia_b', 'Potencia actual — Planta Alta', 'energia', 'W', 'alta', 'reading', 0),
  ('sensor.sierra_blanca_corriente_b', 'Corriente — Planta Alta', 'energia', 'A', 'media', 'reading', 0),
  ('sensor.sierra_blanca_power_factor_b', 'Factor de potencia — Planta Alta', 'energia', NULL, 'baja', 'reading', 0),
  ('sensor.sierra_blanca_energia_consumida_b', 'Energía consumida — Planta Alta', 'energia', 'kWh', 'alta', 'reading', 1),
  ('sensor.sierra_blanca_energia_producida_b', 'Energía producida — Planta Alta', 'energia', 'kWh', 'alta', 'reading', 1),
  ('sensor.sierra_blanca_energia_consumida', 'Energía consumida — Total vivienda', 'energia', 'kWh', 'alta', 'reading', 1);
