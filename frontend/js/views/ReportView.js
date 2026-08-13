/**
 * Responsabilidad única: pintar el resultado de un informe (tarjetas tipo
 * "contador" + gráfica de evolución) en un contenedor dado. No sabe cómo
 * se obtuvieron los datos, ni de la API - solo recibe el objeto ya calculado.
 */
export class ReportView {
  constructor(container, apiBaseUrl) {
    this.container = container;
    this.apiBaseUrl = apiBaseUrl;
    this.charts = [];
  }

  render(informe) {
    this._destruirGraficas();

    const descargaInforme = informe.id
      ? `<a class="btn-secondary" href="${this.apiBaseUrl}/reports/${informe.id}/export.csv" target="_blank">Descargar informe (CSV)</a>`
      : "";

    const cabecera = `
      <div class="report-title-row">
        <div>
          <div class="report-title">${informe.name || "Informe"}</div>
          <div class="report-range">${informe.desde} → ${informe.hasta}</div>
        </div>
        ${descargaInforme}
      </div>
    `;

    const tarjetas = informe.sensores
      .map((s, idx) => this._tarjetaSensor(s, idx, informe.desde, informe.hasta))
      .join("");

    this.container.innerHTML = `<div class="report-result">${cabecera}${tarjetas}</div>`;

    informe.sensores.forEach((s, idx) => this._dibujarGrafica(s, idx));
  }

  _enlaceCsvSensor(entityId, desde, hasta) {
    return `${this.apiBaseUrl}/sensors/${entityId}/export.csv?desde=${desde}&hasta=${hasta}`;
  }

  _tarjetaSensor(s, idx, desde, hasta) {
    const categoria = this._categoriaDeUnidad(s);
    const enlaceCsv = `<a class="btn-secondary csv-link" href="${this._enlaceCsvSensor(s.entityId, desde, hasta)}" target="_blank">CSV</a>`;
    if (s.tipo === "acumulativo") {
      return `
        <div class="sensor-report-card">
          <div class="card-head">
            <h3>${s.friendlyName}</h3>
            <span class="badge ${categoria}">${s.entityId}</span>
          </div>
          <div class="odometer-row">
            <div class="odometer"><div class="val">${s.consumoTotal ?? "—"}</div><div class="lbl">Total ${s.unit || ""}</div></div>
            <div class="odometer"><div class="val">${s.consumoMedioDiario ?? "—"}</div><div class="lbl">Media diaria</div></div>
            <div class="odometer"><div class="val">${s.diaMayorConsumo || "—"}</div><div class="lbl">Día mayor consumo</div></div>
            <div class="odometer"><div class="val">${s.diaMenorConsumo || "—"}</div><div class="lbl">Día menor consumo</div></div>
          </div>
          <div class="chart-wrap"><canvas id="chart-${idx}"></canvas></div>
          <div class="card-footer">${enlaceCsv}</div>
        </div>`;
    }
    return `
      <div class="sensor-report-card">
        <div class="card-head">
          <h3>${s.friendlyName}</h3>
          <span class="badge ${categoria}">${s.entityId}</span>
        </div>
        <div class="odometer-row">
          <div class="odometer"><div class="val">${s.promedio ?? "—"}</div><div class="lbl">Promedio ${s.unit || ""}</div></div>
          <div class="odometer"><div class="val">${s.maximo ?? "—"}</div><div class="lbl">Máximo</div></div>
          <div class="odometer"><div class="val">${s.minimo ?? "—"}</div><div class="lbl">Mínimo</div></div>
          <div class="odometer"><div class="val">${s.diaMayorPromedio || "—"}</div><div class="lbl">Día más alto</div></div>
        </div>
        <div class="chart-wrap"><canvas id="chart-${idx}"></canvas></div>
        <div class="card-footer">${enlaceCsv}</div>
      </div>`;
  }

  _categoriaDeUnidad(s) {
    if (s.tipo === "acumulativo") return "energia";
    if (s.unit === "°C" || s.unit === "%") return "clima";
    return "infraestructura";
  }

  _dibujarGrafica(s, idx) {
    const canvas = document.getElementById(`chart-${idx}`);
    if (!canvas || !s.seriePorDia?.length) return;

    const color = { energia: "#e0a458", clima: "#5b9aa8", infraestructura: "#9084d6" }[
      this._categoriaDeUnidad(s)
    ];

    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: s.seriePorDia.map((p) => p.dia),
        datasets: [
          {
            label: s.friendlyName,
            data: s.seriePorDia.map((p) => p.valor),
            borderColor: color,
            backgroundColor: color + "33",
            fill: true,
            tension: 0.25,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "#2e3440" }, ticks: { color: "#8b8f98", font: { family: "IBM Plex Mono", size: 10 } } },
          y: { grid: { color: "#2e3440" }, ticks: { color: "#8b8f98", font: { family: "IBM Plex Mono", size: 10 } } },
        },
      },
    });
    this.charts.push(chart);
  }

  _destruirGraficas() {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }
}
