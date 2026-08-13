/** Responsabilidad única: operaciones relacionadas con informes. */
export class ReportService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  crear({ name, entityIds, desde, hasta }) {
    return this.api.post("/reports", { name, entityIds, desde, hasta });
  }

  listar() {
    return this.api.get("/reports");
  }

  obtener(id) {
    return this.api.get(`/reports/${id}`);
  }

  eliminar(id) {
    return this.api.delete(`/reports/${id}`);
  }
}
