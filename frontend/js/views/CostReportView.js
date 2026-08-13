/** Responsabilidad única: pintar el resultado del informe de coste. */
export class CostReportView {
  constructor(container) {
    this.container = container;
  }

  render(resultado) {
    const { estimado, consumoRegistrado, comparacion, dias } = resultado;

    const filaComparacion = comparacion
      ? `
        <div class="odometer-row">
          <div class="odometer"><div class="val">${comparacion.importeReal.toFixed(2)} €</div><div class="lbl">Factura real</div></div>
          <div class="odometer"><div class="val">${comparacion.diferencia >= 0 ? "+" : ""}${comparacion.diferencia.toFixed(2)} €</div><div class="lbl">Diferencia</div></div>
          <div class="odometer"><div class="val">${comparacion.diferenciaPorcentaje ?? "—"}%</div><div class="lbl">Desviación</div></div>
        </div>`
      : `<p class="muted">Introduce el importe real de tu factura arriba para ver la comparación.</p>`;

    this.container.innerHTML = `
      <div class="report-result">
        <div class="report-title">Estimación de coste</div>
        <div class="report-range">${resultado.desde} → ${resultado.hasta} (${dias} días) · ${estimado.kWhTotal} kWh registrados</div>

        <div class="sensor-report-card">
          <div class="card-head"><h3>Desglose estimado (según tu tarifa 2.0TD)</h3></div>
          <div class="odometer-row">
            <div class="odometer"><div class="val">${estimado.terminoFijo.toFixed(2)} €</div><div class="lbl">Término fijo</div></div>
            <div class="odometer"><div class="val">${estimado.energia.toFixed(2)} €</div><div class="lbl">Energía</div></div>
            <div class="odometer"><div class="val">${estimado.otrosConceptos.toFixed(2)} €</div><div class="lbl">Otros conceptos</div></div>
            <div class="odometer"><div class="val">${(estimado.impuestoElectrico + estimado.iva).toFixed(2)} €</div><div class="lbl">Impuestos</div></div>
          </div>
          <div class="odometer-row">
            <div class="odometer"><div class="val">${estimado.total.toFixed(2)} €</div><div class="lbl">Total estimado</div></div>
            <div class="odometer"><div class="val">${estimado.precioMedioKwh ?? "—"} €</div><div class="lbl">Precio medio / kWh</div></div>
            <div class="odometer"><div class="val">${consumoRegistrado.totalLecturas}</div><div class="lbl">Lecturas usadas</div></div>
          </div>
        </div>

        <div class="sensor-report-card">
          <div class="card-head"><h3>Comparación con tu factura</h3></div>
          ${filaComparacion}
        </div>
      </div>`;
  }
}
