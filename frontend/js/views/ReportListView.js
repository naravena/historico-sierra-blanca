/** Responsabilidad única: pintar la lista de informes guardados. */
export class ReportListView {
  constructor(container) {
    this.container = container;
  }

  render(informes, onSeleccionar) {
    if (!informes.length) {
      this.container.innerHTML = `<p class="muted">Todavía no has guardado ningún informe.</p>`;
      return;
    }

    this.container.innerHTML = informes
      .map(
        (r) => `
        <div class="report-list-item" data-id="${r.id}">
          <div>
            <div class="name">${r.name}</div>
            <div class="meta">${r.desde} → ${r.hasta} · ${r.entityIds.length} sensores</div>
          </div>
          <span class="muted">Ver →</span>
        </div>`
      )
      .join("");

    this.container.querySelectorAll(".report-list-item").forEach((el) => {
      el.addEventListener("click", () => onSeleccionar(el.dataset.id));
    });
  }
}
