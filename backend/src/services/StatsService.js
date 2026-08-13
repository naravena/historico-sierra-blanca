const CumulativeStatsStrategy = require("./strategies/CumulativeStatsStrategy");
const InstantaneousStatsStrategy = require("./strategies/InstantaneousStatsStrategy");

/**
 * Responsabilidad única: calcular estadísticas de un sensor en un rango
 * de fechas. No sabe nada de Postgres (recibe los repositorios inyectados)
 * ni de los detalles de cada tipo de cálculo (delega en la estrategia
 * correspondiente). Añadir un nuevo tipo de sensor con otra forma de
 * calcularse solo requiere una nueva estrategia, sin tocar esta clase.
 */
class StatsService {
  /**
   * @param {import('../domain/ISensorRepository')} sensorRepository
   * @param {import('../domain/IReadingRepository')} readingRepository
   */
  constructor(sensorRepository, readingRepository) {
    this.sensorRepository = sensorRepository;
    this.readingRepository = readingRepository;
    this.cumulativeStrategy = new CumulativeStatsStrategy();
    this.instantaneousStrategy = new InstantaneousStatsStrategy();
  }

  async calcular(entityId, desde, hasta) {
    const sensor = await this.sensorRepository.findByEntityId(entityId);
    if (!sensor) {
      const err = new Error(`Sensor no encontrado: ${entityId}`);
      err.status = 404;
      throw err;
    }

    const lecturas = await this.readingRepository.findByEntityIdAndRange(
      entityId,
      desde,
      hasta
    );

    const estrategia = sensor.is_cumulative
      ? this.cumulativeStrategy
      : this.instantaneousStrategy;

    return {
      entityId,
      friendlyName: sensor.friendly_name,
      unit: sensor.unit,
      totalLecturas: lecturas.length,
      ...estrategia.calcular(lecturas),
    };
  }

  async compararVarios(entityIds, desde, hasta) {
    const resultados = await Promise.all(
      entityIds.map((id) => this.calcular(id, desde, hasta))
    );
    return resultados;
  }
}

module.exports = StatsService;
