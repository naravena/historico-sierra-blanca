class CostController {
  constructor(costService) {
    this.costService = costService;
  }

  estimar = async (req, res, next) => {
    try {
      const { desde, hasta, importeReal } = req.query;
      if (!desde || !hasta) {
        return res.status(400).json({ error: "Los parámetros 'desde' y 'hasta' son obligatorios (YYYY-MM-DD)" });
      }
      const importe = importeReal !== undefined ? parseFloat(importeReal) : null;
      const resultado = await this.costService.estimar(desde, hasta, importe);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CostController;
