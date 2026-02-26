import { store } from "../state/store.js";

export function initViewToggle({ onViewChange }) {
    const viewButtons = document.querySelectorAll(".view-btn");

    viewButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            viewButtons.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");

            store.currentViewMode = btn.dataset.view;
            store.currentPage = 1;

            if (typeof onViewChange === "function") {
                onViewChange();
            }
        });
    });
}

