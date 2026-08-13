const IStatsStrategy = require("./IStatsStrategy");

/**
 * Sensores instantáneos (temperatura, humedad, potencia, carga del SAI...):
 * estadísticas directas de promedio/máximo/mínimo, sin lógica de deltas.
 */
class InstantaneousStatsStrategy extends IStatsStrategy {
  calcular(lecturas) {
    if (lecturas.length === 0) {
      return {
        tipo: "instantaneo",
        promedio: null,
        maximo: null,
        minimo: null,
        diaMayorPromedio: null,
        diaMenorPromedio: null,
      };
    }

    const valores = lecturas.map((l) => l.value);
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const maximo = Math.max(...valores);
    const minimo = Math.min(...valores);

    const promedioPorDia = new Map(); // dia -> {suma, n}
    for (const l of lecturas) {
      const dia = l.recorded_at.toISOString().slice(0, 10);
      const acc = promedioPorDia.get(dia) || { suma: 0, n: 0 };
      acc.suma += l.value;
      acc.n += 1;
      promedioPorDia.set(dia, acc);
    }
    const dias = [...promedioPorDia.entries()].map(([dia, { suma, n }]) => [dia, suma / n]);
    const [diaMayor] = dias.reduce((max, actual) => (actual[1] > max[1] ? actual : max));
    const [diaMenor] = dias.reduce((min, actual) => (actual[1] < min[1] ? actual : min));

    return {
      tipo: "instantaneo",
      promedio: Number(promedio.toFixed(2)),
      maximo: Number(maximo.toFixed(2)),
      minimo: Number(minimo.toFixed(2)),
      diaMayorPromedio: diaMayor,
      diaMenorPromedio: diaMenor,
      seriePorDia: dias.map(([dia, valor]) => ({ dia, valor: Number(valor.toFixed(2)) })),
    };
  }
}

module.exports = InstantaneousStatsStrategy;
