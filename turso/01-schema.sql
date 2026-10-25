-- Esquema compatible con Turso/libSQL.
-- No borra ni reemplaza lecturas que ya existan en la tabla readings.

CREATE TABLE IF NOT EXISTS sensors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id TEXT NOT NULL UNIQUE,
  friendly_name TEXT,
  category TEXT NOT NULL,
  unit TEXT,
  device_class TEXT,
  priority TEXT,
  value_type TEXT NOT NULL DEFAULT 'reading',
  is_cumulative INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sensors_active_category_priority
  ON sensors(active, category, priority);

CREATE TABLE IF NOT EXISTS readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  value REAL NOT NULL,
  source_state_id INTEGER
);

CREATE INDEX IF NOT EXISTS idx_readings_entity_recorded_at
  ON readings(entity_id, recorded_at);

CREATE TABLE IF NOT EXISTS report_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  entity_ids TEXT NOT NULL,
  date_from TEXT NOT NULL,
  date_to TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_report_definitions_created_at
  ON report_definitions(created_at DESC);
