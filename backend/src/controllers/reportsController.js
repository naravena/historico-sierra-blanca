class ReportsController {
  constructor(reportService) {
    this.reportService = reportService;
  }

  crear = async (req, res, next) => {
    try {
      const informe = await this.reportService.crear(req.body);
      res.status(201).json(informe);
    } catch (err) {
      next(err);
    }
  };

  listar = async (req, res, next) => {
    try {
      res.json(await this.reportService.listar());
    } catch (err) {
      next(err);
    }
  };

  obtener = async (req, res, next) => {
    try {
      res.json(await this.reportService.obtener(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  eliminar = async (req, res, next) => {
    try {
      await this.reportService.eliminar(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ReportsController;
