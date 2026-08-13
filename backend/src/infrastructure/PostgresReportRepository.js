const IReportRepository = require("../domain/IReportRepository");

class PostgresReportRepository extends IReportRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findAll() {
    const { rows } = await this.pool.query(
      "select * from report_definitions order by created_at desc"
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.pool.query(
      "select * from report_definitions where id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async create({ name, entityIds, desde, hasta }) {
    const { rows } = await this.pool.query(
      `insert into report_definitions (name, entity_ids, date_from, date_to)
       values ($1, $2, $3, $4)
       returning *`,
      [name, entityIds, desde, hasta]
    );
    return rows[0];
  }

  async delete(id) {
    await this.pool.query("delete from report_definitions where id = $1", [id]);
  }
}

module.exports = PostgresReportRepository;
