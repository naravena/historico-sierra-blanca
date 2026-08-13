/**
 * Responsabilidad única: renderizar el selector de sensores y
 * mantener el conjunto de seleccionados. No sabe nada de la API
 * ni de cómo se genera un informe.
 */
export class SensorSelectorView {
  constructor(container, tabsContainer) {
    this.container = container;
    this.tabsContainer = tabsContainer;
    this.sensores = [];
    this.seleccionados = new Set();
    this.categoriaActiva = "";
  }

  setSensores(sensores) {
    this.sensores = sensores;
    this._render();
  }

  onCategoriaChange(handler) {
    this.tabsContainer.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.tabsContainer.querySelectorAll(".tab").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        this.categoriaActiva = btn.dataset.categoria;
        handler(this.categoriaActiva);
      });
    });
  }

  getSeleccionados() {
    return [...this.seleccionados];
  }

  _render() {
    if (!this.sensores.length) {
      this.container.innerHTML = `<p class="muted">No hay sensores en esta categoría.</p>`;
      return;
    }

    this.container.innerHTML = this.sensores
      .map(
        (s) => `
        <label class="sensor-card ${this.seleccionados.has(s.entity_id) ? "is-checked" : ""}" data-entity="${s.entity_id}">
          <input type="checkbox" value="${s.entity_id}" ${this.seleccionados.has(s.entity_id) ? "checked" : ""} />
          <span class="name">${s.friendly_name}</span>
          <span class="unit">${s.unit || ""}</span>
        </label>`
      )
      .join("");

    this.container.querySelectorAll(".sensor-card").forEach((card) => {
      const checkbox = card.querySelector("input");
      checkbox.addEventListener("change", () => {
        const id = card.dataset.entity;
        if (checkbox.checked) {
          this.seleccionados.add(id);
          card.classList.add("is-checked");
        } else {
          this.seleccionados.delete(id);
          card.classList.remove("is-checked");
        }
      });
    });
  }
}
