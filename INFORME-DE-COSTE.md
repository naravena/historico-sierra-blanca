# Informe de coste eléctrico (añadido a la Fase 5)

Combina el consumo real registrado en Supabase (`sensor.medidor_kwh_potencia_acumulada`) con tu tarifa eléctrica para estimar cuánto deberías pagar — y compararlo con tu factura real.

## Arquitectura (mismo patrón que el resto del proyecto)

- **`config/tarifa.js`** — los precios de tu tarifa (2.0TD, Repsol), en un fichero aparte para poder actualizarlos cuando cambien sin tocar nada más.
- **`CostCalculator`** — aplica la fórmula pura (kWh + días → desglose en €). No sabe nada de Supabase ni de HTTP.
- **`CostService`** — compone `StatsService` (consumo real) + `CostCalculator` (fórmula), igual que `ReportService` compone piezas existentes.
- **`CostController`** + ruta `GET /api/cost-report?desde=&hasta=&importeReal=` (este último parámetro es opcional, para comparar contra tu factura real).

## Precisión verificada

La fórmula se contrastó línea a línea contra tu factura real de Repsol (28/06 - 21/07/2026) y reproduce el total casi exacto (39,36 € calculado vs. 39,34 € real — 2 céntimos de diferencia, por el cambio de tarifa de Bono Social a mitad de aquel periodo concreto). En periodos que no crucen un cambio normativo de precios, la precisión debería ser exacta al céntimo.

## Cuándo actualizar `tarifa.js`

Cada vez que te llegue una factura con precios distintos (revisión de tarifa, cambio de comercializadora, etc.), actualiza los valores en ese fichero. Si en el futuro cambias de tarifa varias veces y quieres que los informes de periodos antiguos seas precisos con la tarifa que tenías entonces, se podría pasar esta configuración a una tabla en Supabase con fechas de vigencia — no se ha hecho ahora por simplicidad, ya que de momento solo tienes una tarifa activa.

## Uso en el portal

Nueva pestaña **"Informe de coste"**: eliges rango de fechas, opcionalmente pegas el importe real de tu próxima factura, y ves el desglose estimado (término fijo, energía, otros conceptos, impuestos, total) junto a la comparación.
