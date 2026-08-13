class IReportRepository {
  async findAll() {
    throw new Error("IReportRepository.findAll no implementado");
  }

  async findById(_id) {
    throw new Error("IReportRepository.findById no implementado");
  }

  /** @returns {Promise<object>} el informe creado, con su id */
  async create(_definicion) {
    throw new Error("IReportRepository.create no implementado");
  }

  async delete(_id) {
    throw new Error("IReportRepository.delete no implementado");
  }
}

module.exports = IReportRepository;
