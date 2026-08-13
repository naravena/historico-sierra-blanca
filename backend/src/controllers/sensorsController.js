/** Responsabilidad única: traducir peticiones HTTP a llamadas de SensorService. */
class SensorsController {
  constructor(sensorService) {
    this.sensorService = sensorService;
  }

  listar = async (req, res, next) => {
    try {
      const sensores = await this.sensorService.listar(req.query.categoria);
      res.json(sensores);
    } catch (err) {
      next(err);
    }
  };

  obtener = async (req, res, next) => {
    try {
      const sensor = await this.sensorService.obtener(req.params.entityId);
      res.json(sensor);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = SensorsController;
