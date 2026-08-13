/** Responsabilidad única: operaciones relacionadas con el catálogo de sensores. */
export class SensorService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  listar(categoria = "") {
    const query = categoria ? `?categoria=${encodeURIComponent(categoria)}` : "";
    return this.api.get(`/sensors${query}`);
  }
}
