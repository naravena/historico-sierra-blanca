import { ApiClient } from "./api/ApiClient.js";
import { SensorService } from "./services/SensorService.js";
import { ReportService } from "./services/ReportService.js";
import { CostService } from "./services/CostService.js";
import { SensorSelectorView } from "./views/SensorSelectorView.js";
import { ReportView } from "./views/ReportView.js";
import { ReportListView } from "./views/ReportListView.js";
import { CostReportView } from "./views/CostReportView.js";

// --- Composition root del frontend ---
// Si sirves el frontend desde el propio backend (recomendado, ver README),
// usa "/api". Si lo sirves aparte (p. ej. con el servidor interno de tu
// editor, en otro puerto), pon aquí la URL completa del backend:
// En producción (Vercel) y cuando sirves el frontend desde backend/public,
// frontend y API están en el mismo origen, así que "/api" (relativo) es lo
// correcto. Si en local sirves el frontend por separado en otro puerto,
// cámbialo por la URL completa del backend, ej: "http://localhost:3000/api".
const API_BASE_URL = "/api";
const api = new ApiClient(API_BASE_URL);
const sensorService = new SensorService(api);
const reportService = new ReportService(api);
const costService = new CostService(api);

const sensorSelector = new SensorSelectorView(
  document.getElementById("sensor-selector"),
  document.getElementById("category-tabs")
);
const reportView = new ReportView(document.getElementById("resultado-informe"), API_BASE_URL);
const reportListView = new ReportListView(document.getElementById("lista-informes"));
const costReportView = new CostReportView(document.getElementById("resultado-coste"));
// --- Fin composition root ---

/* ---------- Navegación entre vistas ---------- */
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", async () => {
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("is-active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-active"));
    btn.classList.add("is-active");
    document.getElementById(`view-${btn.dataset.view}`).classList.add("is-active");

    if (btn.dataset.view === "guardados") await cargarInformesGuardados();
    if (btn.dataset.view === "sensores") await cargarTablaSensores();
  });
});

/* ---------- Vista: crear informe ---------- */
async function cargarSensores(categoria = "") {
  const sensores = await sensorService.listar(categoria);
  sensorSelector.setSensores(sensores);
}

sensorSelector.onCategoriaChange((categoria) => cargarSensores(categoria));

document.getElementById("btn-generar").addEventListener("click", async () => {
  const name = document.getElementById("report-name").value.trim() || "Informe sin título";
  const desde = document.getElementById("fecha-desde").value;
  const hasta = document.getElementById("fecha-hasta").value;
  const entityIds = sensorSelector.getSeleccionados();

  if (!desde || !hasta) return alert("Selecciona un rango de fechas.");
  if (!entityIds.length) return alert("Selecciona al menos un dispositivo.");

  const btn = document.getElementById("btn-generar");
  btn.disabled = true;
  btn.textContent = "Generando…";

  try {
    const informe = await reportService.crear({ name, entityIds, desde, hasta });
    reportView.render(informe);
  } catch (err) {
    alert(`No se pudo generar el informe: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = "Generar informe";
  }
});

/* ---------- Vista: informe de coste ---------- */
document.getElementById("btn-calcular-coste").addEventListener("click", async () => {
  const desde = document.getElementById("coste-desde").value;
  const hasta = document.getElementById("coste-hasta").value;
  const importeReal = document.getElementById("coste-importe-real").value.trim();

  if (!desde || !hasta) return alert("Selecciona un rango de fechas.");

  const btn = document.getElementById("btn-calcular-coste");
  btn.disabled = true;
  btn.textContent = "Calculando…";

  try {
    const resultado = await costService.estimar(desde, hasta, importeReal || null);
    costReportView.render(resultado);
  } catch (err) {
    alert(`No se pudo calcular el coste: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = "Calcular";
  }
});

/* ---------- Vista: informes guardados ---------- */
async function cargarInformesGuardados() {
  const informes = await reportService.listar();
  reportListView.render(informes, async (id) => {
    const informe = await reportService.obtener(id);
    // Reutilizamos la vista "crear informe" para mostrar el detalle
    document.querySelector('[data-view="crear"]').click();
    reportView.render(informe);
  });
}

/* ---------- Vista: catálogo de sensores ---------- */
async function cargarTablaSensores() {
  const sensores = await sensorService.listar();
  const contenedor = document.getElementById("tabla-sensores");
  contenedor.innerHTML = `
    <table class="sensor-table">
      <thead>
        <tr><th>Sensor</th><th>entity_id</th><th>Categoría</th><th>Prioridad</th><th>Unidad</th></tr>
      </thead>
      <tbody>
        ${sensores
          .map(
            (s) => `
          <tr>
            <td>${s.friendly_name}</td>
            <td class="entity">${s.entity_id}</td>
            <td>${s.category}</td>
            <td>${s.priority}</td>
            <td>${s.unit || "—"}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

/* ---------- Autenticación ---------- */
document.getElementById("btn-logout").addEventListener("click", async () => {
  await api.post("/auth/logout", {}).catch(() => {});
  window.location.href = "/login.html";
});

async function comprobarSesion() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" });
  if (!res.ok) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

/* ---------- Arranque ---------- */
comprobarSesion().then((autenticado) => {
  if (autenticado) cargarSensores();
});
