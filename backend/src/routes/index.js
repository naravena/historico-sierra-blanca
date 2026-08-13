const { Router } = require("express");

/**
 * Recibe los controladores ya construidos (inyección de dependencias)
 * en vez de instanciarlos aquí - las rutas no conocen cómo se construyen
 * sus dependencias, solo las usan.
 */
function crearRouter({ sensorsController, statsController, reportsController, exportController, costController }) {
  const router = Router();

  router.get("/sensors", sensorsController.listar);
  router.get("/sensors/:entityId", sensorsController.obtener);
  router.get("/sensors/:entityId/stats", statsController.calcular);
  router.get("/sensors/:entityId/export.csv", exportController.exportarLecturas);

  router.post("/stats/compare", statsController.comparar);

  router.post("/reports", reportsController.crear);
  router.get("/reports", reportsController.listar);
  router.get("/reports/:id", reportsController.obtener);
  router.get("/reports/:id/export.csv", exportController.exportarInforme);
  router.delete("/reports/:id", reportsController.eliminar);

  router.get("/cost-report", costController.estimar);

  return router;
}

module.exports = crearRouter;
