const ISensorRepository = require("../domain/ISensorRepository");

/**
 * Implementación concreta sobre Postgres/Supabase.
 * Es sustituible por cualquier otra que cumpla ISensorRepository
 * (Principio de Sustitución de Liskov: StatsService o SensorService
 * no necesitan saber ni les importa que esta sea la implementación real).
 */
class PostgresSensorRepository extends ISensorRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findAll(categoria) {
    let query = "select * from sensors where active = true";
    const params = [];
    if (categoria) {
      params.push(categoria);
      query += ` and category = $${params.length}`;
    }
    query += " order by category, priority";
    const { rows } = await this.pool.query(query, params);
    return rows;
  }

  async findByEntityId(entityId) {
    const { rows } = await this.pool.query(
      "select * from sensors where entity_id = $1",
      [entityId]
    );
    return rows[0] || null;
  }
}

module.exports = PostgresSensorRepository;
