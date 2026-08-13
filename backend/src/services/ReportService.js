/**
 * Responsabilidad única: orquestar la creación, listado y visualización
 * de informes. Compone StatsService (cálculo) e IReportRepository
 * (persistencia) sin conocer los detalles de ninguno de los dos.
 */
class ReportService {
  /**
   * @param {import('./StatsService')} statsService
   * @param {import('../domain/IReportRepository')} reportRepository
   */
  constructor(statsService, reportRepository) {
    this.statsService = statsService;
    this.reportRepository = reportRepository;
  }

  async crear({ name, entityIds, desde, hasta }) {
    if (!name || !entityIds?.length || !desde || !hasta) {
      const err = new Error("Faltan campos: name, entityIds, desde y hasta son obligatorios");
      err.status = 400;
      throw err;
    }
    const definicion = await this.reportRepository.create({ name, entityIds, desde, hasta });
    return this._hidratar(definicion);
  }

  async listar() {
    const definiciones = await this.reportRepository.findAll();
    return definiciones.map((d) => ({
      id: d.id,
      name: d.name,
      entityIds: d.entity_ids,
      desde: d.date_from,
      hasta: d.date_to,
      creadoEn: d.created_at,
    }));
  }

  async obtener(id) {
    const definicion = await this.reportRepository.findById(id);
    if (!definicion) {
      const err = new Error(`Informe no encontrado: ${id}`);
      err.status = 404;
      throw err;
    }
    return this._hidratar(definicion);
  }

  async eliminar(id) {
    await this.reportRepository.delete(id);
  }

  /** Convierte una definición guardada en un informe con los datos calculados al vuelo. */
  async _hidratar(definicion) {
    const entityIds = definicion.entity_ids || definicion.entityIds;
    const desde = definicion.date_from || definicion.desde;
    const hasta = definicion.date_to || definicion.hasta;

    const estadisticas = await this.statsService.compararVarios(entityIds, desde, hasta);

    return {
      id: definicion.id,
      name: definicion.name,
      desde,
      hasta,
      sensores: estadisticas,
    };
  }
}

module.exports = ReportService;
