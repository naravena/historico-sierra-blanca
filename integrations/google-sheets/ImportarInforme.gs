/**
 * Apps Script para importar un informe del Portal de Histórico HA
 * directamente a una hoja de Google Sheets.
 *
 * REQUISITO IMPORTANTE: Google ejecuta este script en sus propios
 * servidores (en internet), no en tu red local. Por tanto BACKEND_URL
 * no puede ser "http://localhost:3000" ni una IP interna (192.168.x.x) -
 * necesitas exponer tu backend a internet primero, por ejemplo con
 * Tailscale Funnel o Cloudflare Tunnel. Si no quieres montar eso,
 * usa en su lugar la vía manual: descarga el CSV desde el portal
 * (botón "Descargar informe (CSV)") y en Google Sheets ve a
 * Archivo -> Importar -> Subir, y selecciona el fichero. Sin infraestructura
 * adicional, funciona igual de bien, solo que no se actualiza sola.
 *
 * Instalación (si ya tienes el backend expuesto a internet):
 * 1. Abre tu Google Sheet -> Extensiones -> Apps Script
 * 2. Borra el contenido de Code.gs y pega este archivo
 * 3. Cambia BACKEND_URL por la URL pública real de tu backend
 * 4. Guarda y recarga la hoja de cálculo - aparecerá un menú "Histórico HA"
 * 5. Usa "Histórico HA -> Importar informe por ID"
 *    (el ID lo ves en la URL del portal al abrir un informe guardado)
 */

const BACKEND_URL = "https://TU-DOMINIO-O-TUNEL.example.com";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Histórico HA")
    .addItem("Importar informe por ID", "importarInformePorId")
    .addToUi();
}

function importarInformePorId() {
  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.prompt("ID del informe guardado (visible en la URL del portal al abrirlo)");
  if (respuesta.getSelectedButton() !== ui.Button.OK) return;

  const id = respuesta.getResponseText().trim();
  const url = `${BACKEND_URL}/api/reports/${id}/export.csv`;

  const respuestaHttp = UrlFetchApp.fetch(url);
  const csv = respuestaHttp.getContentText();
  const filas = Utilities.parseCsv(csv);

  const nombreHoja = `Informe_${id}_${new Date().getTime()}`;
  const hoja = SpreadsheetApp.getActiveSpreadsheet().insertSheet(nombreHoja);
  hoja.getRange(1, 1, filas.length, filas[0].length).setValues(filas);
  hoja.autoResizeColumns(1, filas[0].length);
}
