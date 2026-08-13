/**
 * Responsabilidad única: convertir estructuras de datos ya calculadas
 * (lecturas, informes) a texto CSV. No sabe nada de HTTP ni de la base
 * de datos - solo transforma datos en un formato de salida.
 */

function _escapar(valor) {
  const texto = String(valor ?? "");
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function lecturasACsv(lecturas) {
  const filas = [["recorded_at", "value"].join(",")];
  for (const l of lecturas) {
    filas.push([l.recorded_at.toISOString(), l.value].map(_escapar).join(","));
  }
  return filas.join("\n");
}

function informeACsv(informe) {
  const filas = [
    ["entity_id", "sensor", "tipo", "unidad", "metrica", "valor"].join(","),
  ];

  for (const s of informe.sensores) {
    const base = [s.entityId, s.friendlyName, s.tipo, s.unit || ""];
    if (s.tipo === "acumulativo") {
      filas.push([...base, "consumo_total", s.consumoTotal].map(_escapar).join(","));
      filas.push([...base, "consumo_medio_diario", s.consumoMedioDiario].map(_escapar).join(","));
      filas.push([...base, "dia_mayor_consumo", s.diaMayorConsumo].map(_escapar).join(","));
      filas.push([...base, "dia_menor_consumo", s.diaMenorConsumo].map(_escapar).join(","));
    } else {
      filas.push([...base, "promedio", s.promedio].map(_escapar).join(","));
      filas.push([...base, "maximo", s.maximo].map(_escapar).join(","));
      filas.push([...base, "minimo", s.minimo].map(_escapar).join(","));
      filas.push([...base, "dia_mayor_promedio", s.diaMayorPromedio].map(_escapar).join(","));
    }
  }
  return filas.join("\n");
}

module.exports = { lecturasACsv, informeACsv };
