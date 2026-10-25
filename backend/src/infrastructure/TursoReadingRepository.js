const IReadingRepository = require("../domain/IReadingRepository");

class TursoReadingRepository extends IReadingRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findByEntityIdAndRange(entityId, desde, hasta) {
    const result = await this.db.execute({
      sql: `SELECT recorded_at, value
            FROM readings
            WHERE entity_id = ? AND recorded_at >= ? AND recorded_at < ?
            ORDER BY recorded_at ASC`,
      args: [entityId, desde, hasta],
    });

    return result.rows.map((row) => ({
      recorded_at: new Date(row.recorded_at),
      value: Number(row.value),
    }));
  }
}

module.exports = TursoReadingRepository;
