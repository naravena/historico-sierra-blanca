/**
 * Contrato para cualquier fuente de datos de sensores.
 * Las capas superiores (servicios) dependen de esta abstracción,
 * nunca de una implementación concreta (Postgres, REST, mock de tests...).
 * Principio de Inversión de Dependencias (la "D" de SOLID).
 */
class ISensorRepository {
  /** @returns {Promise<Array<object>>} */
  async findAll(_categoria) {
    throw new Error("ISensorRepository.findAll no implementado");
  }

  /** @returns {Promise<object|null>} */
  async findByEntityId(_entityId) {
    throw new Error("ISensorRepository.findByEntityId no implementado");
  }
}

module.exports = ISensorRepository;
