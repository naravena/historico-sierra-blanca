/**
 * Contrato para una estrategia de cálculo de estadísticas sobre una serie
 * de lecturas. Permite añadir nuevos tipos de cálculo (p. ej. contadores
 * que se resetean de otra forma, sensores booleanos, etc.) sin modificar
 * StatsService ni las estrategias existentes - Principio Abierto/Cerrado
 * (la "O" de SOLID): abierto a extensión, cerrado a modificación.
 */
class IStatsStrategy {
  /**
   * @param {Array<{recorded_at: Date, value: number}>} lecturas - ordenadas por fecha ascendente
   * @returns {object} estadísticas calculadas
   */
  calcular(_lecturas) {
    throw new Error("IStatsStrategy.calcular no implementado");
  }
}

module.exports = IStatsStrategy;
