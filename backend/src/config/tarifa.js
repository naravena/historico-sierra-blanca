/**
 * Configuración de la tarifa eléctrica actual (extraída de la factura de
 * Repsol 28/06/2026 - 21/07/2026, comprobada al céntimo contra el desglose
 * real de la factura). Vive en un fichero aparte a propósito: cuando la
 * tarifa cambie, solo se edita esto - nada más del sistema depende de
 * dónde vienen estos números.
 *
 * Producto: 2.0TD - "Tarifa Sin Horarios - Asistente 24 Horas Plus" (Repsol)
 */
module.exports = {
  potenciaContratadaKw: 3.3,
  numPeriodosPotencia: 2, // la factura factura el término fijo 2 veces (Periodo 1 y 2), al mismo precio
  precioPotenciaDiaKwDia: 0.090136986, // €/kW·día, por periodo

  precioEnergiaKwh: 0.0999, // €/kWh, tarifa plana sin franjas horarias

  alquilerContadorDiario: 0.61 / 23, // €/día (derivado de la factura: 0,61€ en 23 días)
  financiacionBonoSocialDiario: 0.02468848, // €/día (tarifa vigente desde 01/07/2026)

  tasaImpuestoElectrico: 0.0511269632, // sobre (fijo + energía + bono social, SIN alquiler de contador)
  tasaIva: 0.21, // sobre todo lo anterior + impuesto eléctrico
};
