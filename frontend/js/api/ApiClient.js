/**
 * Responsabilidad única: hacer peticiones HTTP a la API y devolver JSON,
 * lanzando errores legibles. Nadie más en el frontend usa `fetch`
 * directamente - así, si el día de mañana cambia el transporte
 * (p. ej. a GraphQL), solo se toca este fichero.
 *
 * `credentials: "include"` es necesario para que la cookie de sesión
 * (httpOnly) viaje en cada petición. Si la sesión ha caducado (401),
 * redirige automáticamente al login en vez de dejar la vista rota.
 */
export class ApiClient {
  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  async get(path) {
    return this._handle(await fetch(`${this.baseUrl}${path}`, { credentials: "include" }));
  }

  async post(path, body) {
    return this._handle(
      await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    );
  }

  async delete(path) {
    return this._handle(
      await fetch(`${this.baseUrl}${path}`, { method: "DELETE", credentials: "include" })
    );
  }

  async _handle(response) {
    if (response.status === 401) {
      window.location.href = "/login.html";
      throw new Error("Sesión no válida, redirigiendo al login…");
    }
    if (response.status === 204) return null;
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.error || `Error HTTP ${response.status}`);
    }
    return data;
  }
}
