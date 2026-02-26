import { store } from "../state/store.js";
import { openModal } from "./modal.js";

let configContainer = null;
let touchStartX = 0;
let touchEndX = 0;

/* ============================
   INIT
============================ */

export function initModalNavigation({ config }) {
    configContainer = config;

    document.addEventListener("keydown", handleKeyNavigation);

    configContainer?.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    configContainer?.addEventListener("touchend", e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

/* ============================
   BUTTON STATE
============================ */

export function updateModalNavigation(container) {
    if (!container) return;

    const prevBtn = container.querySelector(".modal-prev");
    const nextBtn = container.querySelector(".modal-next");

    if (!prevBtn || !nextBtn) return;

    prevBtn.classList.toggle("disabled", store.currentIndex <= 0);
    nextBtn.classList.toggle(
        "disabled",
        store.currentIndex >= store.currentList.length - 1
    );
}

/* ============================
   NAVIGATION
============================ */

export function goPrev() {
    if (store.currentIndex <= 0) return;

    store.currentIndex--;
    openModal(store.currentList[store.currentIndex], true);
}

export function goNext() {
    if (store.currentIndex >= store.currentList.length - 1) return;

    store.currentIndex++;
    openModal(store.currentList[store.currentIndex], true);
}

/* ============================
   KEYBOARD
============================ */

function handleKeyNavigation(e) {
    if (!configContainer || configContainer.style.display !== "flex") return;

    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
}

/* ============================
   SWIPE
============================ */

function handleSwipe() {
    const delta = touchEndX - touchStartX;

    if (Math.abs(delta) < 50) return;

    if (delta > 0) goPrev();
    else goNext();
}