const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const pool = require("./config/db");
const authConfig = require("./config/auth");
const tarifa = require("./config/tarifa");
const viviendaConfig = require("./config/vivienda");

// Infraestructura (implementaciones concretas)
const PostgresSensorRepository = require("./infrastructure/PostgresSensorRepository");
const PostgresReadingRepository = require("./infrastructure/PostgresReadingRepository");
const PostgresReportRepository = require("./infrastructure/PostgresReportRepository");

// Servicios (lógica de negocio, dependen solo de interfaces)
const SensorService = require("./services/SensorService");
const StatsService = require("./services/StatsService");
const ReportService = require("./services/ReportService");
const CostCalculator = require("./services/CostCalculator");
const CostService = require("./services/CostService");
const AuthService = require("./services/AuthService");

// Controladores
const SensorsController = require("./controllers/sensorsController");
const StatsController = require("./controllers/statsController");
const ReportsController = require("./controllers/reportsController");
const ExportController = require("./controllers/exportController");
const CostController = require("./controllers/costController");
const crearAuthController = require("./controllers/authController");

const crearAuthMiddleware = require("./middleware/authMiddleware");
const crearRouter = require("./routes");

// --- Composition root: aquí, y solo aquí, se eligen las implementaciones concretas ---
const sensorRepository = new PostgresSensorRepository(pool);
const readingRepository = new PostgresReadingRepository(pool);
const reportRepository = new PostgresReportRepository(pool);

const sensorService = new SensorService(sensorRepository);
const statsService = new StatsService(sensorRepository, readingRepository);
const reportService = new ReportService(statsService, reportRepository);
const costCalculator = new CostCalculator(tarifa);
const costService = new CostService(statsService, costCalculator, viviendaConfig);
const authService = new AuthService(authConfig);

const sensorsController = new SensorsController(sensorService);
const statsController = new StatsController(statsService);
const reportsController = new ReportsController(reportService);
const exportController = new ExportController(readingRepository, reportService);
const costController = new CostController(costService);
const authController = crearAuthController(authService, authConfig);
const authMiddleware = crearAuthMiddleware(authService, authConfig.cookieName);
// --- Fin composition root ---

const app = express();
app.set("trust proxy", 1); // necesario en Vercel para que express-rate-limit vea la IP real
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public")); // sirve el frontend si se copia a backend/public

// Limita los intentos de login: 8 intentos cada 15 min por IP, frena fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Espera unos minutos antes de volver a intentarlo." },
});

// --- Rutas públicas (sin sesión) ---
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.post("/api/auth/login", loginLimiter, authController.login);

// --- A partir de aquí, todo exige sesión válida ---
app.post("/api/auth/logout", authMiddleware, authController.logout);
app.get("/api/auth/me", authMiddleware, authController.yo);

app.use(
  "/api",
  authMiddleware,
  crearRouter({ sensorsController, statsController, reportsController, exportController, costController })
);

// Manejador de errores centralizado - cada controlador solo hace next(err)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

module.exports = app;
