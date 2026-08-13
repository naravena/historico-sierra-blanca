/**
 * Contrato para el acceso a las lecturas (series temporales) de un sensor.
 * Separado de ISensorRepository a propósito: son responsabilidades distintas
 * (metadatos vs. datos de series temporales) - Principio de Segregación
 * de Interfaces (la "I" de SOLID). Nadie que solo necesite el catálogo de
 * sensores debería verse forzado a depender de métodos de lecturas, y viceversa.
 */
class IReadingRepository {
  /** @returns {Promise<Array<{recorded_at: Date, value: number}>>} */
  async findByEntityIdAndRange(_entityId, _desde, _hasta) {
    throw new Error("IReadingRepository.findByEntityIdAndRange no implementado");
  }
}

module.exports = IReadingRepository;
