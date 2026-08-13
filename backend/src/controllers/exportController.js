const { lecturasACsv, informeACsv } = require("../utils/csvBuilder");

/**
 * Responsabilidad única: exponer los datos ya calculados por otros
 * servicios en formato CSV descargable. No calcula nada él mismo -
 * delega en IReadingRepository y ReportService, igual que el resto
 * de controladores.
 */
class ExportController {
  constructor(readingRepository, reportService) {
    this.readingRepository = readingRepository;
    this.reportService = reportService;
  }

  exportarLecturas = async (req, res, next) => {
    try {
      const { entityId } = req.params;
      const { desde, hasta } = req.query;
      if (!desde || !hasta) {
        return res.status(400).json({ error: "Los parámetros 'desde' y 'hasta' son obligatorios (YYYY-MM-DD)" });
      }
      const lecturas = await this.readingRepository.findByEntityIdAndRange(entityId, desde, hasta);
      const csv = lecturasACsv(lecturas);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${entityId}_${desde}_${hasta}.csv"`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  };

  exportarInforme = async (req, res, next) => {
    try {
      const informe = await this.reportService.obtener(req.params.id);
      const csv = informeACsv(informe);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="informe_${req.params.id}.csv"`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ExportController;
