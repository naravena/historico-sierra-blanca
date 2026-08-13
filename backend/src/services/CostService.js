/**
 * Responsabilidad única: orquestar la estimación de coste eléctrico real.
 * Compone StatsService (consumo medido en Supabase) con CostCalculator
 * (fórmula de la tarifa) - no calcula nada directamente él mismo.
 *
 * Qué sensor es "el consumo general" y en qué unidad viene son datos de
 * configuración (ver config/vivienda.js), no están escritos aquí - así
 * este mismo servicio sirve para cualquier vivienda que reutilice el
 * proyecto, cambiando solo variables de entorno.
 */
class CostService {
  /**
   * @param {import('./StatsService')} statsService
   * @param {import('./CostCalculator')} costCalculator
   * @param {{entityIdConsumoGeneral: string, unidadConsumoGeneral: string}} viviendaConfig
   */
  constructor(statsService, costCalculator, viviendaConfig) {
    this.statsService = statsService;
    this.costCalculator = costCalculator;
    this.entityIdConsumoGeneral = viviendaConfig.entityIdConsumoGeneral;
    this.factorAKwh = viviendaConfig.unidadConsumoGeneral === "Wh" ? 1 / 1000 : 1;
  }

  /**
   * @param {string} desde - YYYY-MM-DD
   * @param {string} hasta - YYYY-MM-DD
   * @param {number|null} importeRealFactura - opcional, para comparar contra una factura real
   */
  async estimar(desde, hasta, importeRealFactura = null) {
    const consumo = await this.statsService.calcular(this.entityIdConsumoGeneral, desde, hasta);

    const dias = Math.max(1, Math.round((new Date(hasta) - new Date(desde)) / 86400000));
    const kWhTotal = (consumo.consumoTotal || 0) * this.factorAKwh;

    const estimado = this.costCalculator.calcular(kWhTotal, dias);

    const resultado = { desde, hasta, dias, consumoRegistrado: consumo, estimado };

    if (importeRealFactura != null && !Number.isNaN(importeRealFactura)) {
      const diferencia = Math.round((estimado.total - importeRealFactura) * 100) / 100;
      resultado.comparacion = {
        importeReal: importeRealFactura,
        diferencia,
        diferenciaPorcentaje:
          importeRealFactura > 0 ? Math.round((diferencia / importeRealFactura) * 10000) / 100 : null,
      };
    }

    return resultado;
  }
}

module.exports = CostService;
