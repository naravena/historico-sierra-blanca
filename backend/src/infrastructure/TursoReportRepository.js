const IReportRepository = require("../domain/IReportRepository");

function normalizeReport(row) {
  if (!row) return null;
  let entityIds = row.entity_ids;
  if (typeof entityIds === "string") {
    try {
      entityIds = JSON.parse(entityIds);
    } catch {
      entityIds = [];
    }
  }
  return { ...row, entity_ids: Array.isArray(entityIds) ? entityIds : [] };
}

class TursoReportRepository extends IReportRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findAll() {
    const result = await this.db.execute(
      "SELECT * FROM report_definitions ORDER BY created_at DESC"
    );
    return result.rows.map(normalizeReport);
  }

  async findById(id) {
    const result = await this.db.execute({
      sql: "SELECT * FROM report_definitions WHERE id = ? LIMIT 1",
      args: [Number(id)],
    });
    return normalizeReport(result.rows[0]);
  }

  async create({ name, entityIds, desde, hasta }) {
    const result = await this.db.execute({
      sql: `INSERT INTO report_definitions (name, entity_ids, date_from, date_to)
            VALUES (?, ?, ?, ?) RETURNING *`,
      args: [name, JSON.stringify(entityIds), desde, hasta],
    });
    return normalizeReport(result.rows[0]);
  }

  async delete(id) {
    await this.db.execute({
      sql: "DELETE FROM report_definitions WHERE id = ?",
      args: [Number(id)],
    });
  }
}

module.exports = TursoReportRepository;
