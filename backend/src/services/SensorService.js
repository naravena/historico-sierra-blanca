/**
 * Responsabilidad única: exponer el catálogo de sensores.
 * Depende de ISensorRepository (abstracción), no de Postgres -
 * se le puede inyectar cualquier implementación (Principio de
 * Inversión de Dependencias).
 */
class SensorService {
  /** @param {import('../domain/ISensorRepository')} sensorRepository */
  constructor(sensorRepository) {
    this.sensorRepository = sensorRepository;
  }

  async listar(categoria) {
    return this.sensorRepository.findAll(categoria);
  }

  async obtener(entityId) {
    const sensor = await this.sensorRepository.findByEntityId(entityId);
    if (!sensor) {
      const err = new Error(`Sensor no encontrado: ${entityId}`);
      err.status = 404;
      throw err;
    }
    return sensor;
  }
}

module.exports = SensorService;
