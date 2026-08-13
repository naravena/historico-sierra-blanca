/** Responsabilidad única: llamar al endpoint del informe de coste. */
export class CostService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  estimar(desde, hasta, importeReal) {
    const params = new URLSearchParams({ desde, hasta });
    if (importeReal !== null && importeReal !== "") params.set("importeReal", importeReal);
    return this.api.get(`/cost-report?${params.toString()}`);
  }
}
