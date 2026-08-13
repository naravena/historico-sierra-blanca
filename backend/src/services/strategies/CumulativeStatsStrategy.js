const IStatsStrategy = require("./IStatsStrategy");

/**
 * Sensores acumulativos (contadores de energía): el consumo se calcula
 * sumando solo los incrementos positivos entre lecturas consecutivas.
 * Esto ignora los resets locales detectados en la Fase 4 (los enchufes
 * Tuya pierden su acumulado al reiniciarse) sin necesidad de "arreglar"
 * el dato en origen.
 */
class CumulativeStatsStrategy extends IStatsStrategy {
  calcular(lecturas) {
    if (lecturas.length < 2) {
      return {
        tipo: "acumulativo",
        consumoTotal: 0,
        consumoMedioDiario: 0,
        diaMayorConsumo: null,
        diaMenorConsumo: null,
      };
    }

    const consumoPorDia = new Map(); // "YYYY-MM-DD" -> consumo

    for (let i = 1; i < lecturas.length; i++) {
      const anterior = lecturas[i - 1];
      const actual = lecturas[i];
      const delta = Math.max(actual.value - anterior.value, 0); // ignora resets (delta negativo)
      const dia = actual.recorded_at.toISOString().slice(0, 10);
      consumoPorDia.set(dia, (consumoPorDia.get(dia) || 0) + delta);
    }

    const dias = [...consumoPorDia.entries()];
    const consumoTotal = dias.reduce((suma, [, valor]) => suma + valor, 0);
    const consumoMedioDiario = consumoTotal / dias.length;

    const [diaMayor] = dias.reduce((max, actual) => (actual[1] > max[1] ? actual : max));
    const [diaMenor] = dias.reduce((min, actual) => (actual[1] < min[1] ? actual : min));

    return {
      tipo: "acumulativo",
      consumoTotal: Number(consumoTotal.toFixed(3)),
      consumoMedioDiario: Number(consumoMedioDiario.toFixed(3)),
      diaMayorConsumo: diaMayor,
      diaMenorConsumo: diaMenor,
      seriePorDia: dias.map(([dia, valor]) => ({ dia, valor: Number(valor.toFixed(3)) })),
    };
  }
}

module.exports = CumulativeStatsStrategy;
