class StatsController {
  constructor(statsService) {
    this.statsService = statsService;
  }

  calcular = async (req, res, next) => {
    try {
      const { entityId } = req.params;
      const { desde, hasta } = req.query;
      if (!desde || !hasta) {
        return res.status(400).json({ error: "Los parámetros 'desde' y 'hasta' son obligatorios (YYYY-MM-DD)" });
      }
      const resultado = await this.statsService.calcular(entityId, desde, hasta);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  };

  comparar = async (req, res, next) => {
    try {
      const { entityIds, desde, hasta } = req.body;
      if (!Array.isArray(entityIds) || !entityIds.length || !desde || !hasta) {
        return res.status(400).json({ error: "Se requieren entityIds (array), desde y hasta" });
      }
      const resultado = await this.statsService.compararVarios(entityIds, desde, hasta);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = StatsController;
