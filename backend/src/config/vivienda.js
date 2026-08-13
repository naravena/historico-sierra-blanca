/**
 * Qué sensor representa el "consumo general de la casa" y en qué unidad
 * llega, para el informe de coste. Se saca a variables de entorno a
 * propósito: es lo único que cambia entre viviendas que reutilicen este
 * mismo código (ver NUEVA-VIVIENDA.md) - todo lo demás (arquitectura,
 * rutas, portal) es igual para cualquier casa.
 */
require("dotenv").config();

module.exports = {
  entityIdConsumoGeneral:
    process.env.MAIN_CONSUMPTION_ENTITY_ID || "sensor.medidor_kwh_potencia_acumulada",
  // "Wh" o "kWh" - en qué unidad reporta ese sensor en Home Assistant
  unidadConsumoGeneral: process.env.MAIN_CONSUMPTION_UNIT || "Wh",
};
