const ISensorRepository = require("../domain/ISensorRepository");

class TursoSensorRepository extends ISensorRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findAll(categoria) {
    let sql = "SELECT * FROM sensors WHERE active = 1";
    const args = [];
    if (categoria) {
      sql += " AND category = ?";
      args.push(categoria);
    }
    sql += ` ORDER BY category,
      CASE priority WHEN 'alta' THEN 1 WHEN 'media' THEN 2 WHEN 'baja' THEN 3 ELSE 4 END,
      entity_id`;
    const result = await this.db.execute({ sql, args });
    return result.rows.map((row) => ({
      ...row,
      active: Boolean(row.active),
      is_cumulative: Boolean(row.is_cumulative),
    }));
  }

  async findByEntityId(entityId) {
    const result = await this.db.execute({
      sql: "SELECT * FROM sensors WHERE entity_id = ? LIMIT 1",
      args: [entityId],
    });
    const row = result.rows[0];
    return row ? {
      ...row,
      active: Boolean(row.active),
      is_cumulative: Boolean(row.is_cumulative),
    } : null;
  }
}

module.exports = TursoSensorRepository;
