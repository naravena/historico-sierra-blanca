# Fase 5 (revisada) – Portal Web de Informes

> **Nota:** las instrucciones de instalación de este documento son de la primera versión (solo local, sin login). Para instalación local actual, GitHub y despliegue en Vercel con autenticación, usa **`DEPLOY.md`** en la raíz del proyecto — es la guía vigente.

**Proyecto:** Plataforma de Histórico e Informes para Home Assistant
**Cambio respecto al plan original:** esta fase pasa de ser un script de consultas en Python a un **portal web** (backend Node.js + frontend JS), para poder crear y gestionar informes desde el navegador. La hoja de ruta original marcaba el Dashboard Web como Fase 9 ("futuro") — se adelanta aquí de forma justificada porque es lo que necesitas ahora para maniobrar los informes cómodamente. El resto de fases (6-9) no cambian: el generador de PDF de la Fase 6 puede llamar a esta misma API en vez de al script Python.

---

## 1. Arquitectura y por qué aplica SOLID

```
backend/
  src/
    domain/              <- Interfaces (contratos), no dependen de nada
      ISensorRepository.js
      IReadingRepository.js
      IReportRepository.js
    infrastructure/       <- Implementaciones concretas (Postgres)
      PostgresSensorRepository.js
      PostgresReadingRepository.js
      PostgresReportRepository.js
    services/              <- Lógica de negocio, depende solo de interfaces
      SensorService.js
      StatsService.js
      ReportService.js
      strategies/           <- Cálculo de estadísticas (Strategy pattern)
        IStatsStrategy.js
        CumulativeStatsStrategy.js
        InstantaneousStatsStrategy.js
    controllers/           <- Traducen HTTP <-> servicios, sin lógica propia
    routes/
    app.js                 <- Composition root: aquí se conecta todo
  server.js

frontend/
  js/
    api/ApiClient.js       <- Única pieza que sabe hacer fetch()
    services/               <- Envuelven ApiClient con operaciones de dominio
    views/                  <- Solo pintan HTML, no saben de la API
    main.js                 <- Composition root del frontend
```

| Principio | Dónde se aplica |
|---|---|
| **S** — Responsabilidad única | Cada clase hace una cosa: un repositorio solo accede a datos, un servicio solo tiene lógica, un controlador solo traduce HTTP, una vista solo pinta HTML |
| **O** — Abierto/cerrado | `IStatsStrategy` permite añadir un nuevo tipo de cálculo (ej. un sensor booleano) creando una clase nueva, sin tocar `StatsService` ni las estrategias existentes |
| **L** — Sustitución de Liskov | `PostgresSensorRepository` es intercambiable por cualquier otra clase que cumpla `ISensorRepository` (por ejemplo, una versión en memoria para tests) sin que `SensorService` note la diferencia |
| **I** — Segregación de interfaces | `ISensorRepository` e `IReadingRepository` están separadas a propósito — nadie que solo necesite el catálogo depende de métodos de lecturas |
| **D** — Inversión de dependencias | Los servicios reciben los repositorios por constructor (inyección de dependencias); `app.js` es el único sitio que conecta interfaces con implementaciones concretas |

**Beneficio práctico para ti:** si en el futuro migras de Supabase a otra base de datos, o quieres testear los servicios sin conectar a una BD real, solo tocas la carpeta `infrastructure/` — el resto del código (servicios, controladores, frontend) no cambia.

---

## 2. Qué hace el portal

- **Crear informe**: eliges nombre, rango de fechas y dispositivos (filtrables por energía/clima/infraestructura) → genera estadísticas y gráficas al momento, y lo guarda en Supabase.
- **Informes guardados**: lista los informes creados; al abrir uno, los datos se recalculan en vivo (siempre reflejan el histórico más reciente, no una foto fija).
- **Catálogo de sensores**: tabla de referencia de los 18 sensores de la Fase 1.

Los cálculos reutilizan exactamente la misma lógica que ya diseñamos en la Fase 5 original (Python): consumo por deltas positivos para sensores acumulativos (ignorando los resets de los enchufes Tuya), y promedio/máximo/mínimo para instantáneos.

---

## 3. Instalación

### Migración previa en Supabase
Ejecuta en el SQL Editor:
1. La migración `is_cumulative` (si no la ejecutaste ya en la Fase 5 original)
2. `backend/src/sql/migration_reports.sql` (tabla nueva para guardar informes)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tu SUPABASE_DB_URL real (Project Settings -> Database -> Connection string)
npm start
```
Por defecto arranca en `http://localhost:3000`.

### Frontend
Es estático — dos opciones:

**Opción simple:** copia la carpeta `frontend/*` dentro de `backend/public/` (ya está previsto en `app.js`, que sirve `public/` como estáticos) y abre `http://localhost:3000`.

```bash
cp -r frontend/* backend/public/
```

**Opción alternativa:** sirve `frontend/` con cualquier servidor estático (ej. `npx serve frontend`) en otro puerto — funciona igual porque el frontend llama a `/api/...` como ruta relativa (tendrías que ajustar `ApiClient` con la URL completa del backend si usas puertos distintos, o configurar CORS, que ya está habilitado).

---

## 4. Checklist de cierre de la Fase 5 (portal web)

- [ ] Migración `is_cumulative` ejecutada (si no se hizo antes)
- [ ] Migración `report_definitions` ejecutada
- [ ] `backend/.env` configurado con `SUPABASE_DB_URL`
- [ ] `npm install` + `npm start` arrancan sin errores
- [ ] Frontend copiado a `backend/public/` (o servido aparte) y accesible en el navegador
- [ ] Catálogo de sensores se ve correctamente en la pestaña "Catálogo de sensores"
- [ ] Crear un informe de prueba con 2-3 sensores (mezcla energía + clima) y confirmar que las tarjetas y gráficas tienen sentido
- [ ] Recargar la pestaña "Informes guardados" y confirmar que el informe de prueba aparece y se puede reabrir

Con esto, la Fase 5 queda como el portal de consulta e informes en vivo. La Fase 6 (generador de PDF) puede construirse como una función adicional que llama a `GET /api/reports/:id` y maqueta el resultado en un documento, sin duplicar lógica.
