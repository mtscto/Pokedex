import { store } from "../state/store.js";

export function initFilters({ onFilterChange }) {
    const filterButtons = document.querySelectorAll(".filter-btn");

    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.type;

            // ===== ALL (reset total) =====
            if (type === "all") {
                store.activeFilters = new Set(["all"]);
            } else {
                // Remove "all" se outro filtro for clicado
                store.activeFilters.delete("all");

                if (store.activeFilters.has(type)) {
                    store.activeFilters.delete(type);
                } else {
                    store.activeFilters.add(type);
                }

                // Se nenhum filtro restar → volta para ALL
                if (store.activeFilters.size === 0) {
                    store.activeFilters.add("all");
                }
            }

            // ===== Atualiza estado visual =====
            filterButtons.forEach(btn => {
                btn.classList.toggle(
                    "is-active",
                    store.activeFilters.has(btn.dataset.type)
                );
            });

            // ===== Dispara atualização =====
            if (typeof onFilterChange === "function") {
                onFilterChange();
            }
        });
    });
}
