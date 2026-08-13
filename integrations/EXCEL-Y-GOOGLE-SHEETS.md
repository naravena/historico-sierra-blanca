# Integración con Excel y Google Sheets

Se añadió exportación a CSV al backend (`ExportController` + `csvBuilder.js`), reutilizando exactamente los mismos servicios que ya calculan las estadísticas — no hay lógica duplicada.

**Nuevos endpoints:**
- `GET /api/sensors/:entityId/export.csv?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` — lecturas en bruto de un sensor
- `GET /api/reports/:id/export.csv` — resumen estadístico completo de un informe guardado

En el portal, cada tarjeta de sensor y la cabecera del informe ya tienen un botón de descarga.

---

## Microsoft Excel — funciona hoy, sin infraestructura extra

Excel corre en tu propio ordenador, en la misma red que el backend, así que puede llamarlo directamente:

1. **Datos → Obtener datos → De otras fuentes → Desde la Web** (o "Power Query")
2. Pega la URL, por ejemplo:
   ```
   http://192.168.1.XX:3000/api/reports/1/export.csv
   ```
   (usa la IP de tu servidor de Home Assistant en la red local, no `localhost`, salvo que Excel corra en la misma máquina)
3. Excel detecta el CSV automáticamente y lo carga como tabla
4. Con **Actualizar** (botón derecho sobre la tabla, o Datos → Actualizar todo) vuelve a pedir los datos más recientes — informe siempre al día sin descargar nada a mano

---

## Google Sheets — dos vías

### Vía simple (recomendada para empezar, cero configuración)
1. En el portal, pulsa **"Descargar informe (CSV)"**
2. En Google Sheets: **Archivo → Importar → Subir** → selecciona el fichero descargado
3. Repite cuando quieras datos más recientes

### Vía automática (requiere exponer el backend a internet)
Google ejecuta sus scripts en sus propios servidores, así que **no puede alcanzar tu backend si solo vive en tu red local** (`localhost` o una IP `192.168.x.x` no le sirven de nada a Google). Para una actualización automática necesitas:

1. Exponer tu backend a internet de forma seguem — por ejemplo con **Tailscale Funnel** o **Cloudflare Tunnel** (gratuitos, no requieren abrir puertos en el router directamente)
2. Usar el script `integrations/google-sheets/ImportarInforme.gs` incluido en el proyecto — pégalo en **Extensiones → Apps Script** de tu hoja, cambia `BACKEND_URL` por tu URL pública, y tendrás un menú "Histórico HA → Importar informe por ID"

Si no te interesa montar el túnel ahora, la vía simple (descarga manual + importar) te sirve exactamente igual, solo que sin autoactualización.
