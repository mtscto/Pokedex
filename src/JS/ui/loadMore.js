import { store } from "../state/store.js";

let onLoadMoreCallback = null;

function initLoadMore({ onLoadMore }) {
    onLoadMoreCallback = onLoadMore;
}

function createLoadMoreButton() {
    const btn = document.createElement("button");
    btn.id = "loadMoreButton";
    btn.classList.add("btn", "btn-load");
    btn.textContent = "Load more";

    btn.addEventListener("click", () => {
        store.currentPage++;

        if (typeof onLoadMoreCallback === "function") {
            onLoadMoreCallback();
        }
    });

    return btn;
}

function ensureLoadMoreButton(container) {
    if (!document.getElementById("loadMoreButton")) {
        container.after(createLoadMoreButton());
    }
}

export {
    initLoadMore,
    ensureLoadMoreButton
};
