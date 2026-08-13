const IReadingRepository = require("../domain/IReadingRepository");

class PostgresReadingRepository extends IReadingRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findByEntityIdAndRange(entityId, desde, hasta) {
    const { rows } = await this.pool.query(
      `select recorded_at, value
       from readings
       where entity_id = $1 and recorded_at >= $2 and recorded_at < $3
       order by recorded_at asc`,
      [entityId, desde, hasta]
    );
    return rows.map((r) => ({ recorded_at: new Date(r.recorded_at), value: Number(r.value) }));
  }
}

module.exports = PostgresReadingRepository;
