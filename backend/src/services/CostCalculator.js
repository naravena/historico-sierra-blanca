/**
 * Responsabilidad única: aplicar la fórmula de la tarifa eléctrica sobre
 * un consumo (kWh) y un número de días, y devolver el desglose completo
 * en el mismo formato que usa la factura real (término fijo, energía,
 * otros conceptos, impuestos, total) - así se pueden comparar directamente.
 *
 * No sabe de dónde viene el consumo (StatsService/Supabase) ni de HTTP -
 * solo hace la cuenta. Verificada contra la factura real de Repsol:
 * reproduce el total (39,34 €) exacto al céntimo con sus mismos datos.
 */
class CostCalculator {
  /** @param {object} tarifa - ver config/tarifa.js */
  constructor(tarifa) {
    this.tarifa = tarifa;
  }

  calcular(kWhTotal, dias) {
    const t = this.tarifa;

    const terminoFijo = t.numPeriodosPotencia * t.potenciaContratadaKw * t.precioPotenciaDiaKwDia * dias;
    const energia = kWhTotal * t.precioEnergiaKwh;
    const bonoSocial = t.financiacionBonoSocialDiario * dias;
    const alquilerContador = t.alquilerContadorDiario * dias;
    const otrosConceptos = bonoSocial + alquilerContador;

    const baseImpuestoElectrico = terminoFijo + energia + bonoSocial; // el alquiler no cuenta para este impuesto
    const impuestoElectrico = baseImpuestoElectrico * t.tasaImpuestoElectrico;

    const baseIva = terminoFijo + energia + otrosConceptos + impuestoElectrico;
    const iva = baseIva * t.tasaIva;

    const total = baseIva + iva;

    const redondear = (n) => Math.round(n * 100) / 100;

    return {
      kWhTotal: redondear(kWhTotal),
      dias,
      terminoFijo: redondear(terminoFijo),
      energia: redondear(energia),
      otrosConceptos: redondear(otrosConceptos),
      impuestoElectrico: redondear(impuestoElectrico),
      iva: redondear(iva),
      total: redondear(total),
      precioMedioKwh: kWhTotal > 0 ? redondear(total / kWhTotal) : null,
    };
  }
}

module.exports = CostCalculator;
